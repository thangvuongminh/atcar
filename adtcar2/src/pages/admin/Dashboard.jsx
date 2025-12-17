import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  CircleDollarSign,
  RefreshCcw,
  Clock,
  CheckCircle2,
  XCircle,
  CalendarDays,
  FileCheck2,
} from "lucide-react";
import { useAdminDashboardStore } from "../../store/admin.dashboard.store";

function formatVND(n) {
  const num = Number(n || 0);
  return num.toLocaleString("vi-VN") + "đ";
}

function StatCard({ title, value, icon: Icon, colorClass = "text-blue-600", sub, to }) {
  const inner = (
    <div className="bg-white border rounded-2xl shadow-sm p-5 hover:shadow transition">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="text-sm text-gray-600">{title}</div>
          <div className="mt-1 text-2xl font-bold text-gray-900">{value}</div>
          {sub ? <div className="mt-1 text-xs text-gray-500">{sub}</div> : null}
        </div>
        <div className={`w-11 h-11 rounded-2xl bg-gray-50 border flex items-center justify-center ${colorClass}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );

  return to ? <Link to={to}>{inner}</Link> : inner;
}

function StatusPill({ status }) {
  const base = "text-xs font-medium px-2 py-1 rounded-full border";
  if (status === "pending") return <span className={`${base} border-amber-200 bg-amber-50 text-amber-700`}>pending</span>;
  if (status === "approved") return <span className={`${base} border-green-200 bg-green-50 text-green-700`}>approved</span>;
  if (status === "rejected") return <span className={`${base} border-red-200 bg-red-50 text-red-700`}>rejected</span>;
  if (status === "confirmed") return <span className={`${base} border-blue-200 bg-blue-50 text-blue-700`}>confirmed</span>;
  return <span className={`${base} border-gray-200 bg-gray-50 text-gray-600`}>{status}</span>;
}

export default function Dashboard() {
  const tick = useAdminDashboardStore((s) => s.tick);
  const reload = useAdminDashboardStore((s) => s.reload);
  const bump = useAdminDashboardStore((s) => s.bump);
  const keys = useAdminDashboardStore((s) => s.keys);
  const dataFn = useAdminDashboardStore((s) => s.data);

  useEffect(() => {
    const onStorage = (e) => {
      if (keys.includes(e.key)) bump();
    };
    window.addEventListener("storage", onStorage);

    const t = setInterval(() => bump(), 1500);
    return () => {
      window.removeEventListener("storage", onStorage);
      clearInterval(t);
    };
  }, [bump, keys]);

  const data = dataFn();

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bảng điều khiển</h1>
          <p className="text-gray-600 mt-1">Tổng quan hệ thống (demo lấy từ localStorage).</p>
        </div>

        <button
          onClick={reload}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border bg-white hover:bg-gray-50"
        >
          <RefreshCcw size={18} />
          Tải lại
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-7 gap-4">
        <StatCard title="Chờ duyệt" value={data.pendingBooking} sub="Lịch hẹn" icon={Clock} colorClass="text-amber-600" to="/admin/bookings" />
        <StatCard title="Đã duyệt" value={data.confirmedBooking} sub="Lịch hẹn" icon={CheckCircle2} colorClass="text-blue-600" to="/admin/bookings" />
        <StatCard title="Từ chối" value={data.rejectedBooking} sub="Lịch hẹn" icon={XCircle} colorClass="text-red-600" to="/admin/bookings" />
        <StatCard title="Bài chờ duyệt" value={data.pendingPosts} sub="Bài viết" icon={FileCheck2} colorClass="text-purple-600" to="/admin/post-approvals" />
        <StatCard title="Sản phẩm" value={data.products.length} sub="Tổng số sản phẩm" icon={Package} colorClass="text-indigo-600" to="/admin/products" />
        <StatCard title="Đơn hàng" value={data.orderCount} sub="Tổng số đơn hàng" icon={ShoppingCart} colorClass="text-amber-600" to="/admin/orders" />
        <StatCard title="Doanh thu" value={formatVND(data.revenue)} sub="Tính từ orders (nếu có)" icon={CircleDollarSign} colorClass="text-green-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-white border rounded-2xl shadow-sm p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900 flex items-center gap-2">
              <CalendarDays size={18} className="text-indigo-600" />
              Lịch hẹn hôm nay
            </div>
            <div className="text-sm text-gray-600">{data.today}</div>
          </div>

          {data.todayBookings.length === 0 ? (
            <div className="mt-6 text-gray-600">Hôm nay chưa có lịch hẹn.</div>
          ) : (
            <div className="mt-4 divide-y">
              {data.todayBookings.slice(0, 8).map((b) => (
                <div key={b.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">{b.customerName || "—"}</div>
                    <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1 items-center">
                      <span className="font-medium text-gray-700">{b.timeSlot}</span>
                      <span>CN: {b.branchId}</span>
                      <span>{b.carBrand || "—"}</span>
                      <StatusPill status={b.status === "pending" ? "pending" : "confirmed"} />
                    </div>
                    {b.note ? <div className="text-xs text-gray-500 mt-1 truncate">Ghi chú: {b.note}</div> : null}
                  </div>

                  <Link to="/admin/bookings" className="text-sm text-blue-600 hover:underline">Xử lý</Link>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-white border rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div className="font-semibold text-gray-900">Yêu cầu lịch hẹn mới</div>
            <Link to="/admin/bookings" className="text-sm text-blue-600 hover:underline">Quản lý</Link>
          </div>

          {data.latestBookings.length === 0 ? (
            <div className="mt-6 text-gray-600">Chưa có lịch hẹn nào.</div>
          ) : (
            <div className="mt-4 divide-y">
              {data.latestBookings.map((b) => (
                <div key={b.id} className="py-3">
                  <div className="font-medium text-gray-900 truncate">{b.customerName || "—"}</div>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-x-3 gap-y-1 items-center">
                    <span className="font-medium text-gray-700">{b.date}</span>
                    <span>{b.timeSlot}</span>
                    <span>CN: {b.branchId}</span>
                    <StatusPill status={b.status} />
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {b.createdAt ? new Date(b.createdAt).toLocaleString() : ""}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-5">
        <div className="flex items-center justify-between">
          <div className="font-semibold text-gray-900">Bài viết chờ duyệt</div>
          <Link to="/admin/post-approvals" className="text-sm text-blue-600 hover:underline">Quản lý</Link>
        </div>

        {data.latestPendingPosts.length === 0 ? (
          <div className="mt-4 text-gray-600">Không có bài viết chờ duyệt.</div>
        ) : (
          <div className="mt-4 divide-y">
            {data.latestPendingPosts.map((p) => (
              <div key={p.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-gray-900 truncate">{p.title || "—"}</div>
                    <StatusPill status="pending" />
                  </div>
                  <div className="text-sm text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
                    <span>Tác giả: <span className="font-medium text-gray-800">{p.authorName || "Editor"}</span></span>
                    <span>Danh mục: <span className="font-medium text-gray-800">{p.categoryName || "—"}</span></span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {p.createdAt ? new Date(p.createdAt).toLocaleString() : ""}
                  </div>
                </div>
                <Link to="/admin/post-approvals" className="text-sm text-blue-600 hover:underline">Duyệt</Link>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border rounded-2xl shadow-sm p-5">
        <div className="font-semibold text-gray-900">Thao tác nhanh</div>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/admin/bookings" className="px-4 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700">Duyệt lịch hẹn</Link>
          <Link to="/admin/post-approvals" className="px-4 py-2 rounded-xl border hover:bg-gray-50">Duyệt bài viết</Link>
          <Link to="/admin/products" className="px-4 py-2 rounded-xl border hover:bg-gray-50">Quản lý sản phẩm</Link>
          <Link to="/admin/orders" className="px-4 py-2 rounded-xl border hover:bg-gray-50">Quản lý đơn hàng</Link>
        </div>
      </div>
    </div>
  );
}
