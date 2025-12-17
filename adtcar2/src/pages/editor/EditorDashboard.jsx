import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    FileText,
    Clock,
    CheckCircle2,
    ArrowRight,
    Loader2,
    RefreshCw,
    Archive,
    LayoutDashboard,
    CalendarDays,
    Trash2,
    Check,
    XCircle,
    AlertTriangle,
    Image as ImageIcon,
    Search,
    Filter,
    ChevronLeft,
    ChevronRight,
    Ban
} from "lucide-react";
import axiosClient from "../../store/axiosClient";


const ConfirmDeleteModal = ({ postId, onConfirm, onCancel }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[10000]">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md transform transition-all duration-300 scale-100">
                <div className="flex items-start gap-4 mb-4">
                    <AlertTriangle className="text-red-500 w-8 h-8 flex-shrink-0" />
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa bài viết</h3>
                        <p className="text-gray-600 mt-1">Bạn có chắc chắn muốn xóa bài viết ID: <strong>{postId}</strong>?</p>
                    </div>
                </div>
                <div className="flex justify-end gap-3 mt-6">
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition-colors">Hủy</button>
                    <button onClick={() => onConfirm(postId)} className="px-4 py-2 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors flex items-center gap-1"><Trash2 size={18} /> Xác nhận Xóa</button>
                </div>
            </div>
        </div>
    );
};

const NotificationToast = ({ message, type, onClose }) => {
    const baseStyle = "fixed top-5 right-5 p-4 rounded-lg shadow-xl text-white font-semibold flex items-center gap-3 transition-transform duration-300 z-[9999]";
    let style, Icon;
    if (type === "success") { style = "bg-green-500 transform translate-x-0"; Icon = Check; }
    else if (type === "error") { style = "bg-red-500 transform translate-x-0"; Icon = XCircle; }
    else return null;
    useEffect(() => { const timer = setTimeout(onClose, 3000); return () => clearTimeout(timer); }, [onClose]);
    return (<div className={`${baseStyle} ${style}`}><Icon size={20} /><span>{message}</span></div>);
};

const BigStatCard = ({ title, value, icon: Icon, colorTheme, loading }) => {
    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl border border-gray-100 bg-white shadow-md group`}>
            <div className="flex items-center justify-between z-10 relative">
                <div>
                    <p className="text-gray-500 font-semibold mb-2 uppercase tracking-wide text-xs">{title}</p>
                    {loading ? <div className="h-10 w-16 bg-gray-100 animate-pulse rounded-lg"></div> : <h3 className={`text-4xl font-extrabold ${colorTheme.text}`}>{value}</h3>}
                </div>
                <div className={`p-4 rounded-2xl ${colorTheme.bg} ${colorTheme.text}`}><Icon size={32} strokeWidth={1.5} /></div>
            </div>
            <div className={`absolute -bottom-6 -right-6 opacity-10 group-hover:scale-110 transition-transform duration-500 rotate-12 ${colorTheme.text}`}><Icon size={120} /></div>
        </div>
    );
};

export default function EditorDashboard() {
    const navigate = useNavigate();
    
    
    const [allPosts, setAllPosts] = useState([]); 
    
   
    const [displayedPosts, setDisplayedPosts] = useState([]);
    
    const [loading, setLoading] = useState(true);
    const [isDeleting, setIsDeleting] = useState(null);
    const [notification, setNotification] = useState(null);
    const [isConfirmationOpen, setIsConfirmationOpen] = useState(null);
    const [categories, setCategories] = useState([]);

    const [filters, setFilters] = useState({ keyword: "", categoryName: "", postStatus: "", page: 0, size: 5 });
    const [totalPages, setTotalPages] = useState(0);

    
    const [stats, setStats] = useState({ pending: 0, published: 0, deny: 0, draft: 0, archived: 0 });

  
    const fetchAllData = async () => {
        setLoading(true);
        try {
          
            axiosClient.get("/category/all").then(res => res.data?.data && setCategories(res.data.data)).catch(console.error);

         
            console.log("Gọi API /get/post...");
            const res = await axiosClient.get("/get/post");
            const data = res.data?.data || [];
            
          
            const safeData = Array.isArray(data) ? data : [];
            
            console.log("Dữ liệu nhận được:", safeData);
            setAllPosts(safeData); 

          
            setStats({
                pending: safeData.filter((p) => p.postStatus === "PENDING_REVIEW").length,
                published: safeData.filter((p) => p.postStatus === "PUBLISHED").length,
                deny: safeData.filter((p) => p.postStatus === "DENY").length,
                draft: safeData.filter((p) => p.postStatus === "DRAFT").length,
                archived: safeData.filter((p) => p.postStatus === "ARCHIVED").length,
            });

        } catch (error) {
            console.error("Lỗi tải dữ liệu:", error);
            setNotification({ message: "Lỗi tải dữ liệu", type: "error" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAllData();
    }, []);

  
    useEffect(() => {
        let result = [...allPosts];

      
        if (filters.keyword) {
            result = result.filter(p => p.title?.toLowerCase().includes(filters.keyword.toLowerCase()));
        }

  
        if (filters.categoryName) {
            result = result.filter(p => p.categoryName === filters.categoryName);
        }

      
        if (filters.postStatus) {
            result = result.filter(p => p.postStatus === filters.postStatus);
        }

 
        const total = result.length;
        setTotalPages(Math.ceil(total / filters.size));

        
        const start = filters.page * filters.size;
        const end = start + filters.size;
        setDisplayedPosts(result.slice(start, end));

    }, [allPosts, filters]); 

   
    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 0 })); 
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 0 && newPage < totalPages) {
            setFilters((prev) => ({ ...prev, page: newPage }));
        }
    };

    const handleDeletePost = (postId, e) => { e.stopPropagation(); setIsConfirmationOpen(postId); };

    const confirmDeletion = async (postId) => {
        setIsConfirmationOpen(null);
        setIsDeleting(postId);
        try {
            await axiosClient.delete(`upload/delete/post/${postId}`);
            await fetchAllData(); // Load lại toàn bộ data
            setNotification({ message: `Xóa thành công!`, type: "success" });
        } catch (error) {
            setNotification({ message: `Lỗi xóa bài viết.`, type: "error" });
        } finally {
            setIsDeleting(null);
        }
    };

    const handleEditPost = (postId, e) => { e.stopPropagation(); navigate(`/editor/posts/edit/${postId}`); };
    const handleRowClick = (postId) => { if (!isConfirmationOpen) navigate(`/editor/posts/edit/${postId}`); };

    const renderStatusBadge = (status) => {
        const styles = {
            PUBLISHED: { bg: "bg-green-100", text: "text-green-700", label: "Đã Xuất Bản", border: "border-green-200" },
            PENDING_REVIEW: { bg: "bg-yellow-100", text: "text-yellow-700", label: "Chờ Duyệt", border: "border-yellow-200" },
            DENY: { bg: "bg-red-100", text: "text-red-700", label: "Từ Chối", border: "border-red-200" },
            ARCHIVED: { bg: "bg-gray-200", text: "text-gray-700", label: "Lưu Trữ", border: "border-gray-300" },
            DRAFT: { bg: "bg-blue-50", text: "text-blue-600", label: "Bản Nháp", border: "border-blue-200" },
        };
        const s = styles[status] || styles["DRAFT"];
        return <span className={`px-4 py-2 rounded-xl text-xs font-bold border ${s.bg} ${s.text} ${s.border} whitespace-nowrap`}>{s.label}</span>;
    };

    return (
        <div className="min-h-screen bg-[#F5F7FA] p-8 font-sans">
            {notification && <NotificationToast message={notification.message} type={notification.type} onClose={() => setNotification(null)} />}
            {isConfirmationOpen && <ConfirmDeleteModal postId={isConfirmationOpen} onConfirm={confirmDeletion} onCancel={() => setIsConfirmationOpen(null)} />}

            <div className="max-w-[1600px] mx-auto space-y-8">
              
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-gray-200">
                    <div>
                        <h1 className="text-4xl font-black text-gray-800 flex items-center gap-3">
                            <span className="p-3 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-600/30"><LayoutDashboard size={32} /></span>
                            Tổng Quan
                        </h1>
                        <p className="text-gray-500 text-lg mt-2 font-medium">Quản lý bài viết của bạn</p>
                    </div>
                    <button onClick={fetchAllData} className="flex items-center gap-2 px-6 py-3 bg-white text-gray-700 font-bold rounded-xl shadow-sm border border-gray-200 hover:bg-gray-50 transition-all active:scale-95" disabled={loading || isDeleting !== null}>
                        <RefreshCw size={20} className={loading ? "animate-spin" : ""} /> Làm mới
                    </button>
                </div>

             
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    <BigStatCard title="Bản Nháp" value={stats.draft} icon={FileText} loading={loading} colorTheme={{ bg: "bg-blue-50", text: "text-blue-600" }} />
                    <BigStatCard title="Chờ Duyệt" value={stats.pending} icon={Clock} loading={loading} colorTheme={{ bg: "bg-yellow-100", text: "text-yellow-600" }} />
                    <BigStatCard title="Đã Xuất Bản" value={stats.published} icon={CheckCircle2} loading={loading} colorTheme={{ bg: "bg-green-100", text: "text-green-600" }} />
                    <BigStatCard title="Bị Từ Chối" value={stats.deny} icon={Ban} loading={loading} colorTheme={{ bg: "bg-red-100", text: "text-red-600" }} />
                    <BigStatCard title="Lưu Trữ" value={stats.archived} icon={Archive} loading={loading} colorTheme={{ bg: "bg-gray-100", text: "text-gray-600" }} />
                </div>

             
                <div className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
                   
                    <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex flex-col xl:flex-row gap-4 items-center justify-between">
                        <div className="flex items-center gap-4 w-full xl:w-auto">
                            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl"><FileText size={28} /></div>
                            <h2 className="text-2xl font-bold text-gray-800">Bài Viết ({allPosts.length})</h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3 w-full xl:w-auto">
                            <div className="relative w-full md:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <input type="text" placeholder="Tìm tiêu đề..." className="pl-10 pr-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 w-full md:w-64" value={filters.keyword} onChange={(e) => handleFilterChange("keyword", e.target.value)} />
                            </div>
                            <div className="relative w-full md:w-auto">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                                <select className="pl-10 pr-8 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white appearance-none cursor-pointer w-full md:w-auto" value={filters.categoryName} onChange={(e) => handleFilterChange("categoryName", e.target.value)}>
                                    <option value="">Tất cả danh mục</option>
                                    {categories.map((c) => (<option key={c.id} value={c.name}>{c.name}</option>))}
                                </select>
                            </div>
                            <select className="px-4 py-2.5 rounded-lg border border-gray-200 outline-none focus:border-blue-500 bg-white cursor-pointer w-full md:w-auto" value={filters.postStatus} onChange={(e) => handleFilterChange("postStatus", e.target.value)}>
                                <option value="">Tất cả trạng thái</option>
                                <option value="DRAFT">Bản Nháp</option>
                                <option value="PENDING_REVIEW">Chờ Duyệt</option>
                                <option value="PUBLISHED">Đã Xuất Bản</option>
                                <option value="DENY">Bị Từ Chối</option>
                                <option value="ARCHIVED">Lưu Trữ</option>
                            </select>
                        </div>
                    </div>

                    {loading ? (
                        <div className="p-20 text-center flex flex-col items-center justify-center text-gray-400">
                            <Loader2 className="animate-spin mb-4 text-blue-500" size={48} />
                            <span className="text-lg font-medium">Đang tải dữ liệu...</span>
                        </div>
                    ) : displayedPosts.length === 0 ? (
                        <div className="p-20 text-center text-gray-400"><p className="text-xl">Không tìm thấy bài viết nào.</p></div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="bg-gray-50/80 text-gray-500 text-sm font-bold uppercase tracking-wider">
                                        <th className="px-8 py-6 rounded-tl-2xl">Bài viết</th>
                                        <th className="px-6 py-6">Danh mục</th>
                                        <th className="px-6 py-6">Trạng thái</th>
                                        <th className="px-6 py-6">Ngày tạo</th>
                                        <th className="px-8 py-6 text-center rounded-tr-2xl">Hành động</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 text-gray-700">
                                    {displayedPosts.map((p) => {
                                    
                                        const canDelete = p.postStatus === "PENDING_REVIEW";
                                        return (
                                        <tr key={p.id} onClick={() => handleRowClick(p.id)} className="group hover:bg-blue-50/50 transition-colors duration-200 cursor-pointer">
                                            <td className="px-8 py-6">
                                                <div className="flex items-center gap-6">
                                                    <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0 shadow-md border border-gray-200 bg-white">
                                                        {p.urlImg && p.urlImg.length > 0 ? (
                                                            <img src={`http://localhost:8080/storage/${p.urlImg[0]}`} alt={p.title} className="w-full h-full object-cover" onError={(e) => { e.target.onerror = null; e.target.style.display = "none"; e.target.nextSibling.style.display = "flex"; }} />
                                                        ) : null}
                                                        <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gray-50" style={{ display: p.urlImg && p.urlImg.length > 0 ? "none" : "flex" }}><ImageIcon size={24} /></div>
                                                    </div>
                                                    <div>
                                                        <p className="text-lg font-bold text-gray-800 group-hover:text-blue-700 transition-colors line-clamp-1 mb-1" title={p.title}>{p.title || "(Chưa có tiêu đề)"}</p>
                                                        <p className="text-sm text-gray-400 line-clamp-1 max-w-md">{p.description || "Không có mô tả"}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-6"><span className="inline-block px-3 py-1 bg-gray-100 text-gray-600 rounded-lg font-medium text-sm border border-gray-200">{p.categoryName || "—"}</span></td>
                                            <td className="px-6 py-6">{renderStatusBadge(p.postStatus)}</td>
                                            <td className="px-6 py-6">
                                                <div className="flex items-center gap-2 text-gray-500 font-medium"><CalendarDays size={18} className="text-gray-400" />{(p.create_At || p.createAt || "").split(" ")[0]}</div>
                                            </td>
                                            <td className="px-8 py-6 text-center">
                                                <div className="flex items-center justify-center space-x-3">
                                                    <button onClick={(e) => handleEditPost(p.id, e)} className="p-2 rounded-full text-indigo-600 hover:bg-indigo-50/70 transition-colors border border-indigo-100 shadow-sm" title="Sửa"><ArrowRight size={20} /></button>
                                                    <button 
                                                        onClick={(e) => handleDeletePost(p.id, e)} 
                                                        className={`p-2 rounded-full transition-colors border shadow-sm ${canDelete ? "text-red-600 hover:bg-red-50/70 border-red-100" : "text-gray-300 border-gray-100 cursor-not-allowed"}`} 
                                                        disabled={!canDelete || isDeleting === p.id} 
                                                        title={canDelete ? "Xóa" : "Chỉ xóa được bài Chờ Duyệt"}
                                                    >
                                                        {isDeleting === p.id ? <Loader2 size={20} className="animate-spin" /> : <Trash2 size={20} />}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )})}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {displayedPosts.length > 0 && (
                        <div className="p-6 border-t border-gray-100 flex items-center justify-between bg-gray-50">
                            <span className="text-sm text-gray-500 font-medium">Trang <span className="font-bold text-gray-800">{filters.page + 1}</span> / <span className="font-bold text-gray-800">{totalPages || 1}</span></span>
                            <div className="flex gap-2">
                                <button onClick={() => handlePageChange(filters.page - 1)} disabled={filters.page === 0} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronLeft size={20} /></button>
                                <button onClick={() => handlePageChange(filters.page + 1)} disabled={filters.page >= totalPages - 1} className="p-2 rounded-lg border border-gray-300 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronRight size={20} /></button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
