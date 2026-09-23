import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, CheckCircle2, Bell, Sparkles } from "lucide-react";
import notificationsData from "../data/mock/notifications.json";

/**
 * NotificationsPage (/notifications)
 * Features:
 *   • Filter chips: [All] [Unread] [Schemes] [Documents] [Governance]
 *   • Exactly 3 seeded cards from notifications.json:
 *       1. PM-KISAN Application Approved
 *       2. Document Expiry Alert (action routes to /profile and MUST NOT mutate state directly)
 *       3. Ayushman Bharat PM-JAY Match
 *   • Minimalist Lucide SVG icons (ZERO raw emojis)
 */
export default function NotificationsPage() {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState("All");

  const filters = ["All", "Unread", "Schemes", "Documents", "Governance"];

  const filteredNotifications = notificationsData.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Unread") return !item.isRead;
    if (activeFilter === "Schemes") return item.category === "Schemes";
    if (activeFilter === "Documents") return item.category === "Documents";
    if (activeFilter === "Governance") return item.category === "Governance";
    return true;
  });

  const handleActionClick = (actionRoute) => {
    if (actionRoute) {
      // Navigates to target route without mutating household state
      navigate(actionRoute);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-150">
      {/* Page Header */}
      <div className="border-b border-slate-200 dark:border-white/[0.08] pb-4">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-[#EDEDED] uppercase">
          Notifications & Updates
        </h1>
        <p className="text-xs text-slate-500 dark:text-[#8A8F98] mt-0.5">
          Real-time delivery notices, document validity alerts, and scheme matching
        </p>
      </div>

      {/* Filter Chips: [All] [Unread] [Schemes] [Documents] [Governance] */}
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter;
          return (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              type="button"
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors duration-200 cursor-pointer ${
                isActive
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white dark:bg-[#0F1115] text-slate-600 dark:text-[#8A8F98] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-100 dark:hover:bg-[#16191F] dark:hover:text-[#EDEDED]"
              }`}
            >
              {filter}
            </button>
          );
        })}
      </div>

      {/* Notification Cards List */}
      <div className="space-y-4">
        {filteredNotifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 dark:text-[#8A8F98] text-xs bg-white dark:bg-[#0F1115] rounded-2xl border border-slate-200 dark:border-white/[0.08] shadow-sm">
            No notifications found under "{activeFilter}".
          </div>
        ) : (
          filteredNotifications.map((notif) => {
            const isWarning = notif.type === "warning";
            const isSuccess = notif.type === "success";

            return (
              <div
                key={notif.id}
                className={`p-5 rounded-2xl border transition-all duration-200 bg-white dark:bg-[#0F1115] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                  isWarning
                    ? "border-amber-300 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20"
                    : isSuccess
                    ? "border-emerald-300 dark:border-emerald-800/80 bg-emerald-50/30 dark:bg-emerald-950/20"
                    : "border-slate-200 dark:border-white/[0.08]"
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div
                    className={`p-2.5 rounded-xl shrink-0 mt-0.5 border ${
                      isWarning
                        ? "bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800"
                        : isSuccess
                        ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800"
                        : "bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800"
                    }`}
                  >
                    {isWarning ? (
                      <AlertTriangle size={18} />
                    ) : isSuccess ? (
                      <CheckCircle2 size={18} />
                    ) : (
                      <Sparkles size={18} />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="text-sm font-semibold text-slate-900 dark:text-[#EDEDED]">
                        {notif.title}
                      </h3>
                      {!notif.isRead && (
                        <span className="w-2 h-2 rounded-full bg-blue-600 inline-block" />
                      )}
                    </div>
                    <p className="text-xs text-slate-600 dark:text-[#8A8F98] mt-1 leading-relaxed">
                      {notif.description}
                    </p>
                    <span className="text-[10px] text-slate-400 dark:text-[#8A8F98]/70 font-mono mt-1.5 inline-block">
                      Category: {notif.category}
                    </span>
                  </div>
                </div>

                {/* Expiry Action Button (Routes to /profile without mutating state) */}
                {notif.actionRoute && (
                  <button
                    type="button"
                    onClick={() => handleActionClick(notif.actionRoute)}
                    className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-600 hover:bg-amber-700 text-white transition shadow-xs whitespace-nowrap self-start sm:self-auto cursor-pointer"
                  >
                    {notif.actionLabel || "Resolve in Profile"}
                  </button>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
