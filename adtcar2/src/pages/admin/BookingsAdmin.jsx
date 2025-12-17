import React, { useEffect, useMemo, useState } from "react";
import axiosClient from "../../store/axiosClient";
import {
  Search,
  Filter,
  X,
  Calendar,
  MapPin,
  Clock,
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  CheckCircle2,
  XCircle,
} from "lucide-react";

// ====== CONFIG (turkraft spring-filter) ======
const API_BOOKINGS_FILTER = "/admin/bookings/filter";
const API_RETAILS = "/retail/all";
const API_UPDATE_STATUS = (id) => `/admin/bookings/${id}/status`;

// ====== helpers ======
const TIME_SLOTS = ["08:00", "10:00", "12:00", "14:00", "16:00"];

const STATUS_OPTIONS = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "PENDING", label: "Chờ duyệt" },
  { value: "AWAITING_PAYMENT", label: "Chờ thanh toán" },
  { value: "CONFIRMED", label: "Đã xác nhận" },
  { value: "PAID", label: "Đã thanh toán" },
];

const formatDate = (iso) => {
  if (!iso) return "";
  return String(iso).split("-").reverse().join("/");
};

const classNames = (...arr) => arr.filter(Boolean).join(" ");

// escape cho filter string (phòng dấu ')
const escapeFilterText = (s) => String(s).replace(/'/g, "\\'");

// Build filter turkraft từ UI
// AND: ;
// OR: |
const buildFilter = ({ q, status, retailId, date, timeSlot }) => {
  const parts = [];

  // Turkraft dùng dấu hai chấm (:) cho so sánh bằng
  if (status) parts.push(`status:'${status}'`);
  if (retailId) parts.push(`retail.id:${Number(retailId)}`);

  // Lưu ý format ngày tháng phải khớp với Backend (thường là yyyy-MM-dd)
  if (date) parts.push(`timeBooking:'${date}'`);
  if (timeSlot) parts.push(`startTime:'${timeSlot}'`);

  if (q && q.trim()) {
    const t = q.replace(/'/g, "\\'");
    // Turkraft:
    // ~~ là toán tử LIKE (hoặc Contains tùy config)
    // 'or' dùng chữ thường thay vì dấu |
    parts.push(`(name~~'*${t}*' or phone~~'*${t}*')`);
  }

  // Turkraft nối các điều kiện bằng từ khóa ' and ' (có khoảng trắng)
  return parts.join(" and ");
};

const Badge = ({ status }) => {
  const map = {
    PENDING: "bg-yellow-50 text-yellow-700 border-yellow-200",
    AWAITING_PAYMENT: "bg-orange-50 text-orange-700 border-orange-200",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200",
    PAID: "bg-green-50 text-green-700 border-green-200",
  };
  const label =
    STATUS_OPTIONS.find((s) => s.value === status)?.label || status || "—";

  return (
    <span
      className={classNames(
        "px-2.5 py-1 rounded-full text-xs font-bold border",
        map[status] || "bg-gray-50 text-gray-700 border-gray-200"
      )}
    >
      {label}
    </span>
  );
};

const EmptyState = () => (
  <div className="w-full flex flex-col items-center justify-center py-16">
    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
      <Calendar className="text-gray-400" />
    </div>
    <div className="mt-4 text-gray-600 font-medium">
      Không tìm thấy yêu cầu nào.
    </div>
  </div>
);

export default function AdminBookingsPage() {
  // ====== DATA ======
  const [retails, setRetails] = useState([]);
  const [rows, setRows] = useState([]);

  // ====== UI STATE ======
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  // ====== FILTER STATE ======
  const [q, setQ] = useState("");
  const [status, setStatus] = useState("PENDING");
  const [retailId, setRetailId] = useState("");
  const [date, setDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");

  // ====== PAGINATION ======
  // turkraft @Page dùng Pageable của Spring => page là 0-based
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [total, setTotal] = useState(0);

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(total / size)),
    [total, size]
  );

  const filtersActive = useMemo(() => {
    return Boolean(q || status !== "" || retailId || date || timeSlot);
  }, [q, status, retailId, date, timeSlot]);

  // ====== load retails ======
  useEffect(() => {
    const fetchRetails = async () => {
      try {
        const res = await axiosClient.get(API_RETAILS);
        const dataObj = res.data ? res.data : res;
        setRetails(dataObj.data || []);
      } catch (e) {
        setRetails([
          { id: 1, name: "ADT Car Hà Nội", address: "Cầu Giấy, Hà Nội" },
          { id: 2, name: "ADT Car TP.HCM", address: "Quận 7, TP.HCM" },
          { id: 3, name: "ADT Car Đà Nẵng", address: "Hải Châu, Đà Nẵng" },
        ]);
      }
    };
    fetchRetails();
  }, []);

  // ====== fetch bookings (turkraft) ======
  const fetchBookings = async () => {
    setLoading(true);
    setErr("");
    try {
      const filter = buildFilter({ q, status, retailId, date, timeSlot });

      const params = {
        filter: filter || undefined,
        page,
        size,
        // sort nếu backend mày có support Pageable sort thì thêm:
        // sort: "timeBooking,desc"
      };

      const res = await axiosClient.get(API_BOOKINGS_FILTER, { params });
      const dataObj = res.data ? res.data : res;

      // controller trả ApiResponse<Page<BookingResponse>>
      const pageData = dataObj.data;

      if (pageData?.content) {
        setRows(pageData.content || []);
        setTotal(pageData.totalElements || 0);
      } else {
        setRows([]);
        setTotal(0);
      }
    } catch (e) {
      console.error(e);
      setErr("Không thể tải danh sách booking. Kiểm tra lại API/Token.");
      setRows([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  // auto fetch khi filter đổi
  useEffect(() => {
    fetchBookings();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, size, status, retailId, date, timeSlot]);

  // search debounce
  useEffect(() => {
    const t = setTimeout(() => {
      setPage(0);
      fetchBookings();
    }, 350);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [q]);

  const resetFilters = () => {
    setQ("");
    setStatus("PENDING");
    setRetailId("");
    setDate("");
    setTimeSlot("");
    setPage(0);
  };

  // ✅ backend tao đưa: @RequestParam BookingStatus status
  const updateStatus = async (id, nextStatus) => {
    try {
      await axiosClient.patch(API_UPDATE_STATUS(id), null, {
        params: { status: nextStatus },
      });
      await fetchBookings();
    } catch (e) {
      console.error(e);
      setErr("Cập nhật trạng thái thất bại.");
    }
  };

  const goPrev = () => setPage((p) => Math.max(0, p - 1));
  const goNext = () => setPage((p) => Math.min(totalPages - 1, p + 1));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="px-6 py-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-extrabold text-gray-900">
              Quản lý Lịch hẹn
            </h1>
            <p className="text-gray-500 mt-1">
              Duyệt và sắp xếp lịch hẹn dịch vụ
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
            <div className="relative">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Tìm tên, SĐT..."
                className="w-full sm:w-72 pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              onClick={fetchBookings}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 font-semibold"
            >
              <RefreshCcw size={18} />
              Tải lại
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm p-4">
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <div className="flex items-center gap-2 text-gray-700 font-bold">
              <Filter size={18} />
              Bộ lọc
            </div>

            {filtersActive && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 text-sm font-semibold text-gray-600 hover:text-red-600"
              >
                <X size={16} />
                Xóa bộ lọc
              </button>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-3">
            {/* Status */}
            <div>
              <label className="text-xs font-bold text-gray-500">
                Trạng thái
              </label>
              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setPage(0);
                }}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {STATUS_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Retail */}
            <div>
              <label className="text-xs font-bold text-gray-500">
                Chi nhánh
              </label>
              <div className="relative mt-1">
                <MapPin
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select
                  value={retailId}
                  onChange={(e) => {
                    setRetailId(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-9 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả chi nhánh</option>
                  {retails.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Date */}
            <div>
              <label className="text-xs font-bold text-gray-500">
                Ngày hẹn
              </label>
              <div className="relative mt-1">
                <Calendar
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <input
                  type="date"
                  value={date}
                  onChange={(e) => {
                    setDate(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-9 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Time slot */}
            <div>
              <label className="text-xs font-bold text-gray-500">
                Khung giờ
              </label>
              <div className="relative mt-1">
                <Clock
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={16}
                />
                <select
                  value={timeSlot}
                  onChange={(e) => {
                    setTimeSlot(e.target.value);
                    setPage(0);
                  }}
                  className="w-full pl-9 rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Tất cả</option>
                  {TIME_SLOTS.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Page size */}
            <div>
              <label className="text-xs font-bold text-gray-500">Số dòng</label>
              <select
                value={size}
                onChange={(e) => {
                  setSize(Number(e.target.value));
                  setPage(0);
                }}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-gray-50 px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {[10, 20, 30, 50].map((n) => (
                  <option key={n} value={n}>
                    {n}/trang
                  </option>
                ))}
              </select>
            </div>
          </div>

          {err && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
              {err}
            </div>
          )}
        </div>

        {/* Table */}
        <div className="mt-5 bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between">
            <div className="font-extrabold text-gray-900">
              Danh sách ({total})
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 0}
                onClick={goPrev}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm font-semibold text-gray-600">
                Trang {page + 1}/{totalPages}
              </div>
              <button
                disabled={page >= totalPages - 1}
                onClick={goNext}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          <div className="border-t border-gray-100">
            {loading ? (
              <div className="p-10 text-center text-gray-500">Đang tải...</div>
            ) : rows.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm">
                  <thead className="bg-gray-50 text-gray-600">
                    <tr>
                      <th className="text-left px-5 py-3 font-bold">
                        Khách hàng
                      </th>
                      <th className="text-left px-5 py-3 font-bold">SĐT</th>
                      <th className="text-left px-5 py-3 font-bold">
                        Chi nhánh
                      </th>
                      <th className="text-left px-5 py-3 font-bold">Ngày</th>
                      <th className="text-left px-5 py-3 font-bold">Giờ</th>
                      <th className="text-left px-5 py-3 font-bold">
                        Trạng thái
                      </th>
                      <th className="text-right px-5 py-3 font-bold">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {rows.map((b) => (
                      <tr key={b.id} className="hover:bg-gray-50">
                        <td className="px-5 py-4">
                          <div className="font-bold text-gray-900">
                            {b.name || "—"}
                          </div>
                          <div className="text-xs text-gray-500 line-clamp-1">
                            {b.note || ""}
                          </div>
                        </td>
                        <td className="px-5 py-4 font-semibold text-gray-700">
                          {b.phone || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {b.retailName || "—"}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {formatDate(b.timeBooking)}
                        </td>
                        <td className="px-5 py-4 text-gray-700">
                          {b.startTime || "—"}
                        </td>
                        <td className="px-5 py-4">
                          <Badge status={b.status} />
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex justify-end gap-2">
                            {b.status === "PENDING" && (
                              <>
                                <button
                                  onClick={() =>
                                    updateStatus(b.id, "CONFIRMED")
                                  }
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700"
                                >
                                  <CheckCircle2 size={16} />
                                  Duyệt
                                </button>

                                <button
                                  onClick={() =>
                                    updateStatus(b.id, "AWAITING_PAYMENT")
                                  }
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700"
                                >
                                  <Clock size={16} />
                                  Chờ TT
                                </button>

                                <button
                                  onClick={() => updateStatus(b.id, "PAID")}
                                  className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700"
                                >
                                  <CheckCircle2 size={16} />
                                  Paid
                                </button>
                              </>
                            )}

                            {b.status !== "PENDING" && (
                              <button
                                onClick={() => updateStatus(b.id, "PENDING")}
                                className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 bg-white font-bold hover:bg-gray-50"
                              >
                                <RefreshCcw size={16} />
                                Hoàn tác
                              </button>
                            )}

                            <button
                              onClick={() => updateStatus(b.id, "CANCELLED")}
                              className="inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-red-50 text-red-700 border border-red-200 font-bold hover:bg-red-100"
                            >
                              <XCircle size={16} />
                              Hủy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              Hiển thị <span className="font-bold">{rows.length}</span> /{" "}
              <span className="font-bold">{total}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={page <= 0}
                onClick={goPrev}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-sm font-semibold text-gray-600">
                Trang {page + 1}/{totalPages}
              </div>
              <button
                disabled={page >= totalPages - 1}
                onClick={goNext}
                className="px-3 py-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-4 text-xs text-gray-500">
          Tip: Chọn “Chờ duyệt” + chọn chi nhánh + chọn ngày để duyệt nhanh.
        </div>
      </div>
    </div>
  );
}
