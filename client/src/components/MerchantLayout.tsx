import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest } from "@/lib/queryClient";
import { useQueryClient } from "@tanstack/react-query";
import {
  LayoutDashboard, Building2, MessageSquare, Settings, LogOut
} from "lucide-react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/business", label: "Business", icon: Building2 },
  { path: "/feedback", label: "Feedback", icon: MessageSquare },
  { path: "/settings", label: "Settings", icon: Settings },
];

export default function MerchantLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const [location] = useLocation();

  const handleLogout = async () => {
    await logout();
    window.location.href = "/";
  };

  return (
    <div className="flex min-h-screen bg-[#FAFAFC] font-['Poppins',sans-serif]">

      {/* ── Desktop Sidebar (hidden on mobile) ── */}
      <aside className="hidden md:flex fixed left-0 top-0 h-full w-60 bg-white border-r border-[#ECECF2] flex-col z-20">
        <div className="px-6 py-6 border-b border-[#ECECF2]">
          <div className="text-[#6D28D9] text-xl font-bold leading-tight">ReviewAI</div>
          <div className="text-[#6B7280] text-xs mt-0.5">by Adshree</div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1">
          {navItems.map(({ path, label, icon: Icon }) => {
            const active = location === path || (path === "/business" && location === "/settings");
            return (
              <Link
                key={path}
                href={path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[#6D28D9] text-white"
                    : "text-[#6B7280] hover:bg-[#F5F3FF] hover:text-[#6D28D9]"
                }`}
              >
                <Icon size={17} strokeWidth={1.8} />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="px-3 py-4 border-t border-[#ECECF2]">
          <div className="px-3 py-2 mb-2">
            <p className="text-sm font-medium text-[#111827] truncate">{user?.email}</p>
            <p className="text-xs text-[#6B7280]">Merchant Admin</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 w-full rounded-lg text-sm font-medium text-[#EF4444] hover:bg-red-50 transition-colors"
          >
            <LogOut size={17} strokeWidth={1.8} />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main content ── */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen pb-16 md:pb-0">
        {children}
      </div>

      {/* ── Mobile Bottom Nav (hidden on desktop) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-[#ECECF2] flex items-stretch">
        {navItems.map(({ path, label, icon: Icon }) => {
          const active = location === path || (path === "/business" && location === "/settings");
          return (
            <Link
              key={path}
              href={path}
              className={`flex-1 flex flex-col items-center justify-center py-2 gap-0.5 transition-colors ${
                active ? "text-[#6D28D9]" : "text-[#9CA3AF]"
              }`}
            >
              <Icon size={20} strokeWidth={1.8} />
              <span className="text-[10px] font-medium">{label}</span>
              {active && <span className="absolute bottom-0 w-8 h-0.5 bg-[#6D28D9] rounded-t-full" />}
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex-1 flex flex-col items-center justify-center py-2 gap-0.5 text-[#EF4444]"
        >
          <LogOut size={20} strokeWidth={1.8} />
          <span className="text-[10px] font-medium">Logout</span>
        </button>
      </nav>
    </div>
  );
}
