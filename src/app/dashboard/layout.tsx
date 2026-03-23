import { redirect } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  Clock,
  FileText,
  Settings,
  Heart,
  LogOut,
} from "lucide-react";
import { signOut } from "next-auth/react";
import ThankYouModal from "@/components/thank-you-modal";
import ToastProvider from "@/components/toast-provider";
import UserMenu from "@/components/user-menu";
import { auth } from "@/lib/auth";

const navItems = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/clients", label: "Clientes", icon: Users },
  { href: "/dashboard/projects", label: "Proyectos", icon: FolderKanban },
  { href: "/dashboard/time", label: "Tiempo", icon: Clock },
  { href: "/dashboard/invoices", label: "Facturas", icon: FileText },
  { href: "/dashboard/settings", label: "Configuración", icon: Settings },
];

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) {
    redirect("/auth/sign-in");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation */}
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">f</span>
              </div>
              <span className="font-bold text-lg hidden sm:block">freelanceos</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="https://ko-fi.com/webwardlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium px-3 py-1.5 rounded-lg hover:bg-amber-50 transition"
            >
              <Heart className="w-4 h-4" />
              <span className="hidden sm:inline">Donar</span>
            </a>
            <UserMenu user={session.user} />
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col fixed left-0 top-16 bottom-0 bg-white border-r">
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition"
              >
                <item.icon className="w-5 h-5" />
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="p-4 border-t space-y-2">
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition w-full"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar sesión</span>
            </button>
          </div>
        </aside>

        {/* Mobile Navigation */}
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-50">
          <div className="flex justify-around py-2">
            {navItems.slice(0, 5).map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-1 px-3 py-2 text-gray-600 hover:text-blue-600"
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs">{item.label}</span>
              </Link>
            ))}
          </div>
        </nav>

        {/* Main Content */}
        <main className="flex-1 md:ml-64 p-6 pb-20 md:pb-6">
          {children}
        </main>
      </div>

      {/* Thank You Modal for Ko-fi donations */}
      <ThankYouModal />
      <ToastProvider />
    </div>
  );
}
