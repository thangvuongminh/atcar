import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../store/axiosClient";
import { QRCodeCanvas } from "qrcode.react";
import {
  Package,
  ArrowLeft,
  Clock,
  ShoppingBag,
  CreditCard,
  Loader,
  XCircle,
  CheckCircle,
  AlertTriangle,
  Smartphone,
} from "lucide-react";
import toast from "react-hot-toast";

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // State cho Thanh toán (MoMo)
  const [paymentUrl, setPaymentUrl] = useState("");
  const [isQrLoading, setIsQrLoading] = useState(false);

  // State Đếm ngược
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchOrders();
    if (location.state?.newOrder) {
      setSelectedOrder(location.state.newOrder);
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  // Logic: Khi mở đơn hàng Pending -> Tự động gọi API lấy QR MoMo
  useEffect(() => {
    if (selectedOrder && selectedOrder.orderStatus === "PENDING_PAYMENT") {
      const createdTime = parseDate(selectedOrder.create_At);
      const expireTime = createdTime + 5 * 60 * 1000; // 5 phút
      const now = Date.now();

      if (now > expireTime) {
        setIsExpired(true);
        setTimeLeft(0);
      } else {
        setIsExpired(false);
        if (!paymentUrl) {
          fetchMomoQR(selectedOrder);
        }
      }
    } else {
      setPaymentUrl("");
      setIsExpired(false);
    }
  }, [selectedOrder]);

  // Logic: Đếm ngược
  useEffect(() => {
    let timer;
    if (
      selectedOrder &&
      selectedOrder.orderStatus === "PENDING_PAYMENT" &&
      !isExpired
    ) {
      const createdTime = parseDate(selectedOrder.create_At);
      const expireTime = createdTime + 5 * 60 * 1000;

      timer = setInterval(() => {
        const now = Date.now();
        const distance = expireTime - now;

        if (distance < 0) {
          setTimeLeft(0);
          setIsExpired(true);
          setPaymentUrl("");
          clearInterval(timer);
        } else {
          setTimeLeft(Math.floor(distance / 1000));
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [selectedOrder, isExpired]);

  // API lấy QR
  const fetchMomoQR = async (order) => {
    setIsQrLoading(true);
    try {
      const payload = {
        id: order.id,
        totalPrice: order.totalPrice,
        note: order.note,
        codeDiscount: order.codeDiscount,
        productBuys: [],
      };

      const response = await axiosClient.post("/user/payment", payload);
      const dataObj = response.data ? response.data : response;

      if (dataObj.statusCode === 200 && dataObj.data && dataObj.data.payUrl) {
        setPaymentUrl(dataObj.data.payUrl);
      }
    } catch (error) {
      console.error("Lỗi lấy QR:", error);
      toast.error("Lỗi kết nối cổng thanh toán");
    } finally {
      setIsQrLoading(false);
    }
  };

  const parseDate = (dateStr) => {
    if (!dateStr) return 0;
    try {
      if (dateStr.includes("T") || dateStr.includes("-"))
        return new Date(dateStr).getTime();
      const [datePart, timePart] = dateStr.split(" ");
      const [day, month, year] = datePart.split("/");
      return new Date(
        `${year}-${month}-${day}T${timePart || "00:00"}`
      ).getTime();
    } catch (e) {
      return 0;
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m < 10 ? "0" : ""}${m}:${s < 10 ? "0" : ""}${s}`;
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get("/user/get/all-order");
      const dataObj = response.data ? response.data : response;
      if (dataObj && Array.isArray(dataObj.data)) {
        const sortedOrders = dataObj.data.sort(
          (a, b) =>
            parseDate(b.createdAt || b.create_At) -
            parseDate(a.createdAt || a.create_At)
        );
        setOrders(sortedOrders);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const getProductList = (order) =>
    order.invoicesProductResponses || order.invoiceProducts || [];

  if (loading && !selectedOrder && orders.length === 0)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Loader className="animate-spin text-blue-600" size={40} />
      </div>
    );

  // ===================== VIEW CHI TIẾT ĐƠN HÀNG =====================
  if (selectedOrder) {
    const products = getProductList(selectedOrder);

    return (
      <div className="min-h-screen bg-gray-100 py-8 px-4 font-sans">
        <div className="max-w-7xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => setSelectedOrder(null)}
            className="flex items-center text-gray-500 hover:text-gray-800 mb-6 transition-colors font-medium"
          >
            <ArrowLeft size={20} className="mr-2" /> Quay lại danh sách
          </button>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* --- CỘT TRÁI (8/12): THÔNG TIN & SẢN PHẨM --- */}
            <div className="lg:col-span-8 space-y-6">
              {/* Card 1: Header */}
              <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="text-2xl font-extrabold text-gray-800">
                      Đơn hàng #
                      {selectedOrder.id?.substring(0, 8).toUpperCase()}
                    </h1>
                    <p className="text-gray-500 text-sm mt-1 flex items-center gap-1">
                      <Clock size={14} /> Đặt ngày: {selectedOrder.create_At}
                    </p>
                  </div>
                  <div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        selectedOrder.orderStatus === "PENDING_PAYMENT"
                          ? "bg-orange-50 text-orange-600"
                          : selectedOrder.orderStatus === "CANCELLED"
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {selectedOrder.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card 2: Danh sách sản phẩm */}
              <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100">
                <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50">
                  <h3 className="font-bold text-gray-700 flex items-center gap-2">
                    <ShoppingBag size={18} /> Sản phẩm ({products.length})
                  </h3>
                </div>
                <div className="divide-y divide-gray-100">
                  {products.map((item, index) => {
                    const product = item.productResponse || item.product || {};
                    return (
                      <div
                        key={index}
                        className="p-4 flex gap-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0 bg-white">
                          <img
                            src={`http://localhost:8080/product/${product.url}`}
                            className="w-full h-full object-cover"
                            onError={(e) =>
                              (e.target.src = "https://via.placeholder.com/150")
                            }
                            alt={product.name}
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-800 text-lg mb-1">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 mb-2">
                            Đơn vị: {product.unit}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="text-sm bg-gray-100 px-2 py-1 rounded text-gray-600 font-medium">
                              x{item.quantity}
                            </div>
                            <div className="font-bold text-blue-600 text-lg">
                              {formatCurrency(item.price)}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Tổng tiền Footer */}
                <div className="bg-gray-50 p-6 flex flex-col items-end gap-2 border-t border-gray-100">
                  <div className="flex justify-between w-full max-w-xs text-gray-500 text-sm">
                    <span>Tạm tính</span>
                    <span>{formatCurrency(selectedOrder.totalPrice)}</span>
                  </div>
                  <div className="flex justify-between w-full max-w-xs text-gray-500 text-sm">
                    <span>Phí vận chuyển</span>
                    <span>Miễn phí</span>
                  </div>
                  {selectedOrder.codeDiscount && (
                    <div className="flex justify-between w-full max-w-xs text-green-600 text-sm font-medium">
                      <span>Voucher giảm giá</span>
                      <span>Đã áp dụng ({selectedOrder.codeDiscount})</span>
                    </div>
                  )}
                  <div className="w-full max-w-xs border-t border-gray-200 my-2"></div>
                  <div className="flex justify-between w-full max-w-xs items-center">
                    <span className="font-bold text-gray-800 text-lg">
                      Tổng cộng
                    </span>
                    <span className="font-extrabold text-2xl text-blue-600">
                      {formatCurrency(selectedOrder.totalPrice)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* --- CỘT PHẢI (4/12): TRẠNG THÁI THANH TOÁN --- */}
            <div className="lg:col-span-4">
              {/* LOGIC HIỂN THỊ TRẠNG THÁI */}
              {selectedOrder.orderStatus === "PENDING_PAYMENT" ? (
                <div className="sticky top-6 space-y-4">
                  <div
                    className={`bg-white rounded-3xl shadow-xl overflow-hidden transition-all duration-300 ring-1 ${
                      isExpired ? "ring-gray-200 opacity-75" : "ring-pink-100"
                    }`}
                  >
                    <div className="bg-gradient-to-r from-pink-600 to-rose-500 p-6 text-white text-center relative overflow-hidden">
                      <div className="absolute top-0 left-0 w-full h-full bg-white opacity-10 transform -skew-y-6 translate-y-4"></div>
                      <h2 className="text-xl font-bold relative z-10 flex items-center justify-center gap-2">
                        <Smartphone size={24} /> Quét mã MoMo
                      </h2>
                    </div>

                    <div className="p-8 flex flex-col items-center bg-white">
                      {/* LOGIC QR / EXPIRED */}
                      <div className="relative group">
                        <div className="relative bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
                          {isExpired ? (
                            // TRƯỜNG HỢP 1: PENDING NHƯNG HẾT GIỜ -> FAIL
                            <div className="w-48 h-48 flex flex-col items-center justify-center text-red-500">
                              <XCircle size={40} className="mb-2" />
                              <span className="font-bold text-xs">
                                ĐƠN HÀNG HẾT HẠN
                              </span>
                            </div>
                          ) : isQrLoading ? (
                            <div className="w-48 h-48 flex flex-col items-center justify-center text-pink-600">
                              <Loader className="animate-spin mb-2" size={32} />
                              <span className="font-medium text-xs">
                                Đang tạo QR...
                              </span>
                            </div>
                          ) : paymentUrl ? (
                            <QRCodeCanvas
                              value={paymentUrl}
                              size={200}
                              level={"H"}
                              imageSettings={{
                                src: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
                                height: 34,
                                width: 34,
                                excavate: true,
                              }}
                            />
                          ) : (
                            <div className="w-48 h-48 bg-gray-50 flex items-center justify-center text-gray-400 text-xs">
                              Waiting...
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Timer Countdown (Chỉ hiện khi chưa hết hạn) */}
                      {!isExpired && (
                        <div className="mt-8 w-full">
                          <div className="flex justify-between text-xs text-gray-500 mb-2 uppercase font-bold tracking-wider">
                            <span>Thời gian còn lại</span>
                            <span>{formatTime(timeLeft)}</span>
                          </div>
                          <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                            <div
                              className="bg-gradient-to-r from-pink-500 to-rose-500 h-2.5 rounded-full transition-all duration-1000 ease-linear"
                              style={{ width: `${(timeLeft / 300) * 100}%` }}
                            ></div>
                          </div>
                          <p className="text-center text-xs text-orange-500 mt-4 flex items-center justify-center gap-1 font-medium bg-orange-50 py-2 rounded-lg border border-orange-100">
                            <AlertTriangle size={12} /> Không tắt trình duyệt
                          </p>
                        </div>
                      )}

                      {/* Nút thao tác khi hết hạn */}
                      {isExpired && (
                        <div className="mt-6 text-center">
                          <p className="text-red-600 font-bold mb-2">
                            Đơn hàng đã quá hạn thanh toán
                          </p>
                          <button
                            onClick={() => navigate("/")}
                            className="px-6 py-2 bg-gray-800 text-white rounded-lg text-sm font-medium hover:bg-black transition-colors"
                          >
                            Đặt đơn mới
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : selectedOrder.orderStatus === "CANCELLED" ? (
                // TRƯỜNG HỢP 2: ĐƠN ĐÃ HỦY
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-red-100 sticky top-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
                      <XCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Đơn hàng đã hủy
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Đơn hàng này đã bị hủy.
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-6 w-full py-2 bg-gray-100 text-gray-700 font-bold rounded-lg hover:bg-gray-200"
                    >
                      Về trang chủ
                    </button>
                  </div>
                </div>
              ) : (
                // TRƯỜNG HỢP 3: THÀNH CÔNG (Mặc định cho các trạng thái còn lại)
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-green-100 sticky top-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                      <CheckCircle size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800">
                      Thanh toán thành công
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">
                      Cảm ơn bạn đã mua sắm!
                    </p>
                    <button
                      onClick={() => navigate("/")}
                      className="mt-6 w-full py-2 bg-blue-600 text-white font-bold rounded-lg hover:bg-blue-700"
                    >
                      Tiếp tục mua sắm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ===================== VIEW DANH SÁCH ĐƠN HÀNG =====================
  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8 flex items-center gap-3">
          <Package className="text-blue-600" /> Lịch sử đơn hàng
        </h1>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-12 text-center border border-gray-100">
            <ShoppingBag className="mx-auto h-16 w-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-bold text-gray-800">
              Chưa có đơn hàng
            </h3>
            <p className="text-gray-500">
              Bạn chưa mua gì cả, hãy dạo shop ngay đi!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-blue-300 cursor-pointer transition-all duration-200 group"
              >
                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className="font-bold text-lg text-gray-800">
                        #{order.id.substring(0, 8).toUpperCase()}
                      </span>
                      <span
                        className={`text-xs font-bold px-2 py-1 rounded border ${
                          order.orderStatus === "PENDING_PAYMENT"
                            ? "bg-orange-50 text-orange-600 border-orange-200"
                            : order.orderStatus === "CANCELLED"
                            ? "bg-red-50 text-red-600 border-red-200"
                            : "bg-green-50 text-green-600 border-green-200"
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{order.create_At}</p>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-6">
                    <span className="text-xl font-bold text-blue-600">
                      {formatCurrency(order.totalPrice)}
                    </span>
                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      <ArrowLeft size={16} className="rotate-180" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrdersPage;
