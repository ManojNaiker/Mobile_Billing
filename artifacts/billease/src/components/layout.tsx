import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, History, Users, Package, Building2, Settings, Menu, Receipt, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", group: "main" },
  { icon: FileText, label: "New Invoice", href: "/billing/new", group: "main" },
  { icon: History, label: "History", href: "/history", group: "main" },
  { icon: Users, label: "Customers", href: "/customers", group: "manage" },
  { icon: Package, label: "Products", href: "/products", group: "manage" },
  { icon: Building2, label: "Company", href: "/company", group: "config" },
  { icon: Settings, label: "Settings", href: "/settings", group: "config" },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-white" style={{
      background: "linear-gradient(160deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)"
    }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center shadow-lg" style={{
            background: "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)"
          }}>
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none">BillEase</h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">GST Invoice</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-3 pb-1">Main</p>
        {navItems.filter(i => i.group === "main").map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90"
              }`}>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-amber-400/20 text-amber-400"
                    : "text-white/50"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </div>
            </Link>
          );
        })}

        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-3 pb-1 pt-4">Manage</p>
        {navItems.filter(i => i.group === "manage").map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90"
              }`}>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-amber-400/20 text-amber-400"
                    : "text-white/50"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </div>
            </Link>
          );
        })}

        <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-3 pb-1 pt-4">Settings</p>
        {navItems.filter(i => i.group === "config").map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          return (
            <Link key={item.href} href={item.href}>
              <div className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all cursor-pointer select-none ${
                isActive
                  ? "bg-white/15 text-white shadow-sm border border-white/20"
                  : "text-white/60 hover:bg-white/8 hover:text-white/90"
              }`}>
                <div className={`w-7 h-7 rounded-md flex items-center justify-center transition-all ${
                  isActive
                    ? "bg-amber-400/20 text-amber-400"
                    : "text-white/50"
                }`}>
                  <item.icon className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{item.label}</span>
                {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-400" />}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 px-2">
          <Zap className="w-3.5 h-3.5 text-amber-400" />
          <span className="text-xs text-white/40">Powered by BillEase v1.0</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex w-full bg-background text-foreground">
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-60 shrink-0 fixed inset-y-0 z-20 no-print">
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 md:ml-60 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between p-4 border-b bg-card text-card-foreground no-print">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: "linear-gradient(135deg,#f59e0b,#ef4444)" }}>
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold text-primary tracking-tight">BillEase</h1>
          </div>
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="p-0 w-60">
              <SidebarContent />
            </SheetContent>
          </Sheet>
        </header>

        <main className="flex-1 p-4 md:p-6 overflow-y-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
}
