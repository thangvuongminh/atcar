import React from "react";
import { Link } from "react-router-dom";
import { Lock } from "lucide-react";

const ForbiddenPage = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
      <Lock className="w-16 h-16 text-red-500 mb-4" />

      <h1 className="text-4xl font-bold text-gray-800 mb-2">403 - Truy cập bị từ chối</h1>

      <p className="text-gray-600 max-w-md mb-6">
        Bạn không có quyền truy cập vào trang này.<br />
        Vui lòng liên hệ quản trị viên hoặc quay lại trang chủ.
      </p>

      <Link
        to="/"
        className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-md transition font-medium"
      >
        Quay lại trang chủ
      </Link>
    </div>
  );
};

export default ForbiddenPage;
