import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useHomeStore } from "../store/home.store";
import ProductCard from "../components/ProductCard";
import {
    CheckCircle,
    ArrowRight,
    Star,
    Truck,
    ShieldCheck,
    Headphones,
    Wrench,
    Mail,
    Calendar,
    ChevronRight,
    Zap,
    Tag,
    Play,
    HelpCircle,
    Instagram,
    MapPin,
} from "lucide-react";

const HomePage = () => {
    const featuredProducts = useHomeStore((s) => s.featuredProducts);
    const loading = useHomeStore((s) => s.loading);
    const fetchData = useHomeStore((s) => s.fetchData);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            {/* ================= SECTION 1: HERO BANNER (SLIDER) ================= */}
            <section className="relative h-[650px] overflow-hidden">
                <div className="absolute inset-0">
                    <img
                        src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop"
                        alt="Hero Banner"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent"></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
                    <div className="max-w-2xl animate-fade-in-up">
                        <div className="flex items-center gap-2 mb-6">
                            <span className="bg-red-600 text-white px-3 py-1 text-xs font-bold uppercase tracking-wider rounded">
                                Hot Deal
                            </span>
                            <span className="text-gray-300 text-sm font-medium tracking-wide">
                                CHÀO HÈ 2025
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black text-white leading-tight mb-6">
                            ĐỘ XE CHUẨN <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-600">
                                PHONG CÁCH MỚI
                            </span>
                        </h1>
                        <p className="text-lg text-gray-300 mb-8 max-w-lg leading-relaxed">
                            Biến chiếc xe của bạn thành tác phẩm nghệ thuật.
                            ADTCar cung cấp phụ kiện độc quyền, công nghệ hiện
                            đại nhất thị trường.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link
                                to="/products"
                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2"
                            >
                                Mua Sắm Ngay <ArrowRight size={20} />
                            </Link>
                            <Link
                                to="/schedule"
                                className="bg-white/10 hover:bg-white/20 backdrop-blur border border-white/30 text-white px-8 py-4 rounded-full font-bold text-lg transition-all"
                            >
                                Đặt Lịch Tư Vấn
                            </Link>
                        </div>

                        <div className="mt-12 flex gap-8 border-t border-white/10 pt-8">
                            <div>
                                <p className="text-3xl font-bold text-white">
                                    5k+
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Sản phẩm
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">
                                    10k+
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Khách hàng
                                </p>
                            </div>
                            <div>
                                <p className="text-3xl font-bold text-white">
                                    4.9
                                </p>
                                <p className="text-gray-400 text-sm">
                                    Đánh giá
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 2: USP (LỢI ÍCH) ================= */}
            <section className="bg-indigo-900 py-10 text-white -mt-2 relative z-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8 divide-y md:divide-y-0 md:divide-x divide-indigo-700/50">
                        {[
                            {
                                icon: Truck,
                                title: "Miễn Phí Vận Chuyển",
                                sub: "Cho đơn hàng từ 2 triệu",
                            },
                            {
                                icon: ShieldCheck,
                                title: "Bảo Hành 1 Đổi 1",
                                sub: "Lỗi nhà sản xuất trong 30 ngày",
                            },
                            {
                                icon: Wrench,
                                title: "Lắp Đặt Tận Nhà",
                                sub: "Khu vực nội thành Hà Nội & HCM",
                            },
                            {
                                icon: Headphones,
                                title: "Hỗ Trợ 24/7",
                                sub: "Hotline: 1900 1234",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="flex items-center gap-4 px-4 py-2"
                            >
                                <div className="p-3 bg-white/10 rounded-full text-yellow-400">
                                    <item.icon size={28} />
                                </div>
                                <div>
                                    <h4 className="font-bold text-lg">
                                        {item.title}
                                    </h4>
                                    <p className="text-indigo-200 text-sm">
                                        {item.sub}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= SECTION 3: FLASH SALE (MỚI) ================= */}
            <section className="py-16 bg-red-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-8 gap-4">
                        <div className="flex items-center gap-4">
                            <div className="bg-red-600 text-white p-2 rounded-lg">
                                <Zap size={32} fill="currentColor" />
                            </div>
                            <div>
                                <h2 className="text-3xl font-extrabold text-gray-900 uppercase italic tracking-tighter">
                                    FLASH SALE
                                </h2>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-gray-600 text-sm font-medium">
                                        Kết thúc trong:
                                    </span>
                                    <div className="flex gap-1 text-white text-xs font-bold">
                                        <span className="bg-gray-800 px-2 py-1 rounded">
                                            02
                                        </span>{" "}
                                        :
                                        <span className="bg-gray-800 px-2 py-1 rounded">
                                            14
                                        </span>{" "}
                                        :
                                        <span className="bg-gray-800 px-2 py-1 rounded">
                                            35
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Link
                            to="/products"
                            className="text-red-600 font-bold hover:underline flex items-center"
                        >
                            Xem tất cả deal <ChevronRight size={16} />
                        </Link>
                    </div>

                    {/* Hardcode Flash Sale Items */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {[
                            {
                                name: "Camera Hành Trình 70mai",
                                price: "1.290.000",
                                old: "1.900.000",
                                img: "https://images.unsplash.com/photo-1625232733908-1647eb48b209?q=80&w=500&auto=format&fit=crop",
                            },
                            {
                                name: "Bơm Lốp Xiaomi",
                                price: "650.000",
                                old: "890.000",
                                img: "https://images.unsplash.com/photo-1599587426615-327776999b82?q=80&w=500&auto=format&fit=crop",
                            },
                            {
                                name: "Nước Hoa Ô Tô Cao Cấp",
                                price: "299.000",
                                old: "500.000",
                                img: "https://images.unsplash.com/photo-1595183344669-7c4270034a75?q=80&w=500&auto=format&fit=crop",
                            },
                            {
                                name: "Gối Tựa Đầu Maybach",
                                price: "150.000",
                                old: "300.000",
                                img: "https://images.unsplash.com/photo-1616423664032-472d627ec759?q=80&w=500&auto=format&fit=crop",
                            },
                            {
                                name: "Bạt Phủ Xe Tráng Bạc",
                                price: "320.000",
                                old: "450.000",
                                img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=500&auto=format&fit=crop",
                            },
                        ].map((item, idx) => (
                            <div
                                key={idx}
                                className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden group hover:shadow-lg transition-all"
                            >
                                <div className="relative">
                                    <img
                                        src={item.img}
                                        alt={item.name}
                                        className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500"
                                    />
                                    <span className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded">
                                        -30%
                                    </span>
                                </div>
                                <div className="p-3">
                                    <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-2 h-10">
                                        {item.name}
                                    </h3>
                                    <div className="flex flex-col">
                                        <span className="text-red-600 font-bold text-lg">
                                            {item.price}đ
                                        </span>
                                        <span className="text-gray-400 text-xs line-through">
                                            {item.old}đ
                                        </span>
                                    </div>
                                    <div className="mt-3 w-full bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                                        <div
                                            className="bg-red-600 h-1.5 rounded-full"
                                            style={{ width: "70%" }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-red-600 mt-1">
                                        Đã bán 89
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= SECTION 4: DANH MỤC NỔI BẬT ================= */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
                        Danh Mục Yêu Thích
                    </h2>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                        {[
                            {
                                name: "Nội Thất",
                                icon: "💺",
                                color: "bg-orange-100 text-orange-600",
                            },
                            {
                                name: "Ngoại Thất",
                                icon: "🚗",
                                color: "bg-blue-100 text-blue-600",
                            },
                            {
                                name: "Điện Tử",
                                icon: "⚡",
                                color: "bg-yellow-100 text-yellow-600",
                            },
                            {
                                name: "Âm Thanh",
                                icon: "🔊",
                                color: "bg-purple-100 text-purple-600",
                            },
                            {
                                name: "Chăm Sóc",
                                icon: "🧼",
                                color: "bg-green-100 text-green-600",
                            },
                            {
                                name: "Đèn Led",
                                icon: "💡",
                                color: "bg-red-100 text-red-600",
                            },
                        ].map((cat, idx) => (
                            <Link
                                key={idx}
                                to="/products"
                                className="flex flex-col items-center group cursor-pointer"
                            >
                                <div
                                    className={`w-24 h-24 ${cat.color} rounded-full flex items-center justify-center text-4xl mb-4 transition-transform group-hover:scale-110 shadow-sm`}
                                >
                                    {cat.icon}
                                </div>
                                <span className="font-bold text-gray-700 group-hover:text-indigo-600">
                                    {cat.name}
                                </span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= SECTION 5: BỘ SƯU TẬP (GRID ẢNH) ================= */}
            <section className="py-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-auto md:h-[500px]">
                        <div className="md:col-span-2 relative rounded-3xl overflow-hidden group cursor-pointer">
                            <img
                                src="https://images.unsplash.com/photo-1600712242805-5f7867145e22?q=80&w=1000&auto=format&fit=crop"
                                alt="Collection 1"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all"></div>
                            <div className="absolute bottom-8 left-8 text-white">
                                <h3 className="text-3xl font-bold mb-2">
                                    Bộ Sưu Tập Bodykit
                                </h3>
                                <p className="mb-4 text-gray-200">
                                    Biến hóa phong cách thể thao mạnh mẽ
                                </p>
                                <button className="bg-white text-black px-6 py-2 rounded-full font-bold hover:bg-gray-100">
                                    Khám phá
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-6 h-full">
                            <div className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000&auto=format&fit=crop"
                                    alt="Collection 2"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-xl font-bold">
                                        Nội Thất Sang Trọng
                                    </h3>
                                </div>
                            </div>
                            <div className="flex-1 relative rounded-3xl overflow-hidden group cursor-pointer">
                                <img
                                    src="https://images.unsplash.com/photo-1485291571150-772bcfc10da5?q=80&w=1000&auto=format&fit=crop"
                                    alt="Collection 3"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute bottom-6 left-6 text-white">
                                    <h3 className="text-xl font-bold">
                                        Ánh Sáng Đỉnh Cao
                                    </h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 6: SẢN PHẨM BÁN CHẠY (API STORE) ================= */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Sản Phẩm Đề Xuất
                            </h2>
                            <div className="h-1 w-20 bg-indigo-600 mt-2 rounded-full"></div>
                        </div>
                        <Link
                            to="/products"
                            className="text-indigo-600 font-bold hover:text-indigo-800 flex items-center gap-1 transition-colors"
                        >
                            Xem tất cả sản phẩm <ArrowRight size={18} />
                        </Link>
                    </div>

                    {featuredProducts && featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    product={product}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">
                                Đang tải dữ liệu sản phẩm...
                            </p>
                        </div>
                    )}
                </div>
            </section>

            {/* ================= SECTION 7: PROMO BANNER NGANG ================= */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative rounded-3xl overflow-hidden bg-gray-900 h-[400px] flex items-center">
                        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1503376763036-066120622c74?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-fixed opacity-40"></div>
                        <div className="relative z-10 w-full text-center px-4">
                            <span className="text-yellow-400 font-bold tracking-widest uppercase mb-2 block animate-pulse">
                                Cơ hội duy nhất trong năm
                            </span>
                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
                                NÂNG CẤP MÀN HÌNH ANDROID
                            </h2>
                            <p className="text-xl text-gray-200 mb-8">
                                Tặng kèm Camera 360 độ + Bản quyền Vietmap Live
                            </p>
                            <button className="bg-white text-gray-900 px-10 py-4 rounded-full font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl">
                                Nhận Báo Giá Ngay
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 8: VIDEO & SHOWROOM ================= */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                            <img
                                src="https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=2070&auto=format&fit=crop"
                                alt="Video Thumbnail"
                                className="w-full h-[400px] object-cover"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/30 transition-all">
                                <button className="w-20 h-20 bg-white rounded-full flex items-center justify-center pl-2 text-indigo-600 shadow-lg hover:scale-110 transition-transform animate-pulse">
                                    <Play size={40} fill="currentColor" />
                                </button>
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900 mb-6">
                                Trải Nghiệm Showroom ADTCar
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Chúng tôi sở hữu hệ thống nhà xưởng rộng hơn
                                500m2, trang thiết bị hiện đại chuẩn hãng. Khách
                                hàng có thể trực tiếp quan sát quy trình thi
                                công, nghỉ ngơi tại phòng chờ VIP với trà và
                                cafe miễn phí.
                            </p>
                            <ul className="space-y-4 mb-8">
                                {[
                                    "Phòng chờ máy lạnh, Wifi tốc độ cao",
                                    "Khu vực rửa xe và chăm sóc xe riêng biệt",
                                    "Máy móc nhập khẩu từ Đức và Nhật Bản",
                                    "Có khu vui chơi cho trẻ em",
                                ].map((item, idx) => (
                                    <li
                                        key={idx}
                                        className="flex items-center gap-3"
                                    >
                                        <CheckCircle
                                            className="text-green-500"
                                            size={20}
                                        />
                                        <span className="text-gray-700 font-medium">
                                            {item}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                            <button className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-1 hover:text-indigo-800 hover:border-indigo-800 transition-colors">
                                Xem hình ảnh thực tế
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 9: VỀ CHÚNG TÔI (ABOUT US) ================= */}
            <section className="py-20 bg-gray-50 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="text-indigo-600 font-bold tracking-wider uppercase text-sm">
                            Câu chuyện thương hiệu
                        </span>
                        <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mt-2">
                            Tại Sao Chọn ADTCar?
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-indigo-500">
                            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-6 text-indigo-600">
                                <Star size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Top 1 Uy Tín
                            </h3>
                            <p className="text-gray-600">
                                Được bình chọn là hệ thống chăm sóc xe uy tín
                                nhất năm 2024 bởi diễn đàn OtoFun.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-yellow-500">
                            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-600">
                                <Tag size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Giá Cả Minh Bạch
                            </h3>
                            <p className="text-gray-600">
                                Niêm yết giá rõ ràng trên website. Không phát
                                sinh chi phí phụ, không chèo kéo khách.
                            </p>
                        </div>
                        <div className="bg-white p-8 rounded-2xl shadow-lg border-b-4 border-green-500">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600">
                                <ShieldCheck size={32} />
                            </div>
                            <h3 className="text-xl font-bold mb-3">
                                Bảo Hành Điện Tử
                            </h3>
                            <p className="text-gray-600">
                                Hệ thống bảo hành online tiện lợi. Tra cứu lịch
                                sử sửa chữa, bảo dưỡng mọi lúc mọi nơi.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 10: TESTIMONIALS (KHÁCH HÀNG) ================= */}
            <section className="py-20 bg-indigo-900 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                    <svg
                        width="100%"
                        height="100%"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <pattern
                                id="grid"
                                width="40"
                                height="40"
                                patternUnits="userSpaceOnUse"
                            >
                                <path
                                    d="M 40 0 L 0 0 0 40"
                                    fill="none"
                                    stroke="white"
                                    strokeWidth="1"
                                />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-12">
                        Khách Hàng Nói Gì Về Chúng Tôi?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                name: "Anh Hùng",
                                car: "Mazda CX5",
                                text: "Thợ làm rất kỹ, đi dây gọn gàng. Mình lắp màn hình Android mà cảm giác như zin theo xe. 10 điểm!",
                                avatar: "https://i.pravatar.cc/150?img=11",
                            },
                            {
                                name: "Chị Lan",
                                car: "Mercedes C300",
                                text: "Dịch vụ chăm sóc xe tuyệt vời. Rửa xe siêu sạch, nhân viên tư vấn nhiệt tình không vẽ vời. Sẽ ủng hộ dài dài.",
                                avatar: "https://i.pravatar.cc/150?img=5",
                            },
                            {
                                name: "Anh Tuấn",
                                car: "Ford Ranger",
                                text: "Đồ chơi xe bán tải ở đây rất đa dạng. Giá cả hợp lý so với mặt bằng chung. Chế độ bảo hành nhanh gọn.",
                                avatar: "https://i.pravatar.cc/150?img=3",
                            },
                        ].map((review, idx) => (
                            <div
                                key={idx}
                                className="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10"
                            >
                                <div className="flex gap-1 text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            fill="currentColor"
                                        />
                                    ))}
                                </div>
                                <p className="text-gray-300 italic mb-6">
                                    "{review.text}"
                                </p>
                                <div className="flex items-center gap-4">
                                    <img
                                        src={review.avatar}
                                        alt={review.name}
                                        className="w-12 h-12 rounded-full border-2 border-indigo-500"
                                    />
                                    <div>
                                        <h4 className="font-bold">
                                            {review.name}
                                        </h4>
                                        <p className="text-xs text-gray-400">
                                            Chủ xe {review.car}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= SECTION 11: GALLERY ẢNH THỰC TẾ ================= */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-10">
                        <h2 className="text-3xl font-bold text-gray-900 flex items-center justify-center gap-2">
                            <Instagram className="text-pink-600" /> Hình Ảnh
                            Thực Tế
                        </h2>
                        <p className="text-gray-500 mt-2">
                            Theo dõi chúng tôi trên mạng xã hội để cập nhật các
                            mẫu độ mới nhất
                        </p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        <img
                            src="https://images.unsplash.com/photo-1605218427360-6961d3748c53?q=80&w=500&h=500&auto=format&fit=crop"
                            className="w-full h-full object-cover rounded-lg hover:opacity-80 transition cursor-pointer"
                            alt="Gallery 1"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=500&h=500&auto=format&fit=crop"
                            className="w-full h-full object-cover rounded-lg hover:opacity-80 transition cursor-pointer"
                            alt="Gallery 2"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=500&h=500&auto=format&fit=crop"
                            className="w-full h-full object-cover rounded-lg hover:opacity-80 transition cursor-pointer"
                            alt="Gallery 3"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1549399542-7e3f8b79c341?q=80&w=500&h=500&auto=format&fit=crop"
                            className="w-full h-full object-cover rounded-lg hover:opacity-80 transition cursor-pointer"
                            alt="Gallery 4"
                        />
                    </div>
                </div>
            </section>

            {/* ================= SECTION 12: TIN TỨC & FAQ ================= */}
            <section className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                        {/* Tin tức */}
                        <div className="lg:col-span-2">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Tin Tức & Sự Kiện
                            </h2>
                            <div className="space-y-6">
                                {[
                                    {
                                        title: "Top 5 phụ kiện không thể thiếu cho xe mới mua",
                                        date: "12/12/2025",
                                        img: "https://images.unsplash.com/photo-1502877338535-766e1452684a?q=80&w=200&auto=format&fit=crop",
                                    },
                                    {
                                        title: "Hướng dẫn đăng kiểm xe ô tô mới nhất 2025",
                                        date: "10/12/2025",
                                        img: "https://images.unsplash.com/photo-1532581140115-3e355d1ed1de?q=80&w=200&auto=format&fit=crop",
                                    },
                                    {
                                        title: "So sánh các dòng phim cách nhiệt 3M và VKool",
                                        date: "08/12/2025",
                                        img: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=200&auto=format&fit=crop",
                                    },
                                ].map((news, i) => (
                                    <div
                                        key={i}
                                        className="flex gap-4 group cursor-pointer bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition"
                                    >
                                        <img
                                            src={news.img}
                                            alt="News"
                                            className="w-32 h-20 object-cover rounded-lg"
                                        />
                                        <div>
                                            <h3 className="font-bold text-gray-800 group-hover:text-indigo-600 transition-colors line-clamp-2">
                                                {news.title}
                                            </h3>
                                            <div className="flex items-center gap-2 text-gray-500 text-xs mt-2">
                                                <Calendar size={12} />{" "}
                                                {news.date}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* FAQ */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <HelpCircle /> Câu Hỏi Thường Gặp
                            </h2>
                            <div className="space-y-4">
                                <details className="group bg-white p-4 rounded-xl shadow-sm cursor-pointer">
                                    <summary className="font-bold text-gray-800 list-none flex justify-between items-center">
                                        Thời gian bảo hành bao lâu?
                                        <span className="transition group-open:rotate-180">
                                            ⌄
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 text-sm mt-3">
                                        Tùy từng sản phẩm, thời gian bảo hành từ
                                        12 tháng đến 10 năm. Chúng tôi cam kết
                                        bảo hành chính hãng 1 đổi 1.
                                    </p>
                                </details>
                                <details className="group bg-white p-4 rounded-xl shadow-sm cursor-pointer">
                                    <summary className="font-bold text-gray-800 list-none flex justify-between items-center">
                                        Có hỗ trợ trả góp không?
                                        <span className="transition group-open:rotate-180">
                                            ⌄
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 text-sm mt-3">
                                        Có, chúng tôi hỗ trợ trả góp 0% qua thẻ
                                        tín dụng cho đơn hàng từ 3 triệu đồng.
                                    </p>
                                </details>
                                <details className="group bg-white p-4 rounded-xl shadow-sm cursor-pointer">
                                    <summary className="font-bold text-gray-800 list-none flex justify-between items-center">
                                        Đặt lịch trước có giảm giá không?
                                        <span className="transition group-open:rotate-180">
                                            ⌄
                                        </span>
                                    </summary>
                                    <p className="text-gray-600 text-sm mt-3">
                                        Khách hàng đặt lịch hẹn online sẽ được
                                        giảm ngay 5% tổng hóa đơn dịch vụ.
                                    </p>
                                </details>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ================= SECTION 13: ĐỐI TÁC (BRANDS) ================= */}
            <section className="py-12 border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <p className="text-center text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">
                        Đối tác chiến lược
                    </p>
                    <div className="flex flex-wrap justify-center gap-10 md:gap-20 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
                        {[
                            "MICHELIN",
                            "BOSCH",
                            "3M",
                            "BREMBO",
                            "MOTUL",
                            "PIONEER",
                            "VIETMAP",
                            "ZESTECH",
                        ].map((brand) => (
                            <span
                                key={brand}
                                className="text-2xl md:text-4xl font-black text-gray-800 cursor-default select-none"
                            >
                                {brand}
                            </span>
                        ))}
                    </div>
                </div>
            </section>

            {/* ================= SECTION 14: NEWSLETTER (FOOTER LEAD) ================= */}
            <section className="bg-indigo-900 py-16 text-white text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
                <div className="max-w-2xl mx-auto px-4 relative z-10">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur">
                        <Mail size={32} />
                    </div>
                    <h2 className="text-3xl font-bold mb-4">
                        Đăng Ký Nhận Tin Khuyến Mãi
                    </h2>
                    <p className="text-indigo-200 mb-8">
                        Nhận ngay mã giảm giá 10% cho đơn hàng đầu tiên và cập
                        nhật xu hướng xe mới nhất.
                    </p>
                    <form className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="email"
                            placeholder="Nhập địa chỉ email của bạn..."
                            className="flex-1 px-6 py-4 rounded-full text-gray-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/50 transition-shadow"
                        />
                        <button
                            type="button"
                            className="bg-yellow-500 text-indigo-900 font-bold px-10 py-4 rounded-full hover:bg-yellow-400 transition-colors shadow-lg"
                        >
                            Đăng Ký
                        </button>
                    </form>
                    <p className="text-xs text-indigo-400 mt-4 flex items-center justify-center gap-1">
                        <ShieldCheck size={12} /> Thông tin của bạn được bảo mật
                        tuyệt đối.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default HomePage;
