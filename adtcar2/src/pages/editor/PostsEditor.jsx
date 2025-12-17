import React, { useEffect, useState } from "react";
import { useEditorPostsStore } from "../../store/editor.posts.store";
import axiosClient from "../../store/axiosClient";
import { useParams, useNavigate } from "react-router-dom";
import {
    Upload,
    Save,
    ArrowLeft,
    Loader2,
    Check,
    CheckCircle,
    AlertCircle,
    X,
    Trash2,
} from "lucide-react";

// --- HÀM GHÉP LINK ẢNH ---
const getFullUrl = (path) => {
    if (!path) return "";
    if (path.startsWith("http")) return path;
    return `http://localhost:8080/storage/${path}`;
};

// --- COMPONENT THƯ VIỆN ---
const MediaLibraryBlock = ({ selectedUrls, toggleUrl }) => {
    const [folders, setFolders] = useState([]);
    const [activeFolder, setActiveFolder] = useState(null);
    const [images, setImages] = useState([]);

    useEffect(() => {
        axiosClient.get("/category/all").then((res) => {
            if (res.data?.data) {
                setFolders(res.data.data);
                if (res.data.data.length > 0)
                    setActiveFolder(res.data.data[0].name);
            }
        });
    }, []);

    useEffect(() => {
        if (!activeFolder) return;
        setImages([]);
        axiosClient
            .get("/upload/media/get/all", {
                params: { local: activeFolder },
            })
            .then((res) => {
                if (res.data?.data) setImages(res.data.data);
            });
    }, [activeFolder]);

    return (
        <div className="flex h-[400px] border border-gray-200 rounded-lg overflow-hidden bg-white mt-3">
            <div className="w-1/4 border-r bg-gray-50 p-2 overflow-y-auto">
                {folders.map((f) => (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => setActiveFolder(f.name)}
                        className={`w-full text-left px-3 py-2 text-sm rounded mb-1 ${
                            activeFolder === f.name
                                ? "bg-blue-100 text-blue-700 font-medium"
                                : "hover:bg-gray-200 text-gray-700"
                        }`}
                    >
                        {f.name}
                    </button>
                ))}
            </div>
            <div className="w-3/4 p-4 grid grid-cols-4 gap-3 overflow-y-auto content-start">
                {images.map((img, i) => {
                    // PATH tương đối để lưu
                    const relativePath = `${activeFolder}/${img}`;
                    const isSelected = selectedUrls.includes(relativePath);

                    return (
                        <div
                            key={i}
                            onClick={() => toggleUrl(relativePath)}
                            className={`aspect-square border-2 cursor-pointer relative rounded-lg overflow-hidden group ${
                                isSelected
                                    ? "border-blue-600 ring-2 ring-blue-50"
                                    : "border-gray-200 hover:border-blue-400"
                            }`}
                        >
                            <img
                                src={getFullUrl(relativePath)}
                                className="w-full h-full object-cover"
                            />
                            {isSelected && (
                                <div className="absolute top-1 right-1 bg-blue-600 text-white p-1 rounded-full shadow-sm">
                                    <Check size={12} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- TRANG CHÍNH ---
export default function PostEditor() {
    const { id } = useParams();
    const navigate = useNavigate();
    const {
        form,
        onChange,
        submit,
        deletePost,
        isLoading,
        getPostDetail,
        reset,
    } = useEditorPostsStore();

    const [apiCategories, setApiCategories] = useState([]);
    const [tab, setTab] = useState("LIBRARY");
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [selectedUrls, setSelectedUrls] = useState([]);
    const [notification, setNotification] = useState(null);

    // 1. Load dữ liệu
    useEffect(() => {
        reset();
        axiosClient.get("/category/all").then((res) => {
            if (res.data?.data) setApiCategories(res.data.data);
        });
        if (id) getPostDetail(id);
    }, [id]);

    // 2. Đồng bộ dữ liệu cũ vào state hiển thị
    useEffect(() => {
        // Ở API bạn là urlImg, nên ưu tiên form.urlImg
        let raw = form.urlImg ?? form.url;
        if (!raw) {
            setSelectedUrls([]);
            return;
        }
        console.log(form);
        let urls;

        if (Array.isArray(raw)) {
            urls = raw;
        } else if (typeof raw === "string") {
            // nếu backend lỡ trả string JSON thì parse
            if (raw.trim().startsWith("[")) {
                try {
                    urls = JSON.parse(raw);
                } catch {
                    urls = [raw];
                }
            } else {
                urls = [raw];
            }
        } else {
            urls = [];
        }

        // Chuẩn hóa: bỏ http://.../storage/ nếu có
        const normalized = urls
            .filter(Boolean)
            .map((u) => u.replace(/^https?:\/\/[^/]+\/storage\//, ""));

        setSelectedUrls(normalized); // luôn là path kiểu marketing/xxx.jpg
    }, [form.urlImg, form.url]);

    const handleToggleUrl = (url) =>
        setSelectedUrls((prev) =>
            prev.includes(url) ? prev.filter((u) => u !== url) : [...prev, url]
        );

    const handleFileChange = (e) => {
        if (e.target.files) setSelectedFiles(Array.from(e.target.files));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        onChange("files", selectedFiles);

        // gửi path lên backend (urlImg là field thật của bạn)
        onChange("urlImg", selectedUrls);
        // nếu store/BE vẫn còn dùng url thì gán luôn cho chắc
        onChange("url", selectedUrls);

        const result = await submit();
        if (result) {
            setNotification({
                type: result.success ? "success" : "error",
                message: result.message,
            });
            if (result.success)
                setTimeout(() => navigate("/editor/dashboard"), 1500);
            else setTimeout(() => setNotification(null), 3000);
        }
    };

    const handleDelete = async () => {
        const result = await deletePost(id);
        if (result && result.success) navigate("/editor/dashboard");
        else if (result) alert(result.message);
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 relative font-sans">
            {notification && (
                <div
                    className={`fixed top-5 right-5 z-50 px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 border animate-in slide-in-from-right ${
                        notification.type === "success"
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}
                >
                    {notification.type === "success" ? (
                        <CheckCircle />
                    ) : (
                        <AlertCircle />
                    )}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Header */}
            <div className="sticky top-0 z-30 bg-white border-b px-6 py-3 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/editor/dashboard")}
                        className="p-2 hover:bg-gray-100 rounded-full text-gray-500"
                    >
                        <ArrowLeft size={20} />
                    </button>
                    <h1 className="text-lg font-bold text-gray-800">
                        {id ? `Viết #${id}` : "Viết Bài Mới"}
                    </h1>
                </div>
                <div className="flex gap-3">
                    {id && (
                        <button
                            onClick={handleDelete}
                            disabled={isLoading}
                            className="px-4 py-2 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg font-medium flex items-center gap-2"
                        >
                            <Trash2 size={18} /> Xóa bài
                        </button>
                    )}
                    <button
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium shadow-sm flex items-center gap-2"
                    >
                        {isLoading ? (
                            <Loader2 className="animate-spin" size={18} />
                        ) : (
                            <Save size={18} />
                        )}{" "}
                        {isLoading
                            ? "Đang xử lý..."
                            : id
                            ? "Cập Nhật"
                            : "Đăng Bài"}
                    </button>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-5xl mx-auto px-6 py-8 space-y-6">
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        1. Tiêu đề
                    </label>
                    <input
                        type="text"
                        value={form.title}
                        onChange={(e) => onChange("title", e.target.value)}
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg outline-none focus:border-blue-500"
                        placeholder="Nhập tiêu đề..."
                    />
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        2. Danh mục
                    </label>
                    <select
                        value={form.categoryName || ""}
                        onChange={(e) =>
                            onChange("categoryName", e.target.value)
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-white outline-none focus:border-blue-500"
                    >
                        <option value="">-- Chọn danh mục --</option>
                        {apiCategories.map((c) => (
                            <option key={c.id} value={c.name}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* --- PHẦN MEDIA --- */}
                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <div className="flex justify-between items-center mb-3">
                        <label className="text-sm font-bold text-gray-700">
                            3 & 4. Hình ảnh
                        </label>
                        <div className="flex bg-gray-100 p-1 rounded-lg">
                            <button
                                type="button"
                                onClick={() => setTab("LIBRARY")}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${
                                    tab === "LIBRARY"
                                        ? "bg-white shadow-sm text-blue-700"
                                        : "text-gray-500"
                                }`}
                            >
                                Thư viện
                            </button>
                            <button
                                type="button"
                                onClick={() => setTab("UPLOAD")}
                                className={`px-4 py-1.5 text-xs font-medium rounded-md transition ${
                                    tab === "UPLOAD"
                                        ? "bg-white shadow-sm text-blue-700"
                                        : "text-gray-500"
                                }`}
                            >
                                Upload
                            </button>
                        </div>
                    </div>

                    {/* Ảnh đang chọn */}
                    {selectedUrls.length > 0 && (
                        <div className="mb-4 p-4 bg-blue-50 border border-blue-100 rounded-lg">
                            <p className="text-xs font-bold text-blue-700 mb-2 uppercase flex items-center gap-2">
                                <CheckCircle size={14} /> Ảnh đang chọn (
                                {selectedUrls.length})
                            </p>
                            <div className="flex gap-3 overflow-x-auto pb-2">
                                {selectedUrls.map((u, i) => (
                                    <div
                                        key={i}
                                        className="relative group flex-shrink-0"
                                    >
                                        <img
                                            src={getFullUrl(u)}
                                            className="w-24 h-24 object-cover rounded-lg border border-blue-200 shadow-sm bg-white"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => handleToggleUrl(u)}
                                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition opacity-80 hover:opacity-100"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {tab === "LIBRARY" ? (
                        <MediaLibraryBlock
                            selectedUrls={selectedUrls}
                            toggleUrl={handleToggleUrl}
                        />
                    ) : (
                        <div className="border-2 border-dashed border-gray-300 p-10 text-center rounded-lg hover:bg-gray-50 transition cursor-pointer relative">
                            <input
                                type="file"
                                multiple
                                onChange={handleFileChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                            />
                            <Upload
                                className="mx-auto text-gray-400 mb-2"
                                size={32}
                            />
                            <p className="text-sm text-gray-500">
                                Kéo thả hoặc click để chọn ảnh từ máy tính
                            </p>
                            {selectedFiles.length > 0 && (
                                <p className="mt-2 text-blue-600 font-medium">
                                    Đã chọn {selectedFiles.length} file mới
                                </p>
                            )}
                        </div>
                    )}
                </div>

                <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                    <label className="block text-sm font-bold text-gray-700 mb-2">
                        5. Nội dung chi tiết
                    </label>
                    <textarea
                        value={form.description || ""}
                        onChange={(e) =>
                            onChange("description", e.target.value)
                        }
                        className="w-full h-64 p-4 border border-gray-300 rounded-lg outline-none focus:border-blue-500 resize-y"
                        placeholder="Viết nội dung..."
                    />
                </div>
            </div>
        </div>
    );
}
