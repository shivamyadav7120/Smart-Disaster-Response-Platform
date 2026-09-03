import React, { useEffect, useState } from "react";
import PageHeader from "../components/PageHeader";
import { fetchNotifications } from "../services/api";

const mockNotifications = [
  { id: 1, title: "High-priority SOS", message: "A new SOS request requires attention.", time: "Just now" },
  { id: 2, title: "Weather alert", message: "Heavy rainfall warning is active.", time: "10 min ago" },
  { id: 3, title: "Shelter capacity", message: "Indirapuram School Shelter is near capacity.", time: "25 min ago" }
];

export default function NotificationsPage() {
  const [items, setItems] = useState(mockNotifications);
  useEffect(() => {
    fetchNotifications().then((data) => {
      if (data.length) setItems(data);
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
