import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../store/axiosClient";
import { useCartStore } from "../store/useCartStore";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingCart,
  ArrowRight,
  FileText,
  Ticket,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

 
  const [subTotal, setSubTotal] = useState(0);

 
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState(null); // Lưu mã đã áp dụng thành công
  const [discountPercent, setDiscountPercent] = useState(0); // Lưu % giảm giá

  const [note, setNote] = useState("");

  const navigate = useNavigate();
  const fetchCartGlobal = useCartStore((state) => state.fetchCart);
  const IMAGE_BASE_URL = "http://localhost:8080/product/";

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    try {
      setLoading(true);
      const response = await axiosClient.get(`/user/get/cart?t=${Date.now()}`);
      const dataObj = response.data ? response.data : response;

      if (dataObj && dataObj.data) {
        const formattedData = dataObj.data.map((item) => ({
          id: item.id,
          name: item.name,
          image: item.url || item.image,
          price: item.price,
          quantity: 1,
          maxStock: item.quantity,
          category: item.brand || "Sản phẩm",
        }));
        setCartItems(formattedData);
        fetchCartGlobal();
      } else {
        setCartItems([]);
      }
    } catch (error) {
      console.error("Lỗi cart:", error);
      toast.error("Không thể tải giỏ hàng");
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    if (cartItems.length > 0) {
      const total = cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      setSubTotal(total);
    } else {
      setSubTotal(0);
    }
  }, [cartItems]);


  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      toast.error("Vui lòng nhập mã giảm giá!");
      return;
    }

    try {
      const response = await axiosClient.get(`/user/check/coupon`, {
        params: { coupon: couponCode },
      });

      const dataObj = response.data ? response.data : response;
      
      const result = dataObj.data !== undefined ? dataObj.data : -1;

      if (result === -1) {
        toast.error("Mã giảm giá không hợp lệ hoặc đã hết lượt!");
        setDiscountPercent(0);
        setAppliedCoupon(null);
      } else {
        toast.success(`Áp dụng thành công! Giảm ${result}%`);
        setDiscountPercent(result);
        setAppliedCoupon(couponCode);
      }
    } catch (error) {
      console.error("Check coupon error:", error);
      toast.error("Lỗi khi kiểm tra mã giảm giá");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountPercent(0);
    setCouponCode("");
    toast.success("Đã gỡ mã giảm giá");
  };

  const discountAmount = (subTotal * discountPercent) / 100;
  const finalTotal = subTotal - discountAmount;


  const handleCreateOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Giỏ hàng đang trống!");
      return;
    }

    const orderPayload = {
      note: note || "Giao hàng giờ hành chính",
      totalPrice: finalTotal, // Gửi tổng tiền ĐÃ GIẢM
      codeDiscount: appliedCoupon, // Gửi kèm mã giảm giá (nếu có)
      productBuys: cartItems.map((item) => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      setLoading(true);
      const response = await axiosClient.post(
        "/user/create/order",
        orderPayload
      );
      const dataObj = response.data ? response.data : response;

      if (dataObj.statusCode === 200 || dataObj.data) {
        toast.success("Đặt hàng thành công!");
        // Chuyển sang OrdersPage
        navigate("/orders", { state: { newOrder: dataObj.data } });
        fetchCartGlobal();
      } else {
        toast.error(dataObj.message || "Tạo đơn thất bại!");
      }
    } catch (error) {
      console.error("Lỗi tạo đơn:", error);
      toast.error("Lỗi hệ thống khi tạo đơn!");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = (id, delta, maxStock) => {
    setCartItems((items) =>
      items.map((item) => {
        if (item.id === id) {
          const newQ = item.quantity + delta;
          if (newQ > maxStock) {
            toast.error(`Kho chỉ còn ${maxStock} sản phẩm!`);
            return item;
          }
          return { ...item, quantity: newQ > 0 ? newQ : 1 };
        }
        return item;
      })
    );
  };

  const removeItem = async (id) => {
    try {
      await axiosClient.delete(`/user/delete/cart/${id}`);
      setCartItems((items) => items.filter((item) => item.id !== id));
      fetchCartGlobal();
      toast.success("Đã xóa sản phẩm");
    } catch (error) {
      toast.error("Lỗi khi xóa sản phẩm");
    }
  };

  const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);

  if (loading)
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );


  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center max-w-md w-full">
          <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart size={40} className="text-blue-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Giỏ hàng trống
          </h2>
          <p className="text-gray-500 mb-8">
            Bạn chưa thêm sản phẩm nào vào giỏ hàng.
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30"
          >
            Tiếp tục mua sắm <ArrowRight size={18} />
          </button>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-6xl">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 flex items-center gap-3">
          <ShoppingCart className="text-blue-600" /> Giỏ hàng của bạn
          <span className="text-lg font-normal text-gray-500">
            ({cartItems.length} sản phẩm)
          </span>
        </h1>

        <div className="flex flex-col lg:flex-row gap-8">
         
          <div className="w-full lg:w-2/3 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col sm:flex-row gap-6 items-center"
              >
                <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gray-100 rounded-xl overflow-hidden shrink-0 border border-gray-200">
                  <img
                    src={`${IMAGE_BASE_URL}${item.image}`}
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e) =>
                      (e.target.src = "https://via.placeholder.com/150")
                    }
                  />
                </div>

                <div className="flex-1 w-full flex flex-col justify-between h-full min-h-[120px]">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className="text-xs text-blue-600 font-bold uppercase mb-1">
                        {item.category}
                      </p>
                      <h3 className="text-lg font-bold text-gray-800 leading-tight mb-1 line-clamp-2">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-400">
                        Kho còn: {item.maxStock}
                      </p>
                    </div>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <div className="flex justify-between items-end mt-4">
                    <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, -1, item.maxStock)
                        }
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 rounded-l-lg"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-semibold text-gray-800 select-none bg-white py-1.5 border-l border-r border-gray-200">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, 1, item.maxStock)
                        }
                        className="px-3 py-1.5 hover:bg-gray-200 text-gray-600 rounded-r-lg"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                    <p className="text-xl font-bold text-blue-600">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

         
          <div className="w-full lg:w-1/3">
            <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 sticky top-24">
              <h2 className="text-lg font-bold text-gray-800 mb-6 pb-4 border-b border-gray-100">
                Thông tin đơn hàng
              </h2>

        
              <div className="mb-6">
                <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <FileText size={16} /> Ghi chú
                </label>
                <textarea
                  className="w-full border border-gray-300 rounded-xl p-3 text-sm focus:outline-blue-500 bg-gray-50"
                  rows="2"
                  placeholder="Ví dụ: Giao hàng vào giờ hành chính..."
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                />
              </div>

           
              <div className="mb-6 pb-6 border-b border-dashed border-gray-200">
                <label className="text-sm font-semibold text-gray-600 mb-2 flex items-center gap-2">
                  <Ticket size={16} /> Mã giảm giá
                </label>

                {!appliedCoupon ? (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-blue-500 uppercase placeholder:normal-case"
                      placeholder="Nhập mã coupon"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg text-sm hover:bg-black font-medium"
                    >
                      Áp dụng
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center bg-green-50 border border-green-200 rounded-lg p-3">
                    <div>
                      <span className="block text-green-700 font-bold text-sm">
                        {appliedCoupon}
                      </span>
                      <span className="text-xs text-green-600">
                        Đã giảm {discountPercent}%
                      </span>
                    </div>
                    <button
                      onClick={handleRemoveCoupon}
                      className="text-green-600 hover:text-red-500"
                    >
                      <X size={18} />
                    </button>
                  </div>
                )}
              </div>

           
              <div className="space-y-3 mb-8">
                <div className="flex justify-between text-gray-500">
                  <span>Tạm tính</span>
                  <span>{formatCurrency(subTotal)}</span>
                </div>

                {discountPercent > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Giảm giá ({discountPercent}%)</span>
                    <span>- {formatCurrency(discountAmount)}</span>
                  </div>
                )}

                <div className="border-t border-gray-100 my-2 pt-4 flex justify-between items-center">
                  <span className="text-gray-800 font-bold text-lg">
                    Tổng cộng
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(finalTotal)}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCreateOrder}
                disabled={loading}
                className={`w-full py-4 rounded-xl font-bold text-white text-lg flex items-center justify-center gap-2 shadow-xl shadow-blue-500/30 transition-all ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transform hover:-translate-y-1"
                }`}
              >
                {loading ? (
                  "Đang xử lý..."
                ) : (
                  <>
                    Đặt hàng ngay <ArrowRight size={20} />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
