import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import { Navigation } from "./Navigation";
import { Footer } from "./Footer";
import { ChatBot } from "./ChatBot";
import { CustomCursor } from "./CustomCursor";

export function Layout() {
  const location = useLocation();

  // Defensive: clear any leftover scroll-lock from modals or the admin
  // sidebar drawer when entering / switching public routes, and scroll
  // to top so each page starts fresh.
  useEffect(() => {
    document.body.style.overflow = "";
    document.documentElement.style.overflow = "";
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Navigation />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <ChatBot />
      <CustomCursor />
    </div>
  );
}
