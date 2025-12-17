
import React, { useState, useEffect } from "react";
import axiosClient from "../store/axiosClient";
import { User, Phone, MapPin, Mail, Shield, Save, X } from "lucide-react"; // Nếu chưa có lucide-react thì cài: npm i lucide-react

const PHONE_REGEX = /^(0[3|5|7|8|9])[0-9]{8}$/;

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [form, setForm] = useState(null);
    const [errors, setErrors] = useState({});
    const [isSaving, setIsSaving] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");


    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setIsLoading(true);
                const res = await axiosClient.get("/user/profile");
                const data = res.data?.data || {};

                const mappedUser = {
                    fullName: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    address: data.address || "",
                    roleName: data.roleName || "Người dùng",
                    avatarUrl: data.avatarUrl || "", // Vẫn lấy để hiển thị, nhưng không cho sửa
                };

                setUser(mappedUser);
                setForm(mappedUser);
            } catch (err) {
                console.error("PROFILE ERROR:", err);
                setError("Không lấy được thông tin người dùng");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProfile();
    }, []);


    const validate = (values) => {
        const newErrors = {};
        if (!values.fullName || !values.fullName.trim()) {
            newErrors.fullName = "Tên hiển thị không được để trống";
        }
        if (!values.phone || !values.phone.trim()) {
            newErrors.phone = "Số điện thoại bắt buộc nhập";
        } else if (!PHONE_REGEX.test(values.phone.trim())) {
            newErrors.phone = "Số điện thoại không hợp lệ (VN)";
        }
        return newErrors;
    };


    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        setErrors((prev) => ({ ...prev, [name]: undefined }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form) return;

        const validationErrors = validate(form);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSaving(true);
        setError("");
        setSuccess("");

        try {
     
            const payload = {
                name: form.fullName,
                phone: form.phone,
                address: form.address,
            };

            const res = await axiosClient.put("/user/update/profile", payload);
            const data = res.data?.data || {};

            const updatedUser = {
                ...user,
                fullName: data.name || form.fullName,
                phone: data.phone || form.phone,
                address: data.address || form.address,
            };

            setUser(updatedUser);
            setForm(updatedUser);
            setSuccess("Đã cập nhật hồ sơ thành công!");
        } catch (err) {
            console.error("UPDATE ERROR:", err);
            setError("Có lỗi xảy ra, vui lòng thử lại sau.");
        } finally {
            setIsSaving(false);
        }
    };


    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    if (!user || !form) return null;

 
    const displayAvatar =
        user.avatarUrl ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(
            user.fullName
        )}&background=6366f1&color=fff&size=128`;

    return (
        <div className="min-h-screen bg-gray-50/50 pb-10">
            {/* Banner Background */}
            <div className="h-48 bg-gradient-to-r from-indigo-600 to-purple-600 w-full relative">
                <div className="absolute inset-0 bg-black/10"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 relative z-10">
                <div className="flex flex-col md:flex-row gap-6">
               
                    <div className="md:w-1/3 flex flex-col gap-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center">
                            {/* Avatar */}
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full p-1 bg-white shadow-lg -mt-16">
                                    <img
                                        src={displayAvatar}
                                        alt="Profile"
                                        className="w-full h-full rounded-full object-cover border border-gray-100"
                                    />
                                </div>
                                {/* Badge Role */}
                                <div className="absolute bottom-2 right-2 bg-indigo-600 text-white text-[10px] font-bold px-2 py-1 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                                    <Shield size={10} />
                                    {user.roleName}
                                </div>
                            </div>

                            <h2 className="mt-4 text-xl font-bold text-gray-900">
                                {user.fullName}
                            </h2>
                            <p className="text-gray-500 text-sm">
                                {user.email}
                            </p>

                            <div className="w-full border-t border-gray-100 my-4"></div>

                            {/* Read-only Stats */}
                            <div className="w-full space-y-3">
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Shield size={16} /> Tài khoản
                                    </span>
                                    <span className="font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded text-xs">
                                        Đã xác thực
                                    </span>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                    <span className="text-gray-500 flex items-center gap-2">
                                        <Mail size={16} /> Email
                                    </span>
                                    <span className="font-medium text-gray-700 truncate max-w-[150px]">
                                        {user.email}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="md:w-2/3">
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900">
                                        Thông tin cá nhân
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Cập nhật thông tin liên hệ của bạn
                                    </p>
                                </div>
                                
                                {JSON.stringify(form) !==
                                    JSON.stringify(user) && (
                                    <button
                                        onClick={() => {
                                            setForm(user);
                                            setErrors({});
                                            setError("");
                                            setSuccess("");
                                        }}
                                        className="text-gray-500 hover:text-red-500 transition-colors p-2"
                                        title="Hủy thay đổi"
                                    >
                                        <X size={20} />
                                    </button>
                                )}
                            </div>

                            <div className="p-6">
                                {/* Alert Messages */}
                                {error && (
                                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full"></div>
                                        {error}
                                    </div>
                                )}
                                {success && (
                                    <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-600 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                                        <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></div>
                                        {success}
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit}
                                    className="space-y-6"
                                >
                               
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                   
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <User
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                Họ và tên
                                            </label>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={form.fullName}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-100 ${
                                                    errors.fullName
                                                        ? "border-red-300 focus:border-red-500"
                                                        : "border-gray-200 focus:border-indigo-500"
                                                }`}
                                                placeholder="Nhập tên của bạn"
                                            />
                                            {errors.fullName && (
                                                <p className="text-red-500 text-xs ml-1">
                                                    {errors.fullName}
                                                </p>
                                            )}
                                        </div>

                                        {/* Phone */}
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                                <Phone
                                                    size={16}
                                                    className="text-gray-400"
                                                />
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="text"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-2.5 rounded-xl border bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-100 ${
                                                    errors.phone
                                                        ? "border-red-300 focus:border-red-500"
                                                        : "border-gray-200 focus:border-indigo-500"
                                                }`}
                                                placeholder="0912..."
                                            />
                                            {errors.phone && (
                                                <p className="text-red-500 text-xs ml-1">
                                                    {errors.phone}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                              
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                            <MapPin
                                                size={16}
                                                className="text-gray-400"
                                            />
                                            Địa chỉ giao hàng
                                        </label>
                                        <textarea
                                            name="address"
                                            value={form.address}
                                            onChange={handleChange}
                                            rows="3"
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:bg-white transition-all outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 resize-none"
                                            placeholder="Số nhà, tên đường, phường/xã..."
                                        ></textarea>
                                    </div>

                               
                                    <div className="pt-4 flex items-center justify-end gap-3 border-t border-gray-100">
                                        <button
                                            type="submit"
                                            disabled={isSaving}
                                            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2.5 rounded-xl font-medium transition-all shadow-lg shadow-indigo-200 active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
                                        >
                                            {isSaving ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                                    Đang lưu...
                                                </>
                                            ) : (
                                                <>
                                                    <Save size={18} />
                                                    Lưu thay đổi
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
