import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Package, Calendar, Tag, Clock } from "lucide-react";

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();


  const orderData = location.state?.orderData;

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  const getStatusColor = (status) => {
    switch (status) {
      case "PENDING_PAYMENT":
        return "bg-yellow-100 text-yellow-700 border-yellow-200";
      case "COMPLETED":
        return "bg-green-100 text-green-700 border-green-200";
      case "CANCELLED":
        return "bg-red-100 text-red-700 border-red-200";
      default:
        return "bg-gray-100 text-gray-700 border-gray-200";
    }
  };

  if (!orderData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <p className="text-gray-500">Không tìm thấy thông tin đơn hàng.</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Xem lịch sử đơn hàng
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
        <Package className="text-blue-600" /> Chi tiết đơn hàng
      </h1>

      <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden mb-6">
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex justify-between items-center flex-wrap gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase font-semibold">
              Mã đơn hàng
            </p>
            <p className="text-sm font-mono font-bold text-gray-800 break-all">
              {orderData.id}
            </p>
          </div>
          <div
            className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(
              orderData.orderStatus
            )}`}
          >
            {orderData.orderStatus}
          </div>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-gray-600">
              <Calendar size={18} />
              <span className="text-sm">
                Ngày tạo:{" "}
                <span className="font-semibold text-gray-800">
                  {orderData.create_At}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Clock size={18} />
              <span className="text-sm">
                Hết hạn:{" "}
                <span className="font-semibold text-gray-800">
                  {orderData.orderExpireTime
                    ? new Date(orderData.orderExpireTime).toLocaleTimeString(
                        "vi-VN"
                      )
                    : "N/A"}
                </span>
              </span>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <Tag size={18} />
              <span className="text-sm">
                Mã giảm giá:{" "}
                <span className="font-semibold text-blue-600">
                  {orderData.codeDiscount || "Không có"}
                </span>
              </span>
            </div>
          </div>

          <div className="space-y-2 bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Ghi chú:</p>
            <p className="font-medium text-gray-800 italic">
              "{orderData.note}"
            </p>
          </div>
        </div>
      </div>

      <h2 className="text-lg font-bold mb-4 text-gray-700">Sản phẩm</h2>
      <div className="space-y-4 mb-8">
        {orderData.invoiceProducts && orderData.invoiceProducts.length > 0 ? (
          orderData.invoiceProducts.map((item, index) => {
            const product = item.product || {};
            return (
              <div
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4"
              >
                <div className="w-20 h-20 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={`http://localhost:8080/product/${product.url}`}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{product.name}</h3>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-blue-600 font-bold">
                      {formatCurrency(product.price)}
                    </span>
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                      Đơn vị: {product.unit}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <p className="text-gray-500 italic">Không có thông tin sản phẩm.</p>
        )}
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-end">
        <div className="text-right">
          <span className="text-gray-600 font-medium mr-4">
            Tổng thành tiền:
          </span>
          <span className="text-3xl font-bold text-blue-600">
            {formatCurrency(orderData.totalPrice)}
          </span>
        </div>
      </div>

      <div className="mt-8 flex justify-center">
        <button
          onClick={() => navigate("/orders")}
          className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
        >
          Quay lại danh sách
        </button>
      </div>
    </div>
  );
};

export default OrderSuccessPage;
