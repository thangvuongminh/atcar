import React, { useEffect, useState } from "react";
import { useAdminPostApprovalsStore } from "../../store/admin.postsApproval.store";
import { X, Eye, Trash2, CheckCircle, XCircle, Clock, Archive, ImageOff } from "lucide-react"; 


const IMAGE_BASE_URL = "http://localhost:8080/storage";

export default function PostApprovalsAdmin() {
  const {
    posts,
    page, setPage, totalPages, totalElements,
    statusFilter, setStatusFilter,
    q, setQ, performSearch,
    changeStatus, 
    deletePost,   
    loading,
    toast, toastType
  } = useAdminPostApprovalsStore();

  const [selectedPost, setSelectedPost] = useState(null);

  useEffect(() => {
    const timeOutId = setTimeout(() => performSearch(), 500);
    return () => clearTimeout(timeOutId);
  }, [q, performSearch]);

  const getStatusColor = (status) => {
      switch(status) {
          case 'PUBLISHED': return 'bg-green-100 text-green-700 border-green-200';
          case 'DENY': return 'bg-red-100 text-red-700 border-red-200';
          case 'PENDING_REVIEW': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'ARCHIVED': return 'bg-gray-100 text-gray-600 border-gray-200';
          default: return 'bg-white text-gray-600 border-gray-200';
      }
  }

 
  const getImageUrl = (post) => {
   
    if (!post || !post.urlImg || post.urlImg.length === 0) return null;

    const fileName = post.urlImg[0];

  
    if (fileName.includes('/')) {
        return `${IMAGE_BASE_URL}/${fileName}`;
    }

  
    const folder = post.type ? post.type.toLowerCase() : 'other'; 
    return `${IMAGE_BASE_URL}/${folder}/${fileName}`;
  };

  return (
    <div className="p-6 bg-slate-50 min-h-screen font-sans relative">
      
      {toast && (
        <div className={`fixed top-5 right-5 z-[9999] px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3 animate-bounce ${
            toastType === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-600 text-white'
        }`}>
            <span className="text-xl font-bold">{toastType === 'error' ? '!' : '✓'}</span>
            <div>{toast}</div>
        </div>
      )}

   
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Quản lý bài viết</h1>
        <div className="relative w-full md:w-auto">
            <input 
                className="border p-2 pl-4 pr-10 rounded-lg shadow-sm w-full md:w-72 focus:ring-2 focus:ring-indigo-500 outline-none" 
                placeholder="Tìm tiêu đề, tác giả..." 
                value={q} 
                onChange={e => setQ(e.target.value)} 
            />
            {loading && <div className="absolute right-3 top-1/2 -translate-y-1/2 animate-spin h-4 w-4 border-b-2 border-indigo-500 rounded-full"></div>}
        </div>
      </div>


      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
        {["ALL", "PENDING_REVIEW", "PUBLISHED", "DENY", "ARCHIVED"].map(st => (
            <button 
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-4 py-2 rounded-full border text-xs font-bold whitespace-nowrap transition-all ${
                    statusFilter === st 
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-lg scale-105' 
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-100'
                }`}
            >
                {st === "ALL" ? "TẤT CẢ" : st}
            </button>
        ))}
      </div>

 
      {loading && posts.length === 0 ? (
        <div className="py-20 text-center text-slate-400">Đang tải dữ liệu...</div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50 flex justify-between items-center">
            <span className="font-semibold text-gray-600 text-sm">Kết quả</span>
            <span className="text-xs font-bold bg-gray-200 px-2 py-1 rounded text-gray-600">{totalElements} bài</span>
          </div>

          <div className="divide-y divide-gray-100">
            {posts.length === 0 ? (
                <div className="p-10 text-center text-gray-400">Không tìm thấy bài viết nào.</div>
            ) : (
                posts.map(p => {
           
                    const imageUrl = getImageUrl(p);

                    return (
                    <div key={p.id} className="p-5 flex flex-col md:flex-row gap-6 hover:bg-slate-50 transition-colors group">
         
                        <div className="w-full md:w-48 h-32 bg-gray-100 rounded-lg overflow-hidden shrink-0 border relative shadow-sm flex items-center justify-center">
                            {imageUrl ? (
                                <img 
                                    src={imageUrl} 
                                    alt={p.title}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = "https://via.placeholder.com/300x200?text=Error+Loading";
                               
                                    }}
                                />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <ImageOff size={24} />
                                    <span className="text-[10px] mt-1">No Image</span>
                                </div>
                            )}
                            
                            <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md text-white text-[10px] px-2 py-1 rounded font-mono">
                                ID: {p.id}
                            </div>
                        </div>

                 
                        <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2">
                                <span className={`px-2 py-1 text-[10px] font-extrabold border rounded uppercase ${getStatusColor(p.postStatus)}`}>
                                    {p.postStatus}
                                </span>
                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded border border-indigo-100">{p.categoryName}</span>
                         
                                {p.type && <span className="text-[10px] text-gray-400 border border-gray-200 px-1 rounded bg-gray-50">{p.type}</span>}
                            </div>
                            <h3 className="font-bold text-lg text-slate-800 mb-1 line-clamp-1 cursor-pointer hover:text-indigo-600 transition" onClick={() => setSelectedPost(p)}>
                                {p.title}
                            </h3>
                            <p className="text-sm text-slate-500 line-clamp-2 mb-3">{p.description}</p>
                            <div className="flex items-center gap-4 text-xs text-slate-400 font-medium">
                                <span>✍️ {p.create_by}</span>
                                <span>🕒 {p.create_At}</span>
                            </div>
                        </div>

                  
                        <div className="flex flex-col gap-2 w-full md:w-44 shrink-0 border-t md:border-t-0 md:border-l border-gray-100 md:pl-6 pt-4 md:pt-0">
                            <span className="text-[10px] font-bold text-gray-300 uppercase text-center hidden md:block mb-1">Thao tác</span>
                            
                            {p.postStatus !== "PUBLISHED" && (
                                <button onClick={() => changeStatus(p.id, "PUBLISHED")} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white text-xs py-2 rounded shadow-sm font-semibold transition flex items-center justify-center gap-1">
                                    <CheckCircle size={14} /> Xuất bản
                                </button>
                            )}
                            {p.postStatus !== "PENDING_REVIEW" && (
                                <button onClick={() => changeStatus(p.id, "PENDING_REVIEW")} className="w-full bg-amber-100 hover:bg-amber-200 text-amber-700 text-xs py-2 rounded font-semibold transition flex items-center justify-center gap-1">
                                    <Clock size={14} /> Chờ duyệt
                                </button>
                            )}
                            {p.postStatus !== "DENY" && (
                                <button onClick={() => changeStatus(p.id, "DENY")} className="w-full bg-white border border-rose-200 text-rose-500 hover:bg-rose-50 text-xs py-2 rounded font-semibold transition flex items-center justify-center gap-1">
                                    <XCircle size={14} /> Từ chối
                                </button>
                            )}
                            {p.postStatus !== "ARCHIVED" && (
                                <button onClick={() => changeStatus(p.id, "ARCHIVED")} className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs py-2 rounded font-semibold transition flex items-center justify-center gap-1">
                                    <Archive size={14} /> Lưu trữ
                                </button>
                            )}

                            <div className="flex gap-2 mt-1">
                                <button onClick={() => setSelectedPost(p)} className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs py-2 rounded font-semibold transition flex items-center justify-center gap-1" title="Xem chi tiết">
                                    <Eye size={14} />
                                </button>
                                <button 
                                    onClick={() => { if(window.confirm("Xóa vĩnh viễn bài này?")) deletePost(p.id) }} 
                                    className="flex-1 bg-red-100 hover:bg-red-200 text-red-600 text-xs py-2 rounded font-semibold transition flex items-center justify-center gap-1"
                                    title="Xóa vĩnh viễn"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    </div>
                    )
                })
            )}
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className="flex justify-center items-center gap-4 mt-8">
            <button disabled={page === 0} onClick={() => setPage(page - 1)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">&larr; Trước</button>
            <span className="text-sm font-medium text-gray-600 bg-white px-4 py-2 rounded-lg border border-gray-200 shadow-sm">Trang {page + 1} / {totalPages}</span>
            <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)} className="px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm">Sau &rarr;</button>
        </div>
      )}

      {selectedPost && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
            <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden animate-scale-up max-h-[90vh] flex flex-col">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50 shrink-0">
                    <h3 className="font-bold text-lg text-slate-800">Chi tiết bài viết #{selectedPost.id}</h3>
                    <button onClick={() => setSelectedPost(null)} className="p-2 hover:bg-gray-200 rounded-full transition"><X size={20} className="text-gray-500" /></button>
                </div>
                
                <div className="p-6 overflow-y-auto">
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">{selectedPost.title}</h2>
                    {/* Ảnh trong Modal cũng dùng getImageUrl */}
                    {getImageUrl(selectedPost) ? (
                        <img 
                            src={getImageUrl(selectedPost)} 
                            alt={selectedPost.title}
                            className="w-full max-h-80 object-cover rounded-xl mb-6 shadow-md"
                            onError={(e) => { e.target.onerror = null; e.target.src = "https://via.placeholder.com/600x400?text=Image+Error"; }}
                        />
                    ) : (
                         <div className="w-full h-40 bg-gray-100 rounded-xl mb-6 flex items-center justify-center text-gray-400">Không có ảnh</div>
                    )}
                    <div className="prose max-w-none text-slate-600 whitespace-pre-wrap leading-relaxed">{selectedPost.description}</div>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-2 shrink-0">
                    <button onClick={() => setSelectedPost(null)} className="px-6 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-100 transition">Đóng</button>
                    {selectedPost.postStatus !== "PUBLISHED" && (
                        <button onClick={() => { changeStatus(selectedPost.id, "PUBLISHED"); setSelectedPost(null); }} className="px-6 py-2 bg-emerald-600 text-white rounded-lg text-sm font-medium hover:bg-emerald-700 transition">Duyệt ngay</button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
}
