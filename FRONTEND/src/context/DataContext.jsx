import { api } from '../services/api';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { initialSchemes } from '../data/initialSchemes';
import { initialBusinesses } from '../data/initialBusinesses';
import { initialApplications } from '../data/initialApplications';
import { initialNotifications } from '../data/initialNotifications';
import { initialUser } from '../data/initialUser';

export const CITIZEN_VIEWS = [
  'dashboard',
  'scheme-detail',
  'application-form',
  'my-business',
  'my-applications',
  'bookmarks',
  'notifications',
  'share-eligibility',
  'profile'
];

export const ADMIN_VIEWS = [
  'admin-overview',
  'admin-all-applications',
  'admin-review-application',
  'admin-review-later',
  'admin-scheme-management'
];

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // Navigation & View Routing State
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedSchemeId, setSelectedSchemeId] = useState(null);
  const [applicationFormSchemes, setApplicationFormSchemes] = useState([]);
  const [selectedApplicationId, setSelectedApplicationId] = useState(null);
  const [applicationModalOpen, setApplicationModalOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Core Datasets
  const [schemes, setSchemes] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_schemes');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length >= 10 && parsed.some(s => s.governmentLevel)) {
          return parsed;
        }
      } catch (e) {}
    }
    return initialSchemes;
  });

  const [businesses, setBusinesses] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_businesses');
    return saved ? JSON.parse(saved) : initialBusinesses;
  });

  const [activeContext, setActiveContext] = useState('personal'); // 'personal' or businessId like 'biz-101'

  const [bookmarks, setBookmarks] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_bookmarks');
    return saved ? JSON.parse(saved) : ['pm-kisan', 'national-scholarship'];
  });

  const [applications, setApplications] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_applications');
    return saved ? JSON.parse(saved) : initialApplications;
  });

  const [notifications, setNotifications] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_notifications');
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [userProfile, setUserProfile] = useState(() => {
    const saved = localStorage.getItem('yojanasetu_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed) {
          if (!parsed.avatarUrl || parsed.avatarUrl.includes('AB6AXuChnRVdIRJXZPEe9YR') || parsed.avatarUrl.includes('unsplash.com') || parsed.avatarUrl.includes('1539571696357') || parsed.avatarUrl.includes('1566492031773')) {
            parsed.avatarUrl = initialUser.avatarUrl;
          }
          return parsed;
        }
      } catch (e) {}
    }
    return initialUser;
  });

  // Global Toast State
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  // Sync with LocalStorage
  useEffect(() => {
    localStorage.setItem('yojanasetu_schemes', JSON.stringify(schemes));
  }, [schemes]);

  useEffect(() => {
    localStorage.setItem('yojanasetu_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('yojanasetu_bookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem('yojanasetu_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('yojanasetu_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('yojanasetu_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  // Bookmark Management
  const toggleBookmark = (schemeId) => {
    setBookmarks(prev => {
      const exists = prev.includes(schemeId);
      const updated = exists ? prev.filter(id => id !== schemeId) : [...prev, schemeId];
      showToast(exists ? "Scheme removed from bookmarks" : "Scheme saved to bookmarks", "info");
      return updated;
    });
  };

  const isBookmarked = (schemeId) => bookmarks.includes(schemeId);

  // Business Management
  const addBusiness = (bizData) => {
    api.createBusiness(bizData).catch(() => {});
    const newBiz = {
      ...bizData,
      id: `biz-${Date.now()}`,
      badgeType: bizData.businessType === 'Private Limited' ? 'MSME' : 'Agro'
    };
    setBusinesses(prev => [newBiz, ...prev]);
    showToast(`Business "${newBiz.businessName}" added successfully!`);
    return newBiz;
  };

  const updateBusiness = (id, updatedFields) => {
    setBusinesses(prev => prev.map(b => (b.id === id ? { ...b, ...updatedFields } : b)));
    showToast("Business profile updated successfully!");
  };

  const deleteBusiness = (id) => {
    setBusinesses(prev => prev.filter(b => b.id !== id));
    if (activeContext === id) {
      setActiveContext('personal');
    }
    showToast("Business profile removed", "info");
  };

  // Application Creation
  const createApplication = ({ schemeList, entityType, businessId, bankDetails, additionalInputs }) => {
    const schemeNames = schemeList.map(s => s.name).join(', ');
    const firstScheme = schemeList[0] || {};
    const businessObj = entityType === 'business' ? businesses.find(b => b.id === businessId) : null;
    const appId = `APP-${Math.floor(10000 + Math.random() * 90000)}`;

    const newApp = {
      applicationId: appId,
      userId: userProfile.id,
      userName: userProfile.name,
      userEmail: userProfile.email,
      userPhone: userProfile.phone,
      userState: userProfile.state,
      userCategory: userProfile.category,
      userIncome: `₹ ${userProfile.income.toLocaleString('en-IN')}`,
      schemeIds: schemeList.map(s => s.id),
      schemeName: schemeNames,
      schemeCategory: firstScheme.category || "General",
      entityType: entityType, // 'personal' or 'business'
      entityName: entityType === 'business' ? (businessObj?.businessName || "Business") : "You",
      businessId: entityType === 'business' ? businessId : null,
      businessDetails: businessObj ? {
        businessName: businessObj.businessName,
        businessType: businessObj.businessType,
        gst: businessObj.gst,
        pan: businessObj.pan,
        turnover: `₹ ${businessObj.annualTurnover}`,
        industry: businessObj.industryCategory
      } : null,
      status: "Pending",
      reviewLater: false,
      appliedAt: new Date().toISOString().split('T')[0],
      updatedAt: new Date().toISOString().split('T')[0],
      approvedAt: null,
      rejectedAt: null,
      adminComment: null,
      timeline: [
        { title: "Application Submitted", date: "Today", completed: true, desc: "Application successfully submitted and queued for review." },
        { title: "Document Verification", date: "Pending", completed: false },
        { title: "Decision", date: "Pending", completed: false }
      ],
      bankDetails: bankDetails || userProfile.bankDetails,
      documents: [
        ...Object.entries(userProfile.documents)
          .filter(([_, doc]) => doc.status === 'Uploaded')
          .map(([_, doc]) => ({ name: doc.name, size: doc.size, date: doc.date || "Today" })),
        ...(Array.isArray(additionalInputs?.customDocs) ? additionalInputs.customDocs : [])
      ]
    };

    setApplications(prev => [newApp, ...prev]);
    // Synchronize with backend API
    api.applySchemes({
      schemeIds: schemeList.map(s => s.id),
      entity: entityType,
      businessCardId: businessId
    }).catch(() => {});

    // Create Notification
    const newNotif = {
      id: `notif-${Date.now()}`,
      type: "submitted",
      title: "Application Submitted Successfully",
      message: `Your application for ${schemeNames} (${appId}) has been received and is pending verification.`,
      timestamp: "Just now",
      dateGroup: "today",
      read: false,
      actionType: "view_application",
      actionTarget: appId,
      badge: "Submitted",
      badgeColor: "bg-primary-container text-on-primary-container"
    };

    setNotifications(prev => [newNotif, ...prev]);
    showToast(`Application ${appId} submitted successfully!`);
    return newApp;
  };

  // Admin Actions
  const approveApplication = (applicationId) => {
    api.updateApplicationStatus(applicationId, 'approved').catch(() => {});
    const todayStr = new Date().toISOString().split('T')[0];
    let appTitle = "";

    setApplications(prev => prev.map(app => {
      if (app.applicationId === applicationId) {
        appTitle = app.schemeName;
        return {
          ...app,
          status: "Approved",
          approvedAt: todayStr,
          updatedAt: todayStr,
          reviewLater: false,
          timeline: [
            ...app.timeline.slice(0, 1),
            { title: "Document Verification", date: todayStr, completed: true, desc: "Verified and confirmed by reviewing officer." },
            { title: "Application Approved", date: todayStr, completed: true, desc: "Application approved. Sanction disbursement initiated." }
          ]
        };
      }
      return app;
    }));

    // Trigger Notification for User
    const approvedNotif = {
      id: `notif-${Date.now()}`,
      type: "approved",
      title: `Application Approved: ${appTitle || applicationId}`,
      message: `Your application (${applicationId}) has been successfully verified and approved by the department.`,
      timestamp: "Just now",
      dateGroup: "today",
      read: false,
      actionType: "view_application",
      actionTarget: applicationId,
      badge: "Approved",
      badgeColor: "bg-[#E8F5E9] text-[#1B5E20]"
    };
    setNotifications(prev => [approvedNotif, ...prev]);
    showToast(`Application ${applicationId} Approved`);
  };

  const rejectApplication = (applicationId, reason) => {
    if (!reason || !reason.trim()) {
      showToast("Rejection reason is mandatory", "error");
      return false;
    }

    const todayStr = new Date().toISOString().split('T')[0];
    let appTitle = "";

    setApplications(prev => prev.map(app => {
      if (app.applicationId === applicationId) {
        appTitle = app.schemeName;
        return {
          ...app,
          status: "Rejected",
          rejectedAt: todayStr,
          updatedAt: todayStr,
          adminComment: reason.trim(),
          reviewLater: false,
          timeline: [
            ...app.timeline.slice(0, 1),
            { title: "Document Verification", date: todayStr, completed: true },
            { title: "Application Rejected", date: todayStr, completed: true, desc: reason.trim() }
          ]
        };
      }
      return app;
    }));

    // Trigger Notification for User
    const rejectedNotif = {
      id: `notif-${Date.now()}`,
      type: "rejected",
      title: `Application Rejected: ${appTitle || applicationId}`,
      message: `Your application (${applicationId}) was rejected. Reason: "${reason.trim()}". You may update documents and re-apply.`,
      timestamp: "Just now",
      dateGroup: "today",
      read: false,
      actionType: "view_application",
      actionTarget: applicationId,
      badge: "Rejected",
      badgeColor: "bg-[#FFEBEE] text-[#C62828]"
    };
    setNotifications(prev => [rejectedNotif, ...prev]);
    showToast(`Application ${applicationId} Rejected`, "info");
    return true;
  };

  const setReviewLater = (applicationId, status = true) => {
    setApplications(prev => prev.map(app => {
      if (app.applicationId === applicationId) {
        return {
          ...app,
          reviewLater: status,
          updatedAt: new Date().toISOString().split('T')[0]
        };
      }
      return app;
    }));
    showToast(status ? `Application ${applicationId} moved to Review Later` : `Application removed from Review Later`, "info");
  };

  // Scheme Management
  const addScheme = (schemeData) => {
    const newScheme = {
      ...schemeData,
      id: `scheme-${Date.now()}`,
      governmentLevel: schemeData.governmentLevel || 'central',
      applicableStates: schemeData.governmentLevel === 'state' ? (schemeData.applicableStates || []) : ['ALL'],
      isNew: true,
      active: true,
      approvalRate: "85%",
      processingTime: "15-30 Days",
      eligibilityCriteria: schemeData.eligibilityCriteria || [
        { text: "Indian resident citizen.", eligible: true }
      ],
      documentsRequired: schemeData.documentsRequired || ["Aadhaar Card", "Bank Details"]
    };

    setSchemes(prev => [newScheme, ...prev]);

    // Simulated Notification for matching users based on geographic eligibility
    const userState = userProfile.state;
    const isMatching = newScheme.governmentLevel === 'central' || 
                       newScheme.applicableStates.includes('ALL') || 
                       newScheme.applicableStates.includes(userState);

    if (isMatching) {
      const notif = {
        id: `notif-${Date.now()}`,
        type: "scheme_added",
        title: `New Scheme Match: ${newScheme.name}`,
        message: `A new government initiative "${newScheme.name}" has been published by ${newScheme.department}. You may be eligible!`,
        timestamp: "Just now",
        dateGroup: "today",
        read: false,
        actionType: "apply_scheme",
        actionTarget: newScheme.id,
        badge: "New Scheme",
        badgeColor: "bg-[#FFF8E1] text-[#F57C00]"
      };
      setNotifications(prev => [notif, ...prev]);
    }
    showToast(`Scheme "${newScheme.name}" created and published!`);
    return newScheme;
  };

  const updateScheme = (id, updatedFields) => {
    let schemeName = "";
    setSchemes(prev => prev.map(s => {
      if (s.id === id) {
        schemeName = updatedFields.name || s.name;
        return { ...s, ...updatedFields };
      }
      return s;
    }));

    const notif = {
      id: `notif-${Date.now()}`,
      type: "info",
      title: `Scheme Updated: ${schemeName}`,
      message: `The guidelines and details for "${schemeName}" have been recently updated by the ministry.`,
      timestamp: "Just now",
      dateGroup: "today",
      read: false,
      actionType: "apply_scheme",
      actionTarget: id,
      badge: "Updated",
      badgeColor: "bg-surface-container-high text-on-surface-variant"
    };
    setNotifications(prev => [notif, ...prev]);
    showToast("Scheme updated successfully!");
  };

  const deleteScheme = (id) => {
    setSchemes(prev => prev.filter(s => s.id !== id));
    showToast("Scheme removed from active directory", "info");
  };

  // Notifications Management
  const markNotificationAsRead = (notifId) => {
    setNotifications(prev => prev.map(n => (n.id === notifId ? { ...n, read: true } : n)));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast("All notifications marked as read", "info");
  };

  // Profile Management
  const updateProfile = (updatedFields) => {
    setUserProfile(prev => ({ ...prev, ...updatedFields }));
    showToast("Profile details updated successfully!");
  };

  const uploadDocumentMock = (docKey, docName = "Document_Scan.pdf", docSize = "1.5 MB") => {
    setUserProfile(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        [docKey]: {
          status: "Uploaded",
          name: docName,
          size: docSize,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
        }
      }
    }));
    showToast(`Document uploaded successfully!`);
  };

  // Profile Completion Percentage Calculation
  const calculateProfileCompletion = () => {
    let score = 0;
    const total = 12; // Profile Details (7) + Bank (1) + Verification Documents (5)
    if (userProfile.name) score++;
    if (userProfile.phone) score++;
    if (userProfile.email) score++;
    if (userProfile.state) score++;
    if (userProfile.category) score++;
    if (userProfile.income) score++;
    if (userProfile.bankDetails?.accountNumber) score++;
    if (userProfile.documents?.aadhaar?.status === 'Uploaded') score++;
    if (userProfile.documents?.pan?.status === 'Uploaded') score++;
    if (userProfile.documents?.income?.status === 'Uploaded') score++;
    if (userProfile.documents?.caste?.status === 'Uploaded') score++;
    if (userProfile.documents?.voterId?.status === 'Uploaded') score++;
    return Math.round((score / total) * 100);
  };

  // Navigation Helpers
  const navigateTo = (view, payload = null) => {
    if (view === 'scheme-detail') {
      setSelectedSchemeId(payload);
    } else if (view === 'application-form') {
      setApplicationFormSchemes(Array.isArray(payload) ? payload : (payload ? [payload] : []));
    } else if (view === 'admin-review-application') {
      setSelectedApplicationId(payload);
    }
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DataContext.Provider
      value={{
        // Routing
        currentView,
        setCurrentView,
        navigateTo,
        selectedSchemeId,
        setSelectedSchemeId,
        applicationFormSchemes,
        setApplicationFormSchemes,
        selectedApplicationId,
        setSelectedApplicationId,
        applicationModalOpen,
        setApplicationModalOpen,
        isSidebarCollapsed,
        setIsSidebarCollapsed,

        // Data
        schemes,
        addScheme,
        updateScheme,
        deleteScheme,
        businesses,
        addBusiness,
        updateBusiness,
        deleteBusiness,
        activeContext,
        setActiveContext,
        bookmarks,
        toggleBookmark,
        isBookmarked,
        applications,
        createApplication,
        approveApplication,
        rejectApplication,
        setReviewLater,
        notifications,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        userProfile,
        updateProfile,
        uploadDocumentMock,
        profileCompletion: calculateProfileCompletion(),

        // Toast
        toast,
        showToast
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
