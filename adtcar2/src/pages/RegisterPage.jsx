import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// --- ICONS ---
const UserIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);
const PhoneIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
    />
  </svg>
);
const MailIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
);
const LockIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5 text-indigo-500"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
    />
  </svg>
);

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [errors, setErrors] = useState({});

  // State mới để hiển thị lỗi từ server (thay cho alert)
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    // Xóa lỗi server khi người dùng nhập lại để thử lại
    if (serverError) setServerError("");
  };

  const handleCheckboxChange = (e) => {
    setAgreeTerms(e.target.checked);
    if (e.target.checked && errors.agreeTerms) {
      setErrors({ ...errors, agreeTerms: "" });
    }
  };

  const validateForm = () => {
    let newErrors = {};
    const phoneRegex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

    if (!formData.name.trim()) newErrors.name = "Họ tên là bắt buộc";

    if (!formData.phone.trim()) {
      newErrors.phone = "Nhập số điện thoại";
    } else if (!phoneRegex.test(formData.phone)) {
      newErrors.phone = "SĐT không hợp lệ (10 số)";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Email không đúng định dạng";
    }

    if (!formData.password) {
      newErrors.password = "Nhập mật khẩu";
    } else if (formData.password.length < 6 || formData.password.length > 12) {
      newErrors.password = "Mật khẩu từ 6 - 12 ký tự";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu không khớp";
    }

    if (!agreeTerms) {
      newErrors.agreeTerms = "Bạn chưa đồng ý điều khoản";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError(""); // Reset lỗi cũ
    setSuccess("");

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        password: formData.password,
      };

      const response = await axios.post(
        "http://localhost:8080/register",
        payload
      );

      if (response.status === 200) {
        setSuccess("Đăng ký thành công! Đang chuyển hướng...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (err) {
      console.error(err);
      // THAY THẾ ALERT: Set state để hiển thị lỗi ra UI
      const message =
        err.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.";
      setServerError(message);
    } finally {
      if (!success) setLoading(false);
    }
  };

  const renderInput = (
    id,
    label,
    type,
    icon,
    placeholder,
    colSpan = "col-span-1"
  ) => (
    <div className={`mb-2 ${colSpan}`}>
      <label
        htmlFor={id}
        className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 ml-1"
      >
        {label}
      </label>
      <div className="relative group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none transition-colors duration-200">
          {icon}
        </div>
        <input
          id={id}
          name={id}
          type={type}
          maxLength={type === "password" ? 12 : undefined}
          className={`block w-full pl-10 pr-4 py-3 text-sm rounded-xl transition-all duration-300 ease-in-out
                        ${
                          errors[id]
                            ? "bg-red-50 border border-red-300 text-red-900 placeholder-red-300 focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            : "bg-gray-50 border border-gray-100 text-gray-900 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:shadow-lg focus:border-transparent"
                        }`}
          placeholder={placeholder}
          value={formData[id]}
          onChange={handleChange}
          disabled={!!success}
        />
      </div>
      {errors[id] && (
        <p className="mt-1 ml-1 text-xs text-red-500 font-semibold">
          {errors[id]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[conic-gradient(at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-100 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl w-full space-y-8 bg-white/80 backdrop-blur-lg p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/50 transform transition-all hover:scale-[1.005] duration-500">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-sm">
            <svg
              className="h-6 w-6 text-indigo-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
              />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Tạo tài khoản mới
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Chào mừng bạn đến với cộng đồng của chúng tôi
          </p>
        </div>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit} noValidate>
          {/* --- HIỂN THỊ LỖI TỪ API (THAY THẾ ALERT) --- */}
          {serverError && (
            <div className="rounded-xl bg-red-50 p-4 border border-red-200 flex items-center justify-center animate-pulse">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {serverError}
                </p>
              </div>
            </div>
          )}

          {/* Success Message Banner */}
          {success && (
            <div className="rounded-xl bg-green-50 p-4 border border-green-200 flex items-center justify-center animate-bounce">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-green-800">{success}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput(
              "name",
              "Họ và tên",
              "text",
              <UserIcon />,
              "Nguyễn Văn A"
            )}
            {renderInput(
              "phone",
              "Số điện thoại",
              "text",
              <PhoneIcon />,
              "0912345678"
            )}
          </div>

          {renderInput(
            "email",
            "Email đăng nhập",
            "email",
            <MailIcon />,
            "name@company.com",
            "col-span-1"
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {renderInput(
              "password",
              "Mật khẩu",
              "password",
              <LockIcon />,
              "••••••••"
            )}
            {renderInput(
              "confirmPassword",
              "Xác nhận mật khẩu",
              "password",
              <LockIcon />,
              "••••••••"
            )}
          </div>

          <div className="py-2">
            <div
              className={`flex items-center p-3 rounded-lg border transition-colors duration-200 ${
                errors.agreeTerms
                  ? "bg-red-50 border-red-200"
                  : "bg-gray-50 border-transparent hover:bg-gray-100"
              }`}
            >
              <input
                id="agree-terms"
                name="agree-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={handleCheckboxChange}
                disabled={!!success}
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded cursor-pointer"
              />
              <label
                htmlFor="agree-terms"
                className="ml-3 block text-sm text-gray-700 cursor-pointer select-none"
              >
                Tôi đồng ý với{" "}
                <Link
                  to="/terms"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Điều khoản sử dụng
                </Link>{" "}
                và{" "}
                <Link
                  to="/privacy"
                  className="font-semibold text-indigo-600 hover:text-indigo-500 hover:underline"
                >
                  Chính sách bảo mật
                </Link>
              </label>
            </div>
            {errors.agreeTerms && (
              <p className="mt-1 text-xs text-red-500 font-semibold animate-pulse ml-1">
                ⚠ {errors.agreeTerms}
              </p>
            )}
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !!success}
              className={`group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white overflow-hidden transition-all duration-300 shadow-lg hover:shadow-indigo-500/30
                                ${
                                  loading || !!success
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 hover:to-blue-700 transform hover:-translate-y-1"
                                }`}
            >
              <div className="absolute top-0 left-0 w-full h-full bg-white/10 opacity-0 group-hover:opacity-20 transition-opacity"></div>
              {loading ? (
                <span className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Đang xử lý...
                </span>
              ) : success ? (
                "Hoàn tất!"
              ) : (
                "Đăng ký tài khoản"
              )}
            </button>
          </div>

          <div className="text-center mt-4">
            <p className="text-sm text-gray-600">
              Đã có tài khoản?{" "}
              <Link
                to="/login"
                className="font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
              >
                Đăng nhập ngay
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterPage;
