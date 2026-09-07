import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { fetchNotifications } from "../services/api";


export default function NotificationsPage() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    fetchNotifications().then((data) => {
      setItems(data);
    }).catch(() => {});
  }, []);

  return (
    <div>
      <PageHeader title="Notifications" subtitle={`${items.length} recent alerts`} />
      <div className="space-y-3">
        {items.map((n, i) => (
          <div key={n._id || n.id || i} className="bg-white rounded-xl p-5 border border-[#dbeadb] hover:shadow-sm transition">
            <div className="flex items-start justify-between gap-4">
              <div><div className="font-bold text-forest-900">{n.title || "Notification"}</div><div className="text-sm text-[#4d6156] mt-1">{n.message || n.text || "New notification"}</div></div>
              <div className="text-xs text-[#7d9285] whitespace-nowrap">{n.time || n.createdAt || ""}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
