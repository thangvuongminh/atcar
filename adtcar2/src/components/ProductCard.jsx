import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { ShoppingCart, LogIn, CheckCircle, X, AlertCircle } from "lucide-react";

// --- IMPORT STORE & API ---
import { useAuthStore } from "../store/auth.store";
import { useCartStore } from "../store/cart.store";
import axiosClient from "../store/axiosClient";

// --- TOAST COMPONENT ---
const CustomToast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => onClose(), 3000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === "success";
    const bgClass = isSuccess ? "bg-white border-green-500" : "bg-white border-red-500";
    const textClass = isSuccess ? "text-green-700" : "text-red-700";
    const Icon = isSuccess ? CheckCircle : AlertCircle;

    return (
        <div className={`fixed top-24 right-5 z-[9999] flex items-center gap-3 px-4 py-3 rounded-lg shadow-2xl border-l-4 ${bgClass} min-w-[300px] animate-bounce-in`}>
            <Icon size={24} className={textClass} />
            <div className="flex-1">
                <h4 className={`font-bold text-sm ${textClass}`}>{isSuccess ? "Thành công!" : "Thông báo"}</h4>
                <p className="text-gray-600 text-xs mt-0.5">{message}</p>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onClose(); }} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
        </div>
    );
};

const ProductCard = ({ product }) => {
    const navigate = useNavigate();
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
    const addToCartUI = useCartStore((state) => state.addToCart);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const [isLoading, setIsLoading] = useState(false);

    // --- Helper functions ---
    const formatPrice = (price) => {
        if (price == null) return "Liên hệ";
        return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(price);
    };
    const calculateDiscount = (price, priceFake) => (!priceFake || priceFake <= price) ? 0 : Math.round(((priceFake - price) / priceFake) * 100);
    
    const getImageUrl = (imgName) => {
        if (!imgName) return "https://via.placeholder.com/300?text=No+Image";
        return imgName.startsWith("http") ? imgName : `http://localhost:8080/product/${imgName}`;
    };
    
    const discountPercent = calculateDiscount(product?.price, product?.priceFake);
    const name = product?.name || "Sản phẩm";
    
    // --- LẤY DỮ LIỆU TỪ HÌNH ÔNG GỬI ---
    // Thương hiệu (Input "Thương hiệu" trong Admin)
    const brandName = product?.brand; 
    // Nhà SX (Input "Nhà SX" trong Admin)
    const manufactureName = product?.manufacture; 

    const handleCardClick = () => {
        navigate(`/product/${product.id}`);
    };

    const handleAddToCart = async (e) => {
        e.stopPropagation(); 
        e.preventDefault();

        if (!isAuthenticated) {
            setToast({ show: true, message: "Vui lòng đăng nhập để mua hàng!", type: "error" });
            setTimeout(() => navigate("/login"), 1500);
            return;
        }

        if (isLoading) return;
        setIsLoading(true);

        try {
            await axiosClient.post(`/user/add/cart/${product.id}`); 
            addToCartUI(product, 1);
            setToast({ show: true, message: `Đã thêm "${name}" vào giỏ!`, type: "success" });
        } catch (error) {
            console.error("API Error:", error);
            const msg = error.response?.data?.message || "Lỗi kết nối server!";
            setToast({ show: true, message: msg, type: "error" });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            {toast.show && <CustomToast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}

            <div 
                className="group relative bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-300 flex flex-col h-full cursor-pointer"
            >
                {/* ẢNH SẢN PHẨM */}
                <div className="aspect-square relative bg-gray-50 overflow-hidden" onClick={handleCardClick}>
                    <img
                        src={getImageUrl(product.url || product.image)}
                        alt={name}
                        className="absolute inset-0 w-full h-full object-cover p-4 transition-transform duration-300 group-hover:scale-105"
                        loading="lazy"
                        onError={(e) => e.target.src = "https://via.placeholder.com/300?text=Error"}
                    />
                    
                    {discountPercent > 0 && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded shadow-md">-{discountPercent}%</div>
                    )}
                    
                    {/* Badge Thương hiệu góc phải (cho đẹp) */}
                    {brandName && (
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-xs font-bold text-gray-700 px-2 py-1 rounded shadow-sm border border-gray-100 uppercase">
                            {brandName}
                        </div>
                    )}

                    <div 
                        className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 translate-y-2 group-hover:translate-y-0 z-50"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={handleAddToCart}
                            disabled={isLoading}
                            className={`w-full py-2.5 rounded-lg font-bold text-sm shadow-lg flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                                isAuthenticated 
                                ? "bg-white text-indigo-700 hover:bg-indigo-600 hover:text-white" 
                                : "bg-yellow-400 text-indigo-900 hover:bg-yellow-300"
                            } ${isLoading ? "opacity-70 cursor-wait" : ""}`}
                        >
                            {isLoading ? (
                                <span className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                            ) : isAuthenticated ? (
                                <><ShoppingCart size={18} /> Thêm vào giỏ</>
                            ) : (
                                <><LogIn size={18} /> Đăng nhập</>
                            )}
                        </button>
                    </div>
                </div>

                {/* THÔNG TIN */}
                <div className="p-4 flex flex-col flex-1" onClick={handleCardClick}>
                    
                    {/* --- HIỂN THỊ THƯƠNG HIỆU & NHÀ SX --- */}
                    {/* Style: Chữ nhỏ màu xám, viết hoa, nằm trên tên SP */}
                    <div className="text-xs text-gray-500 mb-1 font-semibold tracking-wide truncate">
                        {brandName ? <span className="text-indigo-600 uppercase">{brandName}</span> : <span>N/A</span>}
                        
                        <span className="mx-1 text-gray-300">|</span>
                        
                        {manufactureName ? <span className="text-gray-600 uppercase">{manufactureName}</span> : <span>N/A</span>}
                    </div>
                    {/* -------------------------------------- */}

                    <h3 className="text-sm font-medium text-gray-800 line-clamp-2 leading-snug hover:text-indigo-600 transition-colors mb-2 min-h-[40px]" title={name}>
                        {name}
                    </h3>
                    <div className="flex items-center gap-2 mb-3 text-xs text-gray-500">
                        <div className="flex text-yellow-400">★★★★★</div>
                        <span>|</span>
                        <span>Đã bán {product?.sold ?? 0}</span>
                    </div>
                    <div className="mt-auto">
                        <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-red-600 font-bold text-lg">{formatPrice(product.price)}</span>
                            {discountPercent > 0 && <span className="text-gray-400 text-xs line-through">{formatPrice(product.priceFake)}</span>}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductCard;