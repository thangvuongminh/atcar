import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosClient from "../store/axiosClient";
import { useAuthStore } from "../store/auth.store";
import { useForm, Controller } from "react-hook-form";
import {
  Calendar,
  Clock,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  CheckCircle,
  AlertCircle,
  LogIn,
  X,
} from "lucide-react";

const TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00"];

// ✅ đổi endpoint cho đúng backend của bạn
const RETAIL_LIST_API = "/retail/all";
const CREATE_BOOKING_API = "/user/booking";

const SchedulePage = () => {
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated());

  const [retails, setRetails] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null); // "success" | "error" | null
  const [submitMessage, setSubmitMessage] = useState("");
  const [showLoginModal, setShowLoginModal] = useState(false);

  // --- MIN/MAX ngày (hôm nay -> +30 ngày) ---
  const [dateConstraints, setDateConstraints] = useState({ min: "", max: "" });

  useEffect(() => {
    const today = new Date();
    const maxDate = new Date();
    maxDate.setDate(today.getDate() + 30);

    const formatDate = (date) => {
      const yyyy = date.getFullYear();
      const mm = String(date.getMonth() + 1).padStart(2, "0");
      const dd = String(date.getDate()).padStart(2, "0");
      return `${yyyy}-${mm}-${dd}`;
    };

    setDateConstraints({
      min: formatDate(today),
      max: formatDate(maxDate),
    });
  }, []);

  // --- React Hook Form ---
  const {
    register,
    handleSubmit,
    control,
    setValue,
    setError,
    clearErrors,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      customerName: "",
      phone: "",
      email: "",
      date: "",
      timeSlot: "",
      retailId: "",
      carBrand: "",
      note: "",
    },
    mode: "onTouched",
  });

  const selectedTimeSlot = watch("timeSlot");

  // autofill nếu login
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue("customerName", user.name || "");
      setValue("phone", user.phone || "");
      setValue("email", user.email || "");
    }
  }, [isAuthenticated, user, setValue]);

  // load retail list
  useEffect(() => {
    const fetchRetails = async () => {
      try {
        const res = await axiosClient.get(RETAIL_LIST_API);
        const dataObj = res.data ? res.data : res;
        const list = dataObj.data || [];
        setRetails(list);
      } catch (err) {
        console.error("Load retail error:", err);
        // fallback cứng
        setRetails([
          { id: 1, name: "ADT Car Hà Nội", address: "Cầu Giấy, Hà Nội" },
          { id: 2, name: "ADT Car TP.HCM", address: "Quận 7, TP.HCM" },
          { id: 3, name: "ADT Car Đà Nẵng", address: "Hải Châu, Đà Nẵng" },
        ]);
      }
    };

    fetchRetails();
  }, []);

  const onSubmit = async (data) => {
    setSubmitStatus(null);
    setSubmitMessage("");

    if (!isAuthenticated) {
      setShowLoginModal(true);
      return;
    }

    // validate date range (đề phòng user tự gõ)
    if (data.date < dateConstraints.min || data.date > dateConstraints.max) {
      setError("date", {
        type: "manual",
        message: "Ngày hẹn không hợp lệ! Chỉ được đặt trước tối đa 30 ngày.",
      });
      return;
    } else {
      clearErrors("date");
    }

    setLoading(true);

    // ✅ payload đúng BookingRequest backend
    const payload = {
      note: data.note,
      timeBooking: data.date, // yyyy-MM-dd
      startTime: data.timeSlot, // HH:mm
      retailId: Number(data.retailId),
      name: data.customerName,
      dongxe: data.carBrand,
      phone: data.phone,
    };

    try {
      const res = await axiosClient.post(CREATE_BOOKING_API, payload);
      const dataObj = res.data ? res.data : res;

      if (dataObj.statusCode === 200 || dataObj.data || res.status === 200) {
        setSubmitStatus("success");
        setSubmitMessage(
          "Đặt lịch thành công! Chúng tôi sẽ liên hệ xác nhận sớm."
        );

        // reset nhưng giữ thông tin user
        reset({
          customerName: data.customerName,
          phone: data.phone,
          email: data.email,
          date: "",
          timeSlot: "",
          retailId: "",
          carBrand: "",
          note: "",
        });
      } else {
        setSubmitStatus("error");
        setSubmitMessage(
          dataObj.message || "Đặt lịch thất bại, vui lòng thử lại."
        );
      }
    } catch (err) {
      console.error("Booking error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        "Có lỗi xảy ra, vui lòng thử lại.";

      setSubmitStatus("error");
      setSubmitMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative">
      {/* --- LOGIN MODAL --- */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setShowLoginModal(false)}
          ></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all scale-100 animate-fade-in-up">
            <button
              onClick={() => setShowLoginModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X size={24} />
            </button>
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <LogIn size={32} className="text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Yêu cầu đăng nhập
              </h3>
              <p className="text-gray-500 mb-6">
                Bạn cần đăng nhập tài khoản thành viên để thực hiện đặt lịch
                hẹn.
              </p>
              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setShowLoginModal(false)}
                  className="flex-1 py-2.5 border border-gray-300 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition"
                >
                  Để sau
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="flex-1 py-2.5 bg-indigo-600 text-white rounded-xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition"
                >
                  Đăng nhập ngay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- MAIN FORM --- */}
      <div className="max-w-6xl w-full">
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
          {/* BANNER */}
          <div className="md:w-2/5 bg-gradient-to-br from-indigo-700 to-purple-800 p-10 text-white flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 -mr-10 -mt-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>
            <div className="absolute bottom-0 left-0 -ml-10 -mb-10 w-40 h-40 rounded-full bg-white/10 blur-2xl"></div>

            <div className="relative z-10">
              <h2 className="text-4xl font-extrabold mb-6 tracking-tight">
                Đặt Lịch Hẹn
              </h2>
              <p className="text-indigo-100 text-lg mb-8 leading-relaxed">
                Trải nghiệm dịch vụ chăm sóc xe chuẩn 5 sao.
              </p>

              <div className="space-y-6">
                <div className="flex items-start gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="bg-white text-indigo-700 p-2 rounded-lg">
                    <Clock size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200 font-medium">
                      Giờ làm việc
                    </p>
                    <p className="font-bold text-lg">8:00 - 17:30</p>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-white/10 rounded-2xl backdrop-blur-sm">
                  <div className="bg-white text-indigo-700 p-2 rounded-lg">
                    <Phone size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-indigo-200 font-medium">
                      Hotline Hỗ Trợ
                    </p>
                    <p className="font-bold text-lg">1900 1234</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative z-10 mt-10">
              <p className="text-sm text-indigo-300">© 2025 ADTCar Service</p>
            </div>
          </div>

          {/* FORM */}
          <div className="md:w-3/5 p-10 lg:p-12 bg-white">
            {submitStatus === "success" && (
              <div className="mb-8 bg-green-50 border border-green-200 text-green-800 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
                <CheckCircle size={24} className="text-green-600" />
                <div>
                  <h4 className="font-bold">Đặt lịch thành công!</h4>
                  <p className="text-sm">{submitMessage}</p>
                </div>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="mb-8 bg-red-50 border border-red-200 text-red-800 px-6 py-4 rounded-2xl flex items-center gap-3 shadow-sm">
                <AlertCircle size={24} className="text-red-600" />
                <div>
                  <div className="font-bold">Có lỗi xảy ra</div>
                  <div className="text-sm">
                    {submitMessage || "Vui lòng thử lại."}
                  </div>
                </div>
              </div>
            )}

            <form
              onSubmit={handleSubmit(onSubmit)}
              noValidate
              className="space-y-6"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                Thông tin đặt lịch
                <span className="h-1 flex-1 bg-gray-100 ml-4 rounded-full"></span>
              </h3>

              {/* HỌ TÊN & SĐT */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Họ và tên <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                      size={20}
                    />
                    <input
                      {...register("customerName", {
                        required: "Vui lòng nhập họ tên",
                        minLength: { value: 2, message: "Tên quá ngắn" },
                      })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="Nhập họ tên..."
                    />
                  </div>
                  {errors.customerName && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.customerName.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Số điện thoại <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                      size={20}
                    />
                    <input
                      {...register("phone", {
                        required: "Vui lòng nhập số điện thoại",
                        pattern: {
                          value: /^[0-9]{9,11}$/,
                          message: "Số điện thoại không hợp lệ (9-11 số)",
                        },
                      })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                      placeholder="Số điện thoại..."
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.phone.message}
                    </p>
                  )}
                </div>
              </div>

              {/* EMAIL (optional UI only) */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Email (Tùy chọn)
                </label>
                <div className="relative">
                  <Mail
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                  <input
                    {...register("email")}
                    type="email"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                    placeholder="example@email.com"
                  />
                </div>
              </div>

              {/* NGÀY HẸN */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ngày hẹn <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Calendar
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                  <input
                    {...register("date", {
                      required: "Vui lòng chọn ngày hẹn",
                    })}
                    type="date"
                    min={dateConstraints.min}
                    max={dateConstraints.max}
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                </div>
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.date.message}
                  </p>
                )}
              </div>

              {/* GIỜ HẸN */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-3">
                  Giờ hẹn (Khung giờ trống){" "}
                  <span className="text-red-500">*</span>
                </label>

                <Controller
                  name="timeSlot"
                  control={control}
                  rules={{ required: "Vui lòng chọn khung giờ" }}
                  render={({ field }) => (
                    <>
                      <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => {
                              field.onChange(slot);
                              clearErrors("timeSlot");
                            }}
                            className={`
                              py-2 px-1 rounded-lg text-sm font-bold border transition-all duration-200
                              ${
                                selectedTimeSlot === slot
                                  ? "bg-indigo-600 text-white border-indigo-600 shadow-md transform scale-105"
                                  : "bg-white text-gray-600 border-gray-200 hover:border-indigo-400 hover:text-indigo-600"
                              }
                            `}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                />
                {errors.timeSlot && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.timeSlot.message}
                  </p>
                )}
              </div>

              {/* CHI NHÁNH & DÒNG XE */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Chi nhánh <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <MapPin
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                      size={20}
                    />
                    <select
                      {...register("retailId", {
                        required: "Vui lòng chọn chi nhánh",
                      })}
                      className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none appearance-none font-medium cursor-pointer"
                    >
                      <option value="">Chọn chi nhánh...</option>
                      {retails.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} {r.address ? `(${r.address})` : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                  {errors.retailId && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.retailId.message}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Dòng xe <span className="text-red-500">*</span>
                  </label>
                  <input
                    {...register("carBrand", {
                      required: "Vui lòng nhập dòng xe",
                      minLength: { value: 2, message: "Dòng xe quá ngắn" },
                    })}
                    placeholder="Ví dụ: Mazda 3, CX5..."
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
                  />
                  {errors.carBrand && (
                    <p className="mt-1 text-sm text-red-600">
                      {errors.carBrand.message}
                    </p>
                  )}
                </div>
              </div>

              {/* GHI CHÚ */}
              <div className="group">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Ghi chú / Yêu cầu đặc biệt
                </label>
                <div className="relative">
                  <FileText
                    className="absolute left-4 top-4 text-gray-400 group-focus-within:text-indigo-600 transition-colors"
                    size={20}
                  />
                  <textarea
                    {...register("note")}
                    rows="3"
                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-medium"
                    placeholder="Mô tả tình trạng xe, dịch vụ mong muốn..."
                  ></textarea>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold py-4 rounded-xl shadow-lg shadow-indigo-200 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
              >
                {loading ? "Đang xử lý..." : "Xác nhận đặt lịch hẹn"}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
