import React, { useEffect, useState } from "react";
import { useMediaStore } from "../store/media.store";
import axiosClient from "../store/axiosClient";

const CategorySection = ({ category }) => {
    const [fileNames, setFileNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

   
    const [notify, setNotify] = useState({
        show: false,
        message: "",
        type: "",
    });

    const showMessage = (msg, type = "success") => {
        setNotify({ show: true, message: msg, type });
        setTimeout(
            () => setNotify({ show: false, message: "", type: "" }),
            3000
        );
    };


    const fetchImages = async () => {
        setIsLoading(true);
        try {
            const res = await axiosClient.get("/upload/media/get/all", {
                params: { local: category.name },
            });
            if (res.data && res.data.data) {
                setFileNames(res.data.data);
            }
        } catch (error) {
            console.error(`Lỗi tải ảnh mục ${category.name}:`, error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (category.name) fetchImages();
    }, [category.name]);

 
    const handleUpload = async (event) => {
        const files = event.target.files;
        if (!files || files.length === 0) return;

        setIsUploading(true);
        try {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append("files", files[i]);
            }

            await axiosClient.post("/upload/media", formData, {
                params: { local: category.name },
                headers: { "Content-Type": "multipart/form-data" },
            });

            showMessage("Thêm ảnh thành công!", "success");
            fetchImages();
        } catch (error) {
            console.error("Upload lỗi:", error);
            showMessage("Lỗi upload ảnh.", "error");
        } finally {
            setIsUploading(false);
            event.target.value = null;
        }
    };

  
    const handleDelete = async (fileName) => {
       
        try {
            await axiosClient.delete("/upload/delete/media", {
                params: {
                    name: fileName, // @RequestParam("name")
                    local: category.name, // @RequestParam("local")
                },
            });

        
            setFileNames((prev) => prev.filter((name) => name !== fileName));
            showMessage("Đã xóa ảnh.", "success");
        } catch (error) {
            console.error("Lỗi xóa ảnh:", error);
            showMessage("Không thể xóa ảnh.", "error");
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        showMessage("Đã copy link!", "success");
    };

    const getImageUrl = (fileName) => {
        return `http://localhost:8080/storage/${category.name}/${fileName}`;
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-6 relative transition-all hover:shadow-md">
         
            <div className="flex items-center justify-between border-b pb-4 mb-4 border-gray-100">
                <div className="flex flex-col gap-1">
                    <h2 className="text-xl font-bold text-gray-800 capitalize flex items-center gap-2">
                        <span
                            className={`w-1.5 h-6 rounded-full inline-block ${
                                category.name === "marketing"
                                    ? "bg-purple-500"
                                    : category.name === "discount"
                                    ? "bg-orange-500"
                                    : "bg-blue-500"
                            }`}
                        ></span>
                        {category.name}
                    </h2>
                    <p className="text-sm text-gray-400 pl-4">
                        Folder: {category.name}
                    </p>
                </div>

                {notify.show && (
                    <div
                        className={`px-4 py-2 rounded-lg text-sm font-medium animate-pulse ${
                            notify.type === "success"
                                ? "bg-green-100 text-green-700 border border-green-200"
                                : "bg-red-100 text-red-700 border border-red-200"
                        }`}
                    >
                        {notify.message}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-6">
                {isLoading ? (
                    <div className="col-span-full text-center py-4 text-gray-400">
                        Đang tải...
                    </div>
                ) : fileNames.length > 0 ? (
                    fileNames.map((fileName, index) => (
                        <div
                            key={index}
                            className="group relative border rounded-lg overflow-hidden shadow-sm aspect-square bg-gray-50"
                        >
                            <img
                                src={getImageUrl(fileName)}
                                alt={fileName}
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/150?text=Error";
                                }}
                                className="object-cover w-full h-full"
                            />

                            {/* Overlay Action */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 px-2">
                                <p className="text-white text-[10px] truncate w-full text-center px-1 mb-1">
                                    {fileName}
                                </p>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() =>
                                            copyToClipboard(
                                                getImageUrl(fileName)
                                            )
                                        }
                                        className="bg-white text-gray-800 text-xs px-2 py-1 rounded hover:bg-gray-200 font-medium"
                                    >
                                        Copy
                                    </button>

                                    <button
                                        onClick={() => handleDelete(fileName)}
                                        className="bg-red-500 text-white text-xs px-2 py-1 rounded hover:bg-red-600 font-medium"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-8 text-center text-gray-400 text-sm border-2 border-dashed border-gray-100 rounded-lg">
                        Chưa có ảnh nào.
                    </div>
                )}
            </div>

          
            <div className="flex justify-start">
                <label
                    className={`cursor-pointer inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isUploading
                            ? "bg-gray-100 text-gray-400"
                            : "bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-100"
                    }`}
                >
                    <input
                        type="file"
                        className="hidden"
                        multiple
                        accept="image/*"
                        disabled={isUploading}
                        onChange={handleUpload}
                    />
                    {isUploading ? (
                        <span>Đang tải lên...</span>
                    ) : (
                        <>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                                />
                            </svg>
                            <span>Thêm ảnh vào mục {category.name}</span>
                        </>
                    )}
                </label>
            </div>
        </div>
    );
};


export default function MediaManager() {
    const init = useMediaStore((s) => s.init);
    const [categories, setCategories] = useState([]);

    const fetchCategories = async () => {
        try {
            const res = await axiosClient.get("/category/all");
            if (res.data && res.data.data) {
                setCategories(res.data.data);
            }
        } catch (error) {
            console.error("Lỗi lấy danh mục:", error);
        }
    };

    useEffect(() => {
        init();
        fetchCategories();
    }, [init]);

    return (
        <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-800 mb-8">
                Kho tài sản số (Media Manager)
            </h1>
            <div className="space-y-4">
                {categories.map((category) => (
                    <CategorySection key={category.id} category={category} />
                ))}
            </div>
        </div>
    );
}
