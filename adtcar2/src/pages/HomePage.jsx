import React from "react";
import { Link } from "react-router-dom";
import {
  Home,
  Package,
  FileText,
  Calendar,
  ShoppingCart,
  User,
  MessageSquare,
  ArrowRight,
  ShieldCheck,
  Wrench,
  Zap,
  Award,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  Facebook,
  Instagram,
  Youtube,
  Gift,
  Clock,
} from "lucide-react";

const HomePage = () => {
  return (
    <div className="min-h-screen bg-[#020203] text-white font-sans selection:bg-indigo-500">
      {/* ================= HERO SECTION ================= */}
      <section className="relative h-[85vh] w-full flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1614162692292-7ac56d7f7f1e?q=80&w=2070&auto=format&fit=crop"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020203] via-[#020203]/80 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-[#020203] via-transparent to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 w-full">
          <div className="max-w-4xl animate-fade-in-up">
            <div className="flex items-center gap-3 mb-6">
              <span className="bg-red-600 text-white px-3 py-1 text-[11px] font-black uppercase rounded tracking-wider shadow-lg shadow-red-900/50">
                HOT DEAL
              </span>
              <span className="text-indigo-400 text-sm font-bold tracking-[0.2em] uppercase">
                CHÀO HÈ 2025
              </span>
            </div>

            <h1 className="text-6xl md:text-[90px] font-black leading-[0.9] mb-8 tracking-tighter text-white">
              ĐỘ XE CHUẨN <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f7a221] to-[#ffcc00]">
                PHONG CÁCH MỚI
              </span>
            </h1>

            <p className="text-xl text-gray-400 max-w-xl mb-12 leading-relaxed font-medium border-l-4 border-indigo-600 pl-6">
              Biến chiếc xe của bạn thành tác phẩm nghệ thuật độc bản.
              <br />
              Công nghệ hiện đại - Kỹ thuật viên Master - Bảo hành trọn đời.
            </p>

            <div className="flex flex-wrap items-center gap-5">
              <Link
                to="/products"
                className="bg-[#5244f0] hover:bg-[#4335d6] text-white px-10 py-5 rounded-2xl font-bold text-lg flex items-center gap-3 transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 transform hover:-translate-y-1"
              >
                Mua Sắm Ngay <ArrowRight size={20} />
              </Link>
              <Link
                to="/schedule"
                className="bg-[#1c1e29] hover:bg-[#252836] text-white px-10 py-5 rounded-2xl font-bold text-lg border border-white/10 transition-all hover:border-white/30"
              >
                Đặt Lịch Tư Vấn
              </Link>
            </div>
          </div>
        </div>

        {/* Floating Chat */}
        <div className="fixed bottom-10 right-10 z-50">
          <div className="w-16 h-16 bg-[#5244f0] rounded-full flex items-center justify-center shadow-2xl shadow-indigo-500/40 cursor-pointer hover:scale-110 transition-transform border-4 border-[#020203]">
            <MessageSquare size={28} fill="white" className="text-white" />
          </div>
        </div>
      </section>

      {/* ================= SECTION 2: GIÁ TRỊ CỐT LÕI ================= */}
      <section className="py-24 bg-[#0a0b10] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/5 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-full bg-orange-500/5 blur-[100px] rounded-full pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-6 md:px-10 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-indigo-500 font-bold tracking-widest uppercase text-sm">
              Về Chúng Tôi
            </span>
            <h2 className="text-4xl md:text-5xl font-black mt-3 mb-6 tracking-tight text-white">
              Tại Sao 10.000+ Chủ Xe <br />
              Tin Chọn <span className="text-[#5244f0]">ADTCar?</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Không chỉ là độ xe, chúng tôi mang đến giải pháp nâng tầm đẳng cấp
              và sự an toàn tuyệt đối cho xế yêu của bạn.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-[#14161f] p-8 rounded-[32px] border border-white/5 hover:border-indigo-500/50 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-indigo-500 group-hover:text-white transition-colors text-indigo-400">
                <ShieldCheck size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Bảo Hành Điện Tử
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Hệ thống bảo hành online toàn quốc. Tra cứu lịch sử sửa chữa,
                bảo dưỡng minh bạch chỉ với 1 cú click.
              </p>
            </div>
            <div className="bg-[#14161f] p-8 rounded-[32px] border border-white/5 hover:border-orange-500/50 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-orange-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-orange-500 group-hover:text-white transition-colors text-orange-400">
                <Wrench size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Kỹ Thuật Chuẩn Hãng
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Đội ngũ kỹ thuật viên 10+ năm kinh nghiệm. Quy trình thi công
                chuẩn hãng, không cắt đấu dây zin của xe.
              </p>
            </div>
            <div className="bg-[#14161f] p-8 rounded-[32px] border border-white/5 hover:border-blue-500/50 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-colors text-blue-400">
                <Zap size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Công Nghệ Tiên Phong
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Luôn cập nhật các xu hướng độ xe mới nhất thế giới. Sở hữu các
                thiết bị chẩn đoán và coding hiện đại nhất.
              </p>
            </div>
            <div className="bg-[#14161f] p-8 rounded-[32px] border border-white/5 hover:border-green-500/50 transition-all duration-300 group hover:-translate-y-2">
              <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-green-500 group-hover:text-white transition-colors text-green-400">
                <Award size={32} strokeWidth={1.5} />
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">
                Cam Kết Chất Lượng
              </h3>
              <p className="text-gray-400 leading-relaxed text-sm">
                Cam kết hoàn tiền 100% nếu sản phẩm không chính hãng hoặc không
                đúng như tư vấn ban đầu.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 3: THƯ VIỆN KIỆT TÁC (GALLERY) ================= */}
      <section className="py-24 bg-[#020203]">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex justify-between items-end mb-12">
            <div>
              <span className="text-indigo-500 font-bold tracking-widest uppercase text-sm">
                Gallery
              </span>
              <h2 className="text-4xl md:text-5xl font-black mt-2 text-white">
                Kiệt Tác Đã Hoàn Thiện
              </h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-white border-b border-white hover:text-indigo-400 hover:border-indigo-400 transition-colors pb-1">
              Xem tất cả dự án <ArrowRight size={18} />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 h-auto md:h-[600px]">
            <div className="lg:col-span-2 lg:row-span-2 relative rounded-[32px] overflow-hidden group cursor-pointer">
              <img
                src="https://images.unsplash.com/photo-1600712242805-5f7867145e22?q=80&w=1000"
                alt="Project 1"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-100"></div>
              <div className="absolute bottom-8 left-8">
                <span className="bg-indigo-600 text-white px-3 py-1 text-xs font-bold rounded uppercase mb-2 inline-block">
                  Mercedes G63
                </span>
                <h3 className="text-3xl font-bold text-white">
                  Gói Độ Bodykit Brabus & Nội Thất Hermes
                </h3>
              </div>
            </div>
            <div className="relative rounded-[32px] overflow-hidden group cursor-pointer h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=1000"
                alt="Project 2"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white">
                  VinFast Lux A - Wrap Đổi Màu
                </h3>
              </div>
            </div>
            <div className="relative rounded-[32px] overflow-hidden group cursor-pointer h-64 md:h-auto">
              <img
                src="https://images.unsplash.com/photo-1552519507-da3b142c6e3d?q=80&w=1000"
                alt="Project 3"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
              <div className="absolute bottom-6 left-6">
                <h3 className="text-xl font-bold text-white">
                  Porsche Panamera - Độ Đèn Laser
                </h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= SECTION 4: QUY TRÌNH LÀM VIỆC ================= */}
      <section className="py-20 bg-[#0f111a] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <h2 className="text-3xl font-bold text-center mb-16">
            Quy Trình Chuẩn 4 Bước
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-0 w-full h-0.5 bg-gray-800 -z-0"></div>
            {[
              {
                step: "01",
                title: "Tư Vấn Chuyên Sâu",
                desc: "Lắng nghe nhu cầu, tư vấn giải pháp tối ưu chi phí.",
                icon: MessageSquare,
              },
              {
                step: "02",
                title: "Đặt Lịch Hẹn",
                desc: "Xác nhận thời gian qua App/Web để không phải chờ đợi.",
                icon: Calendar,
              },
              {
                step: "03",
                title: "Thi Công Tỉ Mỉ",
                desc: "Thực hiện bởi Master kỹ thuật, giám sát qua Camera.",
                icon: Wrench,
              },
              {
                step: "04",
                title: "Bàn Giao & Hậu Mãi",
                desc: "Kiểm tra kỹ lưỡng, hướng dẫn sử dụng & kích hoạt bảo hành.",
                icon: CheckCircle,
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative z-10 bg-[#0f111a] text-center group"
              >
                <div className="w-24 h-24 mx-auto bg-[#1c1e29] rounded-full border-4 border-[#0f111a] flex items-center justify-center mb-6 group-hover:border-indigo-600 transition-colors shadow-xl">
                  <item.icon
                    size={32}
                    className="text-gray-400 group-hover:text-indigo-500 transition-colors"
                  />
                </div>
                <h3 className="text-xl font-bold mb-2 flex items-center justify-center gap-2">
                  <span className="text-indigo-600 opacity-50 text-sm">
                    0{idx + 1}.
                  </span>{" "}
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm px-4">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ================= [MỚI THÊM] SECTION 5: FLASH OFFER / CTA ================= */}
      <section className="relative py-24 overflow-hidden">
        {/* Background Image Overlay */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1493238792015-fa094a36b9af?q=80&w=2070&auto=format&fit=crop"
            className="w-full h-full object-cover"
            alt="CTA Bg"
          />
          <div className="absolute inset-0 bg-indigo-950/90 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center text-white">
          <div className="inline-flex items-center gap-2 bg-yellow-500/20 text-yellow-400 px-4 py-1.5 rounded-full font-bold uppercase text-xs tracking-widest mb-6 border border-yellow-500/30">
            <Gift size={14} /> Ưu đãi giới hạn
          </div>
          <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter leading-tight">
            Đừng Để Xế Yêu Của Bạn <br /> "Chìm Nghỉm" Giữa Đám Đông
          </h2>
          <p className="text-lg md:text-xl text-indigo-100 mb-10 max-w-2xl mx-auto font-medium">
            Tặng gói{" "}
            <span className="text-yellow-400 font-bold">
              Vệ sinh khoang máy trị giá 1.500.000đ
            </span>{" "}
            cho 20 khách hàng đặt lịch độ xe đầu tiên trong tháng này.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/schedule"
              className="w-full sm:w-auto bg-yellow-500 hover:bg-yellow-400 text-black px-12 py-4 rounded-full font-bold text-lg transition-all shadow-xl shadow-yellow-500/20 hover:scale-105 flex items-center justify-center gap-2"
            >
              <Calendar size={20} /> Đặt Lịch Ngay
            </Link>
            <div className="flex items-center gap-2 text-sm text-gray-300 bg-black/30 px-6 py-4 rounded-full backdrop-blur-sm">
              <Clock size={16} /> Kết thúc sau:{" "}
              <span className="font-mono text-white font-bold">
                02 ngày 14:35:00
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
