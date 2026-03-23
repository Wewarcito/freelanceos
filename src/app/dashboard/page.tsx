import { Users, FolderKanban, Plus } from "lucide-react";
import Link from "next/link";
import DashboardData from "./dashboard-data";
import { auth } from "@/lib/auth";

export default async function DashboardPage() {
  const session = await auth();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Bienvenido{session?.user?.name ? `, ${session.user.name}` : ""}
        </h1>
        <p className="text-gray-600">Aquí está el resumen de tu actividad</p>
      </div>

      {/* Dynamic content */}
      <DashboardData userId={session?.user?.id || ""} />

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/dashboard/clients/new"
          className="bg-white rounded-xl border p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Agregar Cliente</h3>
                <p className="text-sm text-gray-500">Gestiona tus contactos</p>
              </div>
            </div>
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition" />
          </div>
        </Link>

        <Link
          href="/dashboard/projects/new"
          className="bg-white rounded-xl border p-6 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <FolderKanban className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Nuevo Proyecto</h3>
                <p className="text-sm text-gray-500">Crea un proyecto</p>
              </div>
            </div>
            <Plus className="w-5 h-5 text-gray-400 group-hover:text-green-600 transition" />
          </div>
        </Link>
      </div>
    </div>
  );
}
