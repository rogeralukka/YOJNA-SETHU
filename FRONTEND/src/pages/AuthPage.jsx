import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUI } from "../context/UIContext";

/**
 * AuthPage (/auth):
 * Triggers the independent auth modal and redirects to / with zero flicker.
 */
export default function AuthPage() {
  const { openAuthModal } = useUI();
  const navigate = useNavigate();

  useEffect(() => {
    openAuthModal();
    navigate("/", { replace: true });
  }, [openAuthModal, navigate]);

  return null;
}
