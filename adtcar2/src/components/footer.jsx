import React from "react";
import { Link } from "react-router-dom";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ShoppingBag,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-b from-gray-900 to-gray-800 text-gray-300 border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ShoppingBag className="text-indigo-400 w-6 h-6" />
              <h3 className="text-xl font-semibold text-white">ShopLite</h3>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">
              Nền tảng mua sắm trực tuyến đáng tin cậy – nơi bạn tìm thấy sản
              phẩm chất lượng, giá cả hợp lý và dịch vụ tận tâm.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Liên kết nhanh
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="hover:text-indigo-400 transition">
                  Trang chủ
                </Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-indigo-400 transition">
                  Sản phẩm
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-indigo-400 transition">
                  Giới thiệu
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-indigo-400 transition">
                  Liên hệ
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Hỗ trợ khách hàng
            </h3>
            <ul className="space-y-2">
              <li>
                <Link to="/help" className="hover:text-indigo-400 transition">
                  Trợ giúp
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="hover:text-indigo-400 transition">
                  Vận chuyển
                </Link>
              </li>
              <li>
                <Link to="/returns" className="hover:text-indigo-400 transition">
                  Đổi trả
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="hover:text-indigo-400 transition">
                  Chính sách bảo mật
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">
              Thông tin liên hệ
            </h3>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-indigo-400" /> support@shoplite.com
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-indigo-400" /> 1900-1234
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-indigo-400" /> 123 Đường ABC,
                Quận 1, TP.HCM
              </p>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mt-5">
              <a href="#" className="hover:text-indigo-400 transition">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="hover:text-indigo-400 transition">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom line */}
        <div className="border-t border-gray-700 mt-10 pt-6 text-center">
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()}{" "}
            <span className="text-indigo-400 font-medium">ShopLite</span>. Tất
            cả quyền được bảo lưu.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
