import React from "react";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, FileText, History, Users, Package, Building2, Settings, Menu, Receipt, Zap } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/", group: "main", color: "from-violet-500 to-purple-600" },
  { icon: FileText, label: "New Invoice", href: "/billing/new", group: "main", color: "from-blue-500 to-indigo-600" },
  { icon: History, label: "History", href: "/history", group: "main", color: "from-sky-400 to-cyan-500" },
  { icon: Users, label: "Customers", href: "/customers", group: "manage", color: "from-emerald-400 to-teal-500" },
  { icon: Package, label: "Products", href: "/products", group: "manage", color: "from-amber-400 to-orange-500" },
  { icon: Building2, label: "Company", href: "/company", group: "config", color: "from-pink-500 to-rose-500" },
  { icon: Settings, label: "Settings", href: "/settings", group: "config", color: "from-slate-400 to-slate-500" },
];

function NavGroup({ title, items, location }: {
  title: string;
  items: typeof navItems;
  location: string;
}) {
  return (
    <>
      <p className="text-[10px] text-white/30 uppercase tracking-widest font-semibold px-3 pb-1 pt-4 first:pt-1">
        {title}
      </p>
      {items.map((item) => {
        const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
        return (
          <Link key={item.href} href={item.href}>
            <div className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all cursor-pointer select-none ${
              isActive
                ? "bg-white/15 text-white shadow border border-white/20"
                : "text-white/60 hover:bg-white/8 hover:text-white/90"
            }`}>
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center transition-all bg-gradient-to-br ${item.color} shadow-sm ${
                isActive ? "opacity-100 scale-105" : "opacity-60 group-hover:opacity-80"
              }`}>
                <item.icon className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="text-sm font-medium">{item.label}</span>
              {isActive && (
                <div className={`ml-auto w-1.5 h-5 rounded-full bg-gradient-to-b ${item.color}`} />
              )}
            </div>
          </Link>
        );
      })}
    </>
  );
}

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  const SidebarContent = () => (
    <div className="flex flex-col h-full text-white" style={{
      background: "linear-gradient(175deg, #0f0c29 0%, #1a1060 40%, #0d1117 100%)"
    }}>
      {/* Logo */}
      <div className="px-5 pt-6 pb-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)"
          }}>
            <Receipt className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight leading-none bg-gradient-to-r from-violet-300 to-pink-300 bg-clip-text text-transparent">
              BillEase
            </h1>
            <p className="text-[10px] text-white/40 uppercase tracking-widest mt-0.5">GST Invoice</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        <NavGroup
          title="Main"
          items={navItems.filter((i) => i.group === "main")}
          location={location}
        />
        <NavGroup
          title="Manage"
          items={navItems.filter((i) => i.group === "manage")}
          location={location}
        />
        <NavGroup
          title="Settings"
          items={navItems.filter((i) => i.group === "config")}
          location={location}
        />
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-white/10">
        <div className="flex items-center gap-2 px-2">
          <Zap className="w-3.5 h-3.5 text-violet-400" />
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
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)"
            }}>
              <Receipt className="w-4 h-4 text-white" />
            </div>
            <h1 className="text-lg font-bold tracking-tight bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
              BillEase
            </h1>
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
