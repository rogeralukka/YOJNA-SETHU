export const initialNotifications = [
  {
    id: "notif-1",
    type: "approved",
    title: "PM Kisan Samman Nidhi Application Approved",
    message: "Your application (ID: PMK-2023-8942) has been successfully verified and approved. The installment will be credited to your registered bank account.",
    timestamp: "2 hours ago",
    dateGroup: "today",
    read: false,
    actionType: "view_application",
    actionTarget: "APP-9824",
    badge: "Approved",
    badgeColor: "bg-[#E8F5E9] text-[#1B5E20]"
  },
  {
    id: "notif-2",
    type: "scheme_added",
    title: "New Eligibility Match: Ayushman Bharat",
    message: "Based on your recent profile update, you are now eligible for the Ayushman Bharat PM-JAY scheme providing health coverage up to ₹5 lakhs per family per year.",
    timestamp: "5 hours ago",
    dateGroup: "today",
    read: false,
    actionType: "apply_scheme",
    actionTarget: "ayushman-pmjay",
    badge: "New Scheme",
    badgeColor: "bg-[#FFF8E1] text-[#F57C00]"
  },
  {
    id: "notif-3",
    type: "action_required",
    title: "Document Rejected: Income Certificate Update",
    message: "The income certificate provided for Ayushman Bharat is older than 6 months. Please re-upload a clear, valid document to proceed.",
    timestamp: "Yesterday, 2:30 PM",
    dateGroup: "yesterday",
    read: true,
    actionType: "update_document",
    actionTarget: "profile",
    badge: "Action Required",
    badgeColor: "bg-[#FFEBEE] text-[#C62828]"
  },
  {
    id: "notif-4",
    type: "info",
    title: "System Maintenance Scheduled",
    message: "The portal will be undergoing scheduled maintenance this Sunday from 2:00 AM to 6:00 AM. Scheme applications will be temporarily unavailable during this window.",
    timestamp: "Yesterday, 10:15 AM",
    dateGroup: "yesterday",
    read: true,
    actionType: "info",
    actionTarget: null,
    badge: "Announcement",
    badgeColor: "bg-surface-container-high text-on-surface-variant"
  }
];
