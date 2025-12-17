import React, { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminProductsStore } from "../../store/admin.products.store";
import { Toaster, toast } from "react-hot-toast";
import {
  Package,
  Save,
  Edit,
  Trash2,
  Plus,
  UploadCloud,
  Search,
  Box,
  LayoutGrid,
  CheckCircle2,
  XCircle,
  Clock,
  Factory,
  Tag,
  ChevronLeft,
  ChevronRight,
  Filter,
  RotateCcw,
} from "lucide-react";

const BASE_IMG_URL = "http://localhost:8080/product/";

// ==========================
// HOOK DEBOUNCE (giống ProductsPage)
// ==========================
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

// ==========================
// COMPONENT PHÂN TRANG (giống ProductsPage)
// ==========================
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const renderPageNumbers = () => {
    const buttons = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      if (currentPage <= 4) {
        buttons.push(1, 2, 3, 4, 5, "...", totalPages);
      } else if (currentPage >= totalPages - 3) {
        buttons.push(
          1,
          "...",
          totalPages - 4,
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        buttons.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }

    return buttons.map((btn, index) => {
      if (btn === "...") {
        return (
          <span
            key={`dots-${index}`}
            className="w-8 h-8 flex items-center justify-center text-gray-400"
          >
            ...
          </span>
        );
      }
      return (
        <button
          key={index}
          onClick={() => handlePageChange(btn)}
          className={`w-8 h-8 flex items-center justify-center rounded-md border text-xs font-bold transition-colors ${
            currentPage === btn
              ? "bg-indigo-600 text-white border-indigo-600"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
        >
          {btn}
        </button>
      );
    });
  };

  if (!totalPages || totalPages <= 1) return null;

  return (
    <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center">
      <span className="text-sm text-gray-500">
        Trang <b>{currentPage}</b> trên <b>{totalPages}</b>
      </span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 h-8 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium text-gray-700 bg-white flex items-center gap-1"
        >
          <ChevronLeft size={14} /> Trước
        </button>
        <div className="flex gap-1">{renderPageNumbers()}</div>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 h-8 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-medium text-gray-700 bg-white flex items-center gap-1"
        >
          Sau <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

const ProductsAdmin = () => {
  const {
    products,
    totalPages,
    loading,
    editingProduct,
    fetchData,
    submit,
    startEdit,
    stopEdit,
    deleteById,
  } = useAdminProductsStore();

  // ==========================
  // STATE PHÂN TRANG & FILTER
  // ==========================
  const [currentPage, setCurrentPage] = useState(1); // 1-based cho UI
  const [pageSize, setPageSize] = useState(5);

  const [searchTerm, setSearchTerm] = useState("");

  const [filterManufacture, setFilterManufacture] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [filterMinPrice, setFilterMinPrice] = useState("");
  const [filterMaxPrice, setFilterMaxPrice] = useState("");
  const [filterMinQty, setFilterMinQty] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterMinSold, setFilterMinSold] = useState("");

  const [previewUrl, setPreviewUrl] = useState(null);

  // Gộp tất cả filter vào một object rồi debounce => giống ProductsPage
  const filtersObject = useMemo(
    () => ({
      keyword: searchTerm,
      manufacture: filterManufacture,
      unit: filterUnit,
      minPrice: filterMinPrice,
      maxPrice: filterMaxPrice,
      minQuantity: filterMinQty,
      productStatus: filterStatus,
      minSold: filterMinSold,
    }),
    [
      searchTerm,
      filterManufacture,
      filterUnit,
      filterMinPrice,
      filterMaxPrice,
      filterMinQty,
      filterStatus,
      filterMinSold,
    ]
  );

  const debouncedFilters = useDebounce(filtersObject, 400);

  // ==========================
  // REACT-HOOK-FORM
  // ==========================
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
      quantity: 1,
      sold: 0,
      unit: "",
      price: 0,
      priceFake: 0,
      manufacture: "",
      brand: "",
      productStatus: "",
      img: null,
    },
  });

  const watchedImg = watch("img");
  const watchedPrice = watch("price");
  const watchedPriceFake = watch("priceFake");

  // ==========================
  // GỌI API GIỐNG ProductsPage (dựa trên params memo + debounce)
  // ==========================
  const apiParams = useMemo(() => {
    const pageParam = Math.max(currentPage - 1, 0);
    const filters = [];

    if (debouncedFilters.keyword)
      filters.push(`name~'${debouncedFilters.keyword}'`);

    if (debouncedFilters.manufacture)
      filters.push(`manufacture~'${debouncedFilters.manufacture}'`);

    if (debouncedFilters.unit) filters.push(`unit~'${debouncedFilters.unit}'`);

    if (debouncedFilters.productStatus)
      filters.push(`productStatus='${debouncedFilters.productStatus}'`);

    if (debouncedFilters.minPrice)
      filters.push(`price>=${Number(debouncedFilters.minPrice)}`);

    if (debouncedFilters.maxPrice)
      filters.push(`price<=${Number(debouncedFilters.maxPrice)}`);

    if (debouncedFilters.minQuantity)
      filters.push(`quantity>=${Number(debouncedFilters.minQuantity)}`);

    if (debouncedFilters.minSold)
      filters.push(`sold>=${Number(debouncedFilters.minSold)}`);

    const params = {
      page: pageParam,
      size: pageSize,
    };

    if (filters.length > 0) params.filter = filters.join(" and ");

    console.log("🔥 FINAL FILTER STRING:", params.filter);

    return params;
  }, [currentPage, pageSize, debouncedFilters]);

  useEffect(() => {
    fetchData(apiParams);
  }, [apiParams]); // eslint-disable-line

  // ==========================
  // Nút clear filter
  // ==========================
  const clearFilters = () => {
    setSearchTerm("");
    setFilterManufacture("");
    setFilterUnit("");
    setFilterMinPrice("");
    setFilterMaxPrice("");
    setFilterMinQty("");
    setFilterStatus("");
    setFilterMinSold("");
    setCurrentPage(1);
  };

  // ==========================
  // FORM LOGIC
  // ==========================
  useEffect(() => {
    if (editingProduct) {
      reset({
        ...editingProduct,
        img: editingProduct.url,
        sold: editingProduct.sold || 0,
      });
      if (editingProduct.url) setPreviewUrl(BASE_IMG_URL + editingProduct.url);
    } else {
      reset({
        name: "",
        description: "",
        quantity: 1,
        sold: 0,
        unit: "",
        price: 0,
        priceFake: 0,
        manufacture: "",
        brand: "",
        productStatus: "",
        img: null,
      });
      setPreviewUrl(null);
    }
  }, [editingProduct, reset]);

  useEffect(() => {
    if (watchedImg && watchedImg.length > 0 && watchedImg[0] instanceof File) {
      setPreviewUrl(URL.createObjectURL(watchedImg[0]));
    } else if (!watchedImg && !editingProduct) {
      setPreviewUrl(null);
    }
  }, [watchedImg, editingProduct]);

  const onSubmit = async (data) => {
    const payload = { ...data };
    if (data.img instanceof FileList && data.img.length > 0)
      payload.img = data.img[0];
    if (typeof payload.img === "string") delete payload.img;

    const result = await submit(payload);
    if (result.success) {
      toast.success(editingProduct ? "Cập nhật xong!" : "Thêm mới xong!");
      if (!editingProduct) {
        reset();
        setPreviewUrl(null);
        setCurrentPage(1);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      // Gọi lại data với params hiện tại
      fetchData(apiParams);
    } else toast.error(result.message);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Xóa sản phẩm này?")) {
      const res = await deleteById(id);
      if (res.success) {
        toast.success("Đã xóa!");
        fetchData(apiParams);
      } else toast.error("Lỗi xóa: " + res.message);
    }
  };

  const formatCurrency = (val) =>
    val
      ? Number(String(val).replace(/[^0-9]/g, "")).toLocaleString("vi-VN")
      : "";
  const handlePriceChange = (e, field) =>
    setValue(field, Number(e.target.value.replace(/[^0-9]/g, "")));

  const getStatusBadge = (status) => {
    switch (status) {
      case "AVAILABLE":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
            <CheckCircle2 size={12} className="mr-1" /> Sẵn hàng
          </span>
        );
      case "OUT_OF_STOCK":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-red-100 text-red-700 border border-red-200">
            <XCircle size={12} className="mr-1" /> Hết hàng
          </span>
        );
      case "COMING_SOON":
        return (
          <span className="inline-flex items-center px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700 border border-blue-200">
            <Clock size={12} className="mr-1" /> Sắp về
          </span>
        );
      default:
        return <span className="text-gray-500 text-xs">{status}</span>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-slate-800 font-sans pb-20">
      <Toaster position="top-center" />

      <div className="w-full px-6 pt-6">
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Box className="text-indigo-600" size={28} /> Quản Lý Sản Phẩm
          </h1>
        </div>

        <div className="grid grid-cols-12 gap-6 items-start">
          {/* FORM BÊN TRÁI */}
          <div className="col-span-12 xl:col-span-3 sticky top-6 z-10">
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
              <div
                className={`px-5 py-4 border-b border-gray-100 flex items-center justify-between ${
                  editingProduct ? "bg-amber-50" : "bg-gray-50"
                }`}
              >
                <h2
                  className={`font-bold text-sm uppercase flex items-center gap-2 ${
                    editingProduct ? "text-amber-700" : "text-gray-700"
                  }`}
                >
                  {editingProduct ? <Edit size={16} /> : <Plus size={16} />}
                  {editingProduct ? "Cập nhật" : "Thêm mới"}
                </h2>
                {editingProduct && (
                  <button
                    onClick={() => {
                      stopEdit();
                      reset();
                      setPreviewUrl(null);
                    }}
                    className="text-xs text-gray-500 hover:text-red-600 border px-2 py-1 rounded bg-white"
                  >
                    Hủy
                  </button>
                )}
              </div>
              <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
                {/* Upload ảnh */}
                <div>
                  <div
                    className={`relative w-full h-48 rounded-lg border-2 border-dashed flex flex-col items-center justify-center overflow-hidden bg-gray-50 hover:bg-gray-100 transition-colors ${
                      errors.img ? "border-red-400" : "border-gray-300"
                    }`}
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        className="w-full h-full object-contain"
                        alt="Preview"
                      />
                    ) : (
                      <div className="text-center text-gray-400">
                        <UploadCloud
                          size={32}
                          className="mx-auto mb-2 text-indigo-400"
                        />
                        <span className="text-xs font-medium">Tải ảnh lên</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept=".jpg,.png,.webp"
                      {...register("img", {
                        required:
                          !editingProduct && !previewUrl ? "Chọn ảnh" : false,
                      })}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                  </div>
                  {errors.img && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.img.message}
                    </p>
                  )}
                </div>

                {/* Tên + trạng thái */}
                <div className="space-y-3">
                  <input
                    type="text"
                    {...register("name", {
                      required: "Nhập tên",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    placeholder="Tên sản phẩm *"
                  />
                  <select
                    {...register("productStatus", {
                      required: "Chọn trạng thái",
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white outline-none"
                  >
                    <option value="">-- Trạng thái --</option>
                    <option value="AVAILABLE">Sẵn hàng</option>
                    <option value="OUT_OF_STOCK">Hết hàng</option>
                    <option value="COMING_SOON">Sắp về</option>
                  </select>
                </div>

                {/* Giá */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <input
                      type="text"
                      value={formatCurrency(watchedPrice)}
                      onChange={(e) => handlePriceChange(e, "price")}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg font-bold text-indigo-700 outline-none"
                      placeholder="Giá bán *"
                    />
                    <input type="hidden" {...register("price", { min: 1 })} />
                  </div>
                  <input
                    type="text"
                    value={formatCurrency(watchedPriceFake)}
                    onChange={(e) => handlePriceChange(e, "priceFake")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-500 outline-none"
                    placeholder="Giá gốc"
                  />
                </div>

                {/* Kho, đã bán, đơn vị */}
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="number"
                    {...register("quantity", {
                      required: true,
                      min: 0,
                    })}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg outline-none"
                    placeholder="Tồn"
                  />
                  <input
                    type="number"
                    {...register("sold", { min: 0 })}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg outline-none bg-orange-50"
                    placeholder="Đã bán"
                  />
                  <input
                    type="text"
                    {...register("unit")}
                    className="w-full px-2 py-2 border border-gray-300 rounded-lg outline-none"
                    placeholder="Đơn vị"
                  />
                </div>

                {/* Brand + NSX */}
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    {...register("brand")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    placeholder="Thương hiệu"
                  />
                  <input
                    type="text"
                    {...register("manufacture")}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg outline-none"
                    placeholder="Nhà SX"
                  />
                </div>

                <textarea
                  rows={3}
                  {...register("description")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none outline-none"
                  placeholder="Mô tả..."
                />

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full py-2.5 rounded-lg font-bold text-white shadow-md flex items-center justify-center gap-2 transition-all hover:shadow-lg ${
                    editingProduct
                      ? "bg-amber-600 hover:bg-amber-700"
                      : "bg-indigo-600 hover:bg-indigo-700"
                  } ${loading && "opacity-70"}`}
                >
                  {loading ? (
                    "Lưu..."
                  ) : (
                    <>
                      <Save size={18} />{" "}
                      {editingProduct ? "Lưu thay đổi" : "Thêm sản phẩm"}
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* CỘT PHẢI: FILTER + TABLE */}
          <div className="col-span-12 xl:col-span-9 space-y-4">
            {/* BỘ LỌC (ở trên, giống kiểu ProductsPage) */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-2">
                <div className="flex items-center gap-2 font-bold text-gray-700">
                  <Filter size={18} /> Bộ lọc sản phẩm
                </div>
                <button
                  onClick={clearFilters}
                  className="text-xs flex items-center gap-1 text-red-500 hover:text-red-700 hover:underline"
                >
                  <RotateCcw size={12} /> Xóa bộ lọc
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Tìm theo tên / mô tả */}
                <div className="col-span-1 md:col-span-2 lg:col-span-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                    <input
                      type="text"
                      className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:ring-1 focus:ring-indigo-500 outline-none"
                      placeholder="Tìm theo tên hoặc mô tả..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                </div>

                {/* Trạng thái */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Trạng thái
                  </label>
                  <select
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500 bg-white"
                    value={filterStatus}
                    onChange={(e) => {
                      setFilterStatus(e.target.value);
                      setCurrentPage(1);
                    }}
                  >
                    <option value="">-- Tất cả --</option>
                    <option value="AVAILABLE">Sẵn hàng</option>
                    <option value="OUT_OF_STOCK">Hết hàng</option>
                    <option value="COMING_SOON">Sắp về</option>
                  </select>
                </div>

                {/* Đã bán tối thiểu */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Đã bán tối thiểu
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                    placeholder="VD: 50..."
                    value={filterMinSold}
                    onChange={(e) => {
                      setFilterMinSold(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* Nhà sản xuất */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Nhà sản xuất
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                    placeholder="VD: Apple..."
                    value={filterManufacture}
                    onChange={(e) => {
                      setFilterManufacture(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* Đơn vị tính */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Đơn vị tính
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                    placeholder="VD: Cái..."
                    value={filterUnit}
                    onChange={(e) => {
                      setFilterUnit(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* Tồn kho tối thiểu */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Tồn kho tối thiểu
                  </label>
                  <input
                    type="number"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:border-indigo-500"
                    placeholder="VD: 10..."
                    value={filterMinQty}
                    onChange={(e) => {
                      setFilterMinQty(e.target.value);
                      setCurrentPage(1);
                    }}
                  />
                </div>

                {/* Khoảng giá */}
                <div className="col-span-1 md:col-span-2 lg:col-span-3">
                  <label className="text-xs font-semibold text-gray-500 mb-1 block">
                    Khoảng giá
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      className="w-1/2 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                      placeholder="Từ..."
                      value={filterMinPrice}
                      onChange={(e) => {
                        setFilterMinPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                    <input
                      type="number"
                      className="w-1/2 px-2 py-2 border border-gray-200 rounded-lg text-sm outline-none"
                      placeholder="Đến..."
                      value={filterMaxPrice}
                      onChange={(e) => {
                        setFilterMaxPrice(e.target.value);
                        setCurrentPage(1);
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* BẢNG DỮ LIỆU + PHÂN TRANG GIỐNG ProductsPage */}
            <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden flex flex-col min-h-[500px]">
              <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                <span className="font-bold text-gray-700 flex items-center gap-2">
                  <LayoutGrid size={18} /> Danh sách (
                  {products ? products.length : 0})
                </span>
                <select
                  className="text-xs border border-gray-300 rounded px-2 py-1 outline-none"
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5 / trang</option>
                  <option value={10}>10 / trang</option>
                  <option value={20}>20 / trang</option>
                </select>
              </div>

              <div className="overflow-x-auto flex-1">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 border-b border-gray-200 text-xs font-bold text-gray-500 uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 w-[350px]">Sản phẩm</th>
                      <th className="px-6 py-4">Chi tiết</th>
                      <th className="px-6 py-4 w-[150px]">Giá & Kho</th>
                      <th className="px-6 py-4 w-[120px]">Trạng thái</th>
                      <th className="px-6 py-4 text-right w-[120px]">
                        Thao tác
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-sm">
                    {loading ? (
                      <tr>
                        <td colSpan="5" className="text-center py-10">
                          Đang tải dữ liệu...
                        </td>
                      </tr>
                    ) : products && products.length > 0 ? (
                      products.map((p) => (
                        <tr
                          key={p._id || p.id}
                          className="hover:bg-indigo-50/40 transition-colors group"
                        >
                          <td className="px-6 py-4 align-top">
                            <div className="flex gap-4">
                              <div className="w-20 h-20 rounded-lg border border-gray-200 bg-white p-1 shrink-0 overflow-hidden">
                                <img
                                  src={
                                    p.url
                                      ? BASE_IMG_URL + p.url
                                      : "https://via.placeholder.com/150?text=No+Img"
                                  }
                                  alt={p.name}
                                  className="w-full h-full object-contain"
                                  onError={(e) => {
                                    e.target.src =
                                      "https://via.placeholder.com/150?text=Error";
                                  }}
                                />
                              </div>
                              <div className="flex flex-col justify-start pt-1">
                                <p className="font-bold text-gray-800 text-base line-clamp-2 mb-1 group-hover:text-indigo-600 transition-colors">
                                  {p.name}
                                </p>
                                <span className="text-xs text-gray-400 font-mono">
                                  ID: {p.id || p._id}
                                </span>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="flex flex-wrap gap-2 mb-2">
                              <span className="text-[11px] bg-blue-50 text-blue-700 border border-blue-100 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                                <Tag size={12} /> {p.brand || "-"}
                              </span>
                              <span className="text-[11px] bg-gray-100 text-gray-600 border border-gray-200 px-2 py-0.5 rounded flex items-center gap-1 font-medium">
                                <Factory size={12} /> {p.manufacture || "-"}
                              </span>
                            </div>
                            <p className="text-gray-500 text-xs line-clamp-2">
                              {p.description}
                            </p>
                          </td>
                          <td className="px-6 py-4 align-top">
                            <div className="font-bold text-indigo-700 text-base">
                              {formatCurrency(p.price)} ₫
                            </div>
                            {p.priceFake > 0 && (
                              <div className="text-xs text-gray-400 line-through">
                                {formatCurrency(p.priceFake)} ₫
                              </div>
                            )}
                            <div className="text-xs text-gray-600 mt-2">
                              Kho: <b>{p.quantity}</b> {p.unit}
                            </div>
                            <div className="text-xs text-orange-600 mt-1">
                              Đã bán: <b>{p.sold || 0}</b>
                            </div>
                          </td>
                          <td className="px-6 py-4 align-top pt-5">
                            {getStatusBadge(p.productStatus)}
                          </td>
                          <td className="px-6 py-4 text-right align-top pt-5">
                            <div className="flex justify-end gap-2 opacity-70 group-hover:opacity-100 transition-opacity">
                              <button
                                onClick={() => {
                                  startEdit(p);
                                  window.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                  });
                                }}
                                className="p-2 border border-indigo-200 rounded-lg text-indigo-600 hover:bg-indigo-50 transition-all"
                              >
                                <Edit size={16} />
                              </button>
                              <button
                                onClick={() => handleDelete(p._id || p.id)}
                                className="p-2 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-all"
                              >
                                <Trash2 size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="5"
                          className="text-center py-16 text-gray-400"
                        >
                          <Package
                            size={48}
                            className="mx-auto mb-3 opacity-20"
                          />
                          <p>Chưa có dữ liệu hiển thị</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PHÂN TRANG MỚI */}
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages || 1}
                onPageChange={setCurrentPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsAdmin;
