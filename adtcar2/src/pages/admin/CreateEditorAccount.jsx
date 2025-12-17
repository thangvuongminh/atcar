import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useAdminCreateEditorStore } from "../../store/admin.createEditor.store";
import { Toaster } from "react-hot-toast";
import {
  User,
  Mail,
  Phone,
  Lock,
  MapPin,
  UserPlus,
  Trash2,
  ShieldAlert,
  Users,
  Sparkles,
  AlertCircle,
  RotateCcw,
  AlertTriangle,
  X,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

export default function CreateEditorAccount() {
  const {
    createEditor,
    users,
    init,
    fetchEditors,
    removeEditor,
    canManageEditors,
    loading,
    page,
    totalPages,
    setPage,
    filters,
    setFilter, 
  } = useAdminCreateEditorStore();

  
  const [searchTerm, setSearchTerm] = useState("");


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      password: "",
      address: "",
    },
    mode: "onBlur",
  });

  useEffect(() => {
    init();
  }, [init]);

 
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== filters.name) {
        setFilter("name", searchTerm);
        fetchEditors();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const onSubmit = async (data) => {
    const success = await createEditor(data);
    if (success) reset();
  };


  const renderPaginationButtons = () => {
    if (totalPages <= 1) return null;
    let buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
            page === i
              ? "bg-blue-600 text-white shadow-md shadow-blue-200"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };
  const confirmDelete = async () => {
    if (userToDelete) {
      await removeEditor(userToDelete.email);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
    }
  };

  if (!canManageEditors && typeof canManageEditors !== "function") {

  }

  const inputFields = [
    {
      label: "Họ và tên",
      icon: User,
      name: "name",
      type: "text",
      placeholder: "Nhập tên...",
      validation: { required: "Tên bắt buộc" },
    },
    {
      label: "Email",
      icon: Mail,
      name: "email",
      type: "text",
      placeholder: "abc@gmail.com",
      validation: {
        required: "Email bắt buộc",
        pattern: {
          value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/,
          message: "Email sai",
        },
      },
    },
    {
      label: "SĐT",
      icon: Phone,
      name: "phone",
      type: "text",
      placeholder: "09xxx",
      validation: {
        required: "SĐT bắt buộc",
        pattern: {
          value: /^(0[3|5|7|8|9])[0-9]{8}$/,
          message: "SĐT sai (10 số)",
        },
      },
    },
    {
      label: "Địa chỉ",
      icon: MapPin,
      name: "address",
      type: "text",
      placeholder: "Đà Nẵng...",
      validation: {},
    },
    {
      label: "Mật khẩu",
      icon: Lock,
      name: "password",
      type: "password",
      placeholder: "•••",
      validation: {
        required: "MK bắt buộc",
        minLength: { value: 6, message: "Min 6 ký tự" },
      },
    },
  ];

  return (
    <div className="relative min-h-screen flex justify-center items-start p-6 bg-slate-50 overflow-hidden font-sans">
      <Toaster position="top-right" />

     
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob"></div>
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-purple-400/20 rounded-full blur-[100px] mix-blend-multiply animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 bg-white/90 backdrop-blur-xl w-full max-w-7xl rounded-[2rem] shadow-2xl border border-white/50 overflow-hidden flex flex-col lg:flex-row h-[85vh]">
      
        <div className="w-full lg:w-4/12 p-8 flex flex-col border-r border-gray-100 overflow-y-auto custom-scrollbar">
          <div className="mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-bold uppercase mb-3">
              <Sparkles size={12} /> Admin Panel
            </div>
            <h2 className="text-3xl font-extrabold text-gray-800">
              Tạo Editor
            </h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {inputFields.map((item) => (
              <div key={item.name}>
                <label className="text-xs font-bold text-gray-500 uppercase ml-1 mb-1 block">
                  {item.label}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <item.icon className="h-4 w-4 text-gray-400" />
                  </div>
                  <input
                    type={item.type}
                    placeholder={item.placeholder}
                    {...register(item.name, item.validation)}
                    className={`block w-full pl-10 pr-3 py-2.5 bg-gray-50 border rounded-lg text-sm focus:bg-white outline-none transition-all ${
                      errors[item.name]
                        ? "border-red-300"
                        : "border-gray-200 focus:border-blue-500"
                    }`}
                  />
                </div>
                {errors[item.name] && (
                  <span className="text-xs text-red-500 mt-1 flex items-center gap-1">
                    <AlertCircle size={10} /> {errors[item.name].message}
                  </span>
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => reset()}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm flex justify-center items-center gap-2"
              >
                <RotateCcw size={16} /> Reset
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-[2] py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold rounded-lg text-sm shadow-md flex justify-center items-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <UserPlus size={16} /> Tạo tài khoản
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

     
        <div className="w-full lg:w-8/12 bg-gray-50/30 flex flex-col">
        
          <div className="p-6 border-b border-gray-200 bg-white space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                Danh sách{" "}
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">
                  {users.length}
                </span>
              </h3>
         
              <div className="relative w-64">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên..."
                  className="w-full pl-9 pr-4 py-2 bg-gray-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-200 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
        
            <div className="grid grid-cols-3 gap-3">
              <input
                type="text"
                placeholder="Lọc Email..."
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                value={filters.email}
                onChange={(e) => {
                  setFilter("email", e.target.value);
                  fetchEditors();
                }}
              />
              <input
                type="text"
                placeholder="Lọc SĐT..."
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                value={filters.phone}
                onChange={(e) => {
                  setFilter("phone", e.target.value);
                  fetchEditors();
                }}
              />
              <input
                type="text"
                placeholder="Lọc Địa chỉ..."
                className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-blue-500 outline-none"
                value={filters.address}
                onChange={(e) => {
                  setFilter("address", e.target.value);
                  fetchEditors();
                }}
              />
            </div>
          </div>

     
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            {users.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-200 rounded-xl">
                <Users size={48} className="mb-2 opacity-20" />
                <p className="text-sm">Không tìm thấy dữ liệu.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {users.map((u, index) => (
                  <div
                    key={u.id || index}
                    className="group bg-white p-4 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-md">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800 text-sm">
                          {u.name}
                        </h4>
                        <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-xs text-gray-500">
                          <span className="flex items-center gap-1">
                            <Mail size={10} /> {u.email}
                          </span>
                          <span className="flex items-center gap-1">
                            <Phone size={10} /> {u.phone}
                          </span>
                          <span className="flex items-center gap-1">
                            <MapPin size={10} /> {u.address}
                          </span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteClick(u)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

    
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200 bg-white flex justify-between items-center">
              <span className="text-xs text-gray-500">
                Trang <b>{page + 1}</b> / <b>{totalPages}</b>
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(page - 1)}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronLeft size={16} />
                </button>
                <div className="flex gap-1">{renderPaginationButtons()}</div>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(page + 1)}
                  className="p-2 rounded-lg border hover:bg-gray-50 disabled:opacity-50"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

    
      {isDeleteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 animate-in zoom-in-95">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                <Trash2 size={24} />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Xóa tài khoản?
              </h3>
              <p className="text-gray-500 text-sm mt-1 mb-6">
                Bạn có chắc muốn xóa <b>{userToDelete?.name}</b>?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold rounded-lg text-sm"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 py-2 bg-red-500 hover:bg-red-600 text-white font-bold rounded-lg text-sm shadow-md"
                >
                  Xóa ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}


      <style>{`.custom-scrollbar::-webkit-scrollbar{width:4px}.custom-scrollbar::-webkit-scrollbar-thumb{background:#e2e8f0;border-radius:10px}.animate-blob{animation:blob 7s infinite}@keyframes blob{0%{transform:translate(0px,0px) scale(1)}33%{transform:translate(30px,-50px) scale(1.1)}66%{transform:translate(-20px,20px) scale(0.9)}100%{transform:translate(0px,0px) scale(1)}}`}</style>
    </div>
  );
}
