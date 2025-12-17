import React from "react";
import { Link, Form, useNavigate } from "react-router-dom";
import { useForgotPasswordStore } from "../store/forgotPassword.store";
import axios from "axios";

const ForgotPasswordPage = () => {
    
    const step = useForgotPasswordStore((s) => s.step);
    const loading = useForgotPasswordStore((s) => s.loading);
    const form1 = useForgotPasswordStore((s) => s.form1);
    const form2 = useForgotPasswordStore((s) => s.form2);
    const set1 = useForgotPasswordStore((s) => s.set1);
    const set2 = useForgotPasswordStore((s) => s.set2);
    const backToStep1 = useForgotPasswordStore((s) => s.backToStep1);
    const error = useForgotPasswordStore((s) => s.error);
    const success = useForgotPasswordStore((s) => s.success);

    const navigate = useNavigate();

   
    const handleRequestOtp = async (e) => {
        e.preventDefault();

        // 1. Reset lỗi cũ
        useForgotPasswordStore.setState({
            loading: false,
            error: "",
            success: "",
        });

     
        const emailValue = form1.email.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailValue) {
            useForgotPasswordStore.setState({
                error: "Vui lòng nhập địa chỉ email!",
            });
            return;
        }
        if (!emailRegex.test(emailValue)) {
            useForgotPasswordStore.setState({
                error: "Địa chỉ email không đúng định dạng!",
            });
            return;
        }

    
        useForgotPasswordStore.setState({ loading: true });
        try {
            const response = await axios.post(
                "http://localhost:8080/forget-password",
                null,
                {
                    params: { email: emailValue },
                }
            );

            if (response.status === 200) {
                const msg =
                    response.data?.message ||
                    "Đã gửi mã OTP, vui lòng kiểm tra email!";
                useForgotPasswordStore.setState((state) => ({
                    loading: false,
                    success: msg,
                    step: 2,
                    form2: { ...state.form2, email: emailValue }, // Copy email sang bước 2
                }));
            }
        } catch (err) {
            console.error("Lỗi:", err);
            const errorMsg =
                err.response?.data?.message ||
                "Email không tồn tại hoặc lỗi hệ thống.";
            useForgotPasswordStore.setState({
                loading: false,
                error: errorMsg,
            });
        }
    };

 
    const handleSubmitReset = async (e) => {
        e.preventDefault();


        useForgotPasswordStore.setState({
            loading: false,
            error: "",
            success: "",
        });

  
        const { otp, newPassword, confirmPassword } = form2;

        if (!otp.trim()) {
            useForgotPasswordStore.setState({ error: "Vui lòng nhập mã OTP!" });
            return;
        }

        if (!newPassword) {
            useForgotPasswordStore.setState({
                error: "Vui lòng nhập mật khẩu mới!",
            });
            return;
        }

        if (newPassword.length < 6) {
            useForgotPasswordStore.setState({
                error: "Mật khẩu mới phải có ít nhất 6 ký tự!",
            });
            return;
        }

        if (!confirmPassword) {
            useForgotPasswordStore.setState({
                error: "Vui lòng nhập lại mật khẩu!",
            });
            return;
        }

        if (newPassword !== confirmPassword) {
            useForgotPasswordStore.setState({
                error: "Mật khẩu xác nhận không khớp!",
            });
            return;
        }

        useForgotPasswordStore.setState({ loading: true });

        try {
            const payload = {
                otp: otp.trim(),
                newPassword: newPassword,
            };

            const response = await axios.post(
                "http://localhost:8080/new-password",
                payload
            );

            if (response.status === 200) {
                const msg =
                    response.data?.message || "Đổi mật khẩu thành công!";
                useForgotPasswordStore.setState({
                    loading: false,
                    success: msg + " Đang chuyển về trang đăng nhập...",
                });

                setTimeout(() => {
                    navigate("/login");
                    useForgotPasswordStore.getState().reset();
                }, 2000);
            }
        } catch (err) {
            console.error("Lỗi đổi pass:", err);
            const errorMsg =
                err.response?.data?.message || "OTP sai hoặc đã hết hạn.";
            useForgotPasswordStore.setState({
                loading: false,
                error: errorMsg,
            });
        }
    };

 
    const MailIcon = () => (
        <svg
            className="w-5 h-5 text-gray-400"
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
            className="w-5 h-5 text-gray-400"
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
    const KeyIcon = () => (
        <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
        >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
            />
        </svg>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden transform transition-all hover:scale-[1.01] duration-300">
                {/* Header */}
                <div className="bg-white p-8 pb-0 text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
                        <svg
                            className="w-8 h-8 text-blue-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                            />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight">
                        {step === 1 ? "Quên mật khẩu?" : "Đặt lại mật khẩu"}
                    </h2>
                    <p className="text-sm text-gray-500 mt-2 px-6">
                        {step === 1
                            ? "Nhập email của bạn để nhận mã khôi phục."
                            : "Nhập OTP và thiết lập mật khẩu mới an toàn hơn."}
                    </p>
                </div>

           
                <div className="p-8">
                    {error && (
                        <div className="mb-6 flex items-center bg-red-50 border-l-4 border-red-500 text-red-700 px-4 py-3 rounded-r shadow-sm animate-pulse">
                            <span className="text-sm font-medium">{error}</span>
                        </div>
                    )}
                    {success && (
                        <div className="mb-6 flex items-center bg-green-50 border-l-4 border-green-500 text-green-700 px-4 py-3 rounded-r shadow-sm">
                            <span className="text-sm font-medium">
                                {success}
                            </span>
                        </div>
                    )}

                    {step === 1 ? (
                       
                        
                        <Form
                            method="post"
                            onSubmit={handleRequestOtp}
                            className="space-y-6"
                            noValidate
                        >
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Địa chỉ Email
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon />
                                    </div>
                                    <input
                                        type="email"
                                       
                                        value={form1.email}
                                        onChange={(e) =>
                                            set1("email", e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="vidu@gmail.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70"
                            >
                                {loading ? "Đang gửi..." : "Gửi mã xác nhận"}
                            </button>

                            <div className="text-center mt-4">
                                <Link
                                    to="/login"
                                    className="font-medium text-sm text-blue-600 hover:text-indigo-500"
                                >
                                    ← Quay lại đăng nhập
                                </Link>
                            </div>
                        </Form>
                    ) : (
                        
                       
                        <Form
                            method="post"
                            onSubmit={handleSubmitReset}
                            className="space-y-5"
                            noValidate
                        >
                            {/* Email Readonly */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Email nhận mã
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <MailIcon />
                                    </div>
                                    <input
                                        type="email"
                                        value={form2.email}
                                        readOnly
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-200 text-gray-500 cursor-not-allowed focus:outline-none"
                                    />
                                </div>
                            </div>

                        
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Mã OTP
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <KeyIcon />
                                    </div>
                                    <input
                                        type="text"
                                       
                                        value={form2.otp}
                                        onChange={(e) =>
                                            set2("otp", e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Nhập mã OTP trong email"
                                    />
                                </div>
                            </div>

                            
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Mật khẩu mới
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon />
                                    </div>
                                    <input
                                        type="password"
                                       
                                        value={form2.newPassword}
                                        onChange={(e) =>
                                            set2("newPassword", e.target.value)
                                        }
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Ít nhất 6 ký tự"
                                    />
                                </div>
                            </div>

                         
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">
                                    Xác nhận mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <LockIcon />
                                    </div>
                                    <input
                                        type="password"
                                       
                                        value={form2.confirmPassword}
                                        onChange={(e) =>
                                            set2(
                                                "confirmPassword",
                                                e.target.value
                                            )
                                        }
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-200 rounded-xl bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
                                        placeholder="Nhập lại mật khẩu mới"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-lg text-sm font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 disabled:opacity-70"
                            >
                                {loading ? "Đang xử lý..." : "Đặt lại mật khẩu"}
                            </button>

                            <div className="flex items-center justify-between mt-4">
                                <button
                                    type="button"
                                    onClick={backToStep1}
                                    className="text-sm text-gray-500 hover:text-gray-800 transition-colors"
                                >
                                    Nhập sai email?
                                </button>
                                <Link
                                    to="/login"
                                    className="text-sm font-medium text-blue-600 hover:text-indigo-500 transition-colors"
                                >
                                    Đăng nhập
                                </Link>
                            </div>
                        </Form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;
