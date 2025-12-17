import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { usePostsStore } from "../store/posts.store";
import {
    Search, Calendar, User, Eye, Tag, ChevronRight, BookOpen, Clock
} from "lucide-react";

// Định nghĩa base URL cho ảnh
const IMAGE_BASE_URL = "http://localhost:8080/storage";

const PostsPage = () => {
    const {
        loading,
        posts,
        fetchPosts,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        categories,
        fetchCategories,
    } = usePostsStore();

    useEffect(() => {
        fetchCategories();
        fetchPosts("All");
    }, []);

    const handleCategoryClick = (categoryName) => {
        setSelectedCategory(categoryName);
        fetchPosts(categoryName);
    };

    const displayPosts = posts.filter((post) => 
        post.title?.toLowerCase().includes(searchTerm.toLowerCase()) || 
        post.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 pb-20 font-sans">
            {/* HERO HEADER */}
            <div className="bg-indigo-900 relative overflow-hidden h-[320px] flex items-center justify-center text-center px-4">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-overlay"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/90 to-transparent"></div>
                <div className="relative z-10 animate-fade-in-up max-w-3xl">
                    <span className="bg-indigo-500/30 text-indigo-100 px-4 py-1.5 rounded-full text-sm font-semibold backdrop-blur-md mb-6 inline-block border border-indigo-400/30 shadow-lg">
                        ADTCar Blog
                    </span>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                        Tin Tức & Kiến Thức Xe Hơi
                    </h1>
                </div>
            </div>

            {/* MAIN CONTENT AREA */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-20">
                <div className="flex flex-col lg:flex-row gap-8">
                    
                    {/* --- LEFT COLUMN: POST LIST --- */}
                    <div className="lg:w-2/3">
                        {displayPosts.length > 0 ? (
                            <div className="flex flex-col gap-8">
                                {displayPosts.map((post) => (
                                    <Link 
                                        to={`/posts/${post.id}`} 
                                        key={post.id} 
                                        className="group bg-white rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 border border-gray-100 flex flex-col md:flex-row h-full md:h-[260px]"
                                    >
                                        {/* --- ẢNH --- */}
                                        <div className="md:w-2/5 overflow-hidden relative">
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors z-10"></div>
                                            <img 
                                                src={
                                                    post.urlImg && post.urlImg.length > 0 
                                                        ? `${IMAGE_BASE_URL}/${post.urlImg[0]}` 
                                                        : "https://via.placeholder.com/400x300"
                                                } 
                                                alt={post.title} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
                                                onError={(e) => {
                                                    e.target.src = "https://via.placeholder.com/400x300?text=No+Image";
                                                }}
                                            />
                                            {/* Category Badge dạng Glassmorphism */}
                                            <div className="absolute top-4 left-4 z-20">
                                                <span className="bg-white/90 backdrop-blur-sm text-indigo-700 text-xs font-bold px-3 py-1.5 rounded-lg shadow-sm uppercase tracking-wide">
                                                    {post.categoryName}
                                                </span>
                                            </div>
                                        </div>

                                        {/* --- NỘI DUNG --- */}
                                        <div className="p-6 md:w-3/5 flex flex-col justify-center">
                                            {/* Meta Info */}
                                            <div className="flex items-center gap-4 text-xs font-medium text-gray-400 mb-3">
                                                <div className="flex items-center gap-1.5">
                                                    <Calendar size={14} className="text-indigo-500" /> 
                                                    {post.create_At}
                                                </div>
                                                <div className="flex items-center gap-1.5">
                                                    <Eye size={14} className="text-indigo-500" /> 
                                                    {post.views || 0}
                                                </div>
                                            </div>

                                            {/* Title */}
                                            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-indigo-700 transition-colors leading-snug">
                                                {post.title}
                                            </h2>

                                            {/* Description */}
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-5 leading-relaxed">
                                                {post.description}
                                            </p>

                                            {/* Author / Footer */}
                                            <div className="mt-auto flex items-center gap-3 pt-4 border-t border-gray-50">
                                                <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-xs">
                                                    {post.create_by ? post.create_by.charAt(0).toUpperCase() : "A"}
                                                </div>
                                                <span className="text-xs font-semibold text-gray-700">
                                                    {post.create_by}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-white p-16 rounded-2xl text-center shadow-sm border border-gray-100">
                                <div className="inline-block p-4 bg-indigo-50 rounded-full mb-4">
                                    <BookOpen size={48} className="text-indigo-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">Chưa có bài viết nào</h3>
                                <p className="text-gray-500 mt-2">Hãy thử tìm kiếm với từ khóa khác hoặc quay lại sau.</p>
                            </div>
                        )}
                    </div>

                    {/* --- RIGHT COLUMN: SIDEBAR --- */}
                    <div className="lg:w-1/3 space-y-8">
                        {/* Search Widget */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100 sticky top-4">
                            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                                <Search size={20} className="text-indigo-600" /> Tìm kiếm
                            </h3>
                            <div className="relative group">
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm bài viết..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all placeholder:text-gray-400 text-sm font-medium"
                                />
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
                            </div>
                        </div>

                        {/* Categories Widget */}
                        <div className="bg-white p-6 rounded-2xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07)] border border-gray-100">
                            <h3 className="font-bold text-gray-900 mb-5 flex items-center gap-2 text-lg">
                                <Tag size={20} className="text-indigo-600" /> Danh mục
                            </h3>
                            <div className="space-y-1">
                                {categories && categories.length > 0 ? categories.map((cat) => (
                                    <button
                                        key={cat.id || cat.name}
                                        onClick={() => handleCategoryClick(cat.name)}
                                        className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 group ${
                                            selectedCategory === cat.name
                                                ? "bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600 shadow-sm"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:pl-5"
                                        }`}
                                    >
                                        <span>{cat.label}</span>
                                        {selectedCategory === cat.name && <ChevronRight size={16} className="text-indigo-600" />}
                                    </button>
                                )) : (
                                    <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                                        <div className="animate-pulse w-full h-8 bg-gray-100 rounded mb-2"></div>
                                        <div className="animate-pulse w-full h-8 bg-gray-100 rounded"></div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostsPage;