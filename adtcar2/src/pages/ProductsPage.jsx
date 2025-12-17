import React, { useEffect, useMemo, useState } from "react";
import { useProductsStore } from "../store/products.store";

import ProductCard from "../components/ProductCard"; 

const PAGE_SIZE = 6;
const STATUS_FIELD = "productStatus";


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
                buttons.push(1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
            } else {
                buttons.push(1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages);
            }
        }

        return buttons.map((btn, index) => {
            if (btn === "...") {
                return <span key={`dots-${index}`} className="w-10 h-10 flex items-center justify-center text-gray-400">...</span>;
            }
            return (
                <button
                    key={index}
                    onClick={() => handlePageChange(btn)}
                    className={`w-10 h-10 flex items-center justify-center rounded-md border text-sm font-bold transition-colors ${
                        currentPage === btn ? "bg-indigo-600 text-white border-indigo-600" : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                >
                    {btn}
                </button>
            );
        });
    };

    if (totalPages <= 1) return null;

    return (
        <div className="mt-auto py-6 flex justify-center border-t border-gray-200">
            <nav className="flex items-center gap-2">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-4 h-10 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 bg-white"
                >
                    Trước
                </button>
                <div className="flex gap-1">{renderPageNumbers()}</div>
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-4 h-10 border rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium text-gray-700 bg-white"
                >
                    Sau
                </button>
            </nav>
        </div>
    );
};


const ProductsPage = () => {
    const products = useProductsStore((s) => s.products);
    const loading = useProductsStore((s) => s.loading);
    const totalPages = useProductsStore((s) => s.totalPages);
    const currentPage = useProductsStore((s) => s.currentPage);
    const setCurrentPage = useProductsStore((s) => s.setCurrentPage);
    const fetchProducts = useProductsStore((s) => s.fetchProducts);

  
    const [filters, setFilters] = useState({
        name: "",
        brand: "",
        manufacture: "",
        productStatus: "",
        minPrice: "",
        maxPrice: "",
    });

    const [sortBy, setSortBy] = useState("sold");
    const [sortOrder, setSortOrder] = useState("desc");
    const debouncedFilters = useDebounce(filters, 400);

 
    const apiParams = useMemo(() => {
        const sortField = sortBy || "sold";
        const sortParam = sortOrder === "desc" ? `-${sortField}` : sortField;
        const pageParam = Math.max(currentPage - 1, 0);

        const params = { page: pageParam, size: PAGE_SIZE, sort: sortParam };
        const filtersArr = [];

        if (debouncedFilters.name) filtersArr.push(`name~'${debouncedFilters.name}'`);
        if (debouncedFilters.brand) filtersArr.push(`brand~'${debouncedFilters.brand}'`);
        if (debouncedFilters.manufacture) filtersArr.push(`manufacture~'${debouncedFilters.manufacture}'`);
        if (debouncedFilters.productStatus) filtersArr.push(`${STATUS_FIELD}~'${debouncedFilters.productStatus}'`);
        if (debouncedFilters.minPrice) filtersArr.push(`price>=${Number(debouncedFilters.minPrice)}`);
        if (debouncedFilters.maxPrice) filtersArr.push(`price<=${Number(debouncedFilters.maxPrice)}`);

        if (filtersArr.length > 0) params.filter = filtersArr.join(" and ");
        return params;
    }, [currentPage, sortBy, sortOrder, debouncedFilters]);

    useEffect(() => {
        fetchProducts(apiParams);
    }, [apiParams]); 

    const onFilterChange = (field, value) => {
        setFilters((prev) => ({ ...prev, [field]: value }));
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setFilters({
            name: "",
            brand: "",
            manufacture: "",
            productStatus: "",
            minPrice: "",
            maxPrice: "",
        });
        setCurrentPage(1);
        setSortBy("sold");
        setSortOrder("desc");
    };

    return (
        <div className="min-h-screen bg-gray-50 text-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                   
                    <div className="lg:w-1/4">
                        <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24 border border-gray-200">
                            <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Bộ lọc</h3>

                           
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm</label>
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm..."
                                    value={filters.name}
                                    onChange={(e) => onFilterChange("name", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                                <input
                                    type="text"
                                    placeholder="VD: Honda..."
                                    value={filters.brand}
                                    onChange={(e) => onFilterChange("brand", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Xuất xứ</label>
                                <input
                                    type="text"
                                    placeholder="VD: Japan..."
                                    value={filters.manufacture}
                                    onChange={(e) => onFilterChange("manufacture", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                />
                            </div>

                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Trạng thái</label>
                                <select
                                    value={filters.productStatus}
                                    onChange={(e) => onFilterChange("productStatus", e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    <option value="">Tất cả</option>
                                    <option value="AVAILABLE">Có sẵn</option>
                                    <option value="COMING_SOON">Sắp về</option>
                                    <option value="OUT_OF_STOCK">Hết hàng</option>
                                </select>
                            </div>

         
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Khoảng giá</label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) => onFilterChange("minPrice", e.target.value)}
                                        className="w-1/2 px-2 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) => onFilterChange("maxPrice", e.target.value)}
                                        className="w-1/2 px-2 py-2 border border-gray-300 rounded-md text-sm"
                                    />
                                </div>
                            </div>

          
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Sắp xếp</label>
                                <select
                                    value={`${sortBy}-${sortOrder}`}
                                    onChange={(e) => {
                                        const [f, o] = e.target.value.split("-");
                                        setSortBy(f);
                                        setSortOrder(o);
                                        setCurrentPage(1);
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                                >
                                    <option value="sold-desc">Bán chạy nhất</option>
                                    <option value="sold-asc">Bán ít nhất</option>
                                    <option value="createdAt-desc">Mới nhất</option>
                                    <option value="price-asc">Giá: Thấp - Cao</option>
                                    <option value="price-desc">Giá: Cao - Thấp</option>
                                </select>
                            </div>

                            <button
                                onClick={clearFilters}
                                className="w-full border border-red-500 text-red-500 py-2 rounded-md hover:bg-red-50 transition"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </div>

   
                    <div className="lg:w-3/4 flex flex-col min-h-[85vh]">
                        <div className="flex justify-between items-center mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <h1 className="text-xl font-bold text-gray-800">Sản phẩm</h1>
                            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                Trang {currentPage} / {totalPages || 1}
                            </span>
                        </div>

   
                        <div className="relative flex-grow">
                            {loading && (
                                <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                                    <div className="w-8 h-8 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                                </div>
                            )}

                            {products.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    
                             
                                    {products.map((product) => (
                                        <div key={product.id || product._id} className="h-full">
                                            {/* Truyền product vào, logic thêm giỏ hàng tự chạy bên trong ProductCard */}
                                            <ProductCard product={product} />
                                        </div>
                                    ))}

                                </div>
                            ) : (
                                !loading && (
                                    <div className="flex flex-col items-center justify-center h-full py-16 border border-dashed border-gray-300 rounded-lg">
                                        <div className="text-4xl mb-2">🔍</div>
                                        <h3 className="text-lg font-medium text-gray-900">Không tìm thấy sản phẩm</h3>
                                        <button onClick={clearFilters} className="mt-2 text-indigo-600 hover:underline">
                                            Xóa bộ lọc
                                        </button>
                                    </div>
                                )
                            )}
                        </div>

                   
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={setCurrentPage}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductsPage;
