import React, { useEffect, useState } from "react";
import { useAdminDiscountsStore } from "../../store/admin.discounts.store";
import {
    Plus,
    Tag,
    Loader2,
    Calendar,
    Percent,
    Search,
    AlertCircle,
    FileText,
    Send,
    Trash2,
    Power,
} from "lucide-react";

const DiscountAdmin = () => {
    const {
        discounts,
        fetchDiscounts,
        createDiscount,
        form,
        setForm,
        loading,
        loadingSend,
        sendDiscountNotification,
        deleteDiscount,
    } = useAdminDiscountsStore();

    const [searchTerm, setSearchTerm] = useState("");

    // ===== NOTICE =====
    const [notice, setNotice] = useState({ type: "", message: "" });

    const showNotice = (type, message) => {
        setNotice({ type, message });
        setTimeout(() => setNotice({ type: "", message: "" }), 2500);
    };

    useEffect(() => {
        fetchDiscounts();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await createDiscount();
            showNotice("success", "Tạo mã thành công");
        } catch {
            showNotice("error", "Tạo mã thất bại");
        }
    };

    const handleSendClick = async (code) => {
        try {
            await sendDiscountNotification(code);
            showNotice("success", `Đã gửi mã ${code}`);
        } catch {
            showNotice("error", `Gửi mã ${code} thất bại`);
        }
    };

    const handleDeleteClick = async (code) => {
        try {
            await deleteDiscount(code);
            showNotice("success", `Đã xoá mã ${code}`);
        } catch {
            showNotice("error", `Xoá mã ${code} thất bại`);
        }
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return "N/A";
        return new Date(timestamp).toLocaleString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
        });
    };

    const filteredDiscounts = discounts.filter((d) =>
        d.code?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-6 md:p-8">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                    <Tag className="text-blue-600" />
                    Quản lý Mã Giảm Giá
                </h1>

                {/* ===== NOTICE SLOT (LUÔN CHỪA CHỖ → KHÔNG NHẢY) ===== */}
                <div className="h-12 mb-4">
                    {notice.message && (
                        <div
                            className={`h-12 flex items-center rounded-lg border px-4 text-sm font-medium transition-all ${
                                notice.type === "success"
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-red-50 text-red-700 border-red-200"
                            }`}
                        >
                            {notice.message}
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* ===== FORM ===== */}
                    <div>
                        <div className="bg-white border rounded-xl">
                            <div className="p-4 border-b font-bold">
                                Tạo mã mới
                            </div>
                            <form
                                onSubmit={handleSubmit}
                                className="p-4 space-y-4"
                            >
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder="CODE"
                                    value={form.code}
                                    onChange={(e) =>
                                        setForm(
                                            "code",
                                            e.target.value.toUpperCase()
                                        )
                                    }
                                    required
                                />
                                <input
                                    type="number"
                                    className="w-full border p-2 rounded"
                                    placeholder="%"
                                    value={form.percentage}
                                    onChange={(e) =>
                                        setForm(
                                            "percentage",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                <input
                                    className="w-full border p-2 rounded"
                                    placeholder="Mô tả"
                                    value={form.desc}
                                    onChange={(e) =>
                                        setForm("desc", e.target.value)
                                    }
                                />
                                <input
                                    type="datetime-local"
                                    className="w-full border p-2 rounded"
                                    value={form.expiryDate}
                                    onChange={(e) =>
                                        setForm(
                                            "expiryDate",
                                            e.target.value
                                        )
                                    }
                                    required
                                />
                                <button
                                    disabled={loading}
                                    className="w-full bg-blue-600 text-white py-2 rounded"
                                >
                                    {loading ? (
                                        <Loader2
                                            className="animate-spin mx-auto"
                                            size={18}
                                        />
                                    ) : (
                                        "Thêm mã"
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* ===== LIST ===== */}
                    <div className="lg:col-span-2 bg-white border rounded-xl overflow-hidden">
                        <div className="p-4 border-b flex justify-between">
                            <input
                                className="border p-2 rounded w-64"
                                placeholder="Tìm mã..."
                                value={searchTerm}
                                onChange={(e) =>
                                    setSearchTerm(e.target.value)
                                }
                            />
                            <span className="text-sm text-gray-500">
                                Tổng: {filteredDiscounts.length}
                            </span>
                        </div>

                        <table className="w-full text-sm">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="p-3 text-left">Code</th>
                                    <th className="p-3 text-left">%</th>
                                    <th className="p-3 text-left">
                                        Trạng thái
                                    </th>
                                    <th className="p-3 text-left">
                                        Hạn dùng
                                    </th>
                                    <th className="p-3 text-right">
                                        Tác vụ
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredDiscounts.map((d) => {
                                    const isPublished = d.isPublished;

                                    return (
                                        <tr
                                            key={d._id || d.code}
                                            className="border-t"
                                        >
                                            <td className="p-3 font-bold">
                                                {d.code}
                                            </td>
                                            <td className="p-3 text-green-700 font-bold">
                                                -{d.discount}%
                                            </td>
                                            <td className="p-3">
                                                {isPublished
                                                    ? "Đã gửi"
                                                    : "Chưa gửi"}
                                            </td>
                                            <td className="p-3">
                                                {formatDate(d.expireAt)}
                                            </td>
                                            <td className="p-3 text-right">
                                                {!isPublished && (
                                                    <>
                                                        <button
                                                            onClick={() =>
                                                                handleSendClick(
                                                                    d.code
                                                                )
                                                            }
                                                            disabled={
                                                                loadingSend
                                                            }
                                                            className="mr-2 text-blue-600"
                                                        >
                                                            <Send size={16} />
                                                        </button>

                                                        <button
                                                            onClick={() =>
                                                                handleDeleteClick(
                                                                    d.code
                                                                )
                                                            }
                                                            className="text-red-600"
                                                        >
                                                            <Trash2 size={16} />
                                                        </button>
                                                    </>
                                                )}

                                                {isPublished && (
                                                    <span className="inline-flex items-center gap-1 text-green-700">
                                                        <Power size={14} />
                                                        Active
                                                    </span>
                                                )}
                                            </td>
                                        </tr>
                                    );
                                })}

                                {filteredDiscounts.length === 0 && (
                                    <tr>
                                        <td
                                            colSpan={5}
                                            className="p-10 text-center text-gray-400"
                                        >
                                            <AlertCircle className="mx-auto mb-2" />
                                            Không có mã
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DiscountAdmin;
