import React, { useEffect } from "react";
import { useAdminOrdersStore } from "../../store/admin.orders.store";

const OrdersAdmin = () => {
  const orders = useAdminOrdersStore((s) => s.orders);
  const fetchOrders = useAdminOrdersStore((s) => s.fetchOrders);
  const updateStatus = useAdminOrdersStore((s) => s.updateStatus);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Quản lý đơn hàng</h1>
      <table className="w-full bg-white shadow rounded overflow-hidden">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2">Khách hàng</th>
            <th>Sản phẩm</th>
            <th>Tổng tiền</th>
            <th>Trạng thái</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o._id} className="border-b">
              <td className="p-2">{o?.customer?.name ?? o?.customerName ?? "—"}</td>
              <td>{o?.items?.map((i) => i?.product?.name).join(", ")}</td>
              <td>{o?.total ? o.total.toLocaleString() + "₫" : "—"}</td>
              <td>{o?.status}</td>
              <td>
                <select
                  value={o?.status}
                  onChange={(e) => updateStatus(o._id, e.target.value)}
                  className="border p-1 rounded"
                >
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="done">Done</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersAdmin;
