"use client";

import { useState, useEffect } from "react";
import { Users, FolderKanban, Clock, FileText, Heart, ArrowRight, DollarSign } from "lucide-react";
import Link from "next/link";
import DashboardCharts, { ExportButton } from "@/components/dashboard-charts";

interface Stats {
  clients: number;
  projects: number;
  activeProjects: number;
  hoursThisMonth: number;
  pendingInvoices: number;
  totalPending: number;
}

interface RecentProject {
  id: string;
  name: string;
  status: string;
  clientName: string | null;
}

interface RecentClient {
  id: string;
  name: string;
  company: string | null;
}

interface TimeEntry {
  duration: number | null;
  startTime: string;
}

interface Invoice {
  status: string;
  amount: number;
}

interface RecentInvoice {
  id: string;
  invoiceNumber: string;
  status: string;
  amount: number;
  dueDate: string;
  projectId?: string;
}

interface ChartData {
  weeklyHours: { day: string; hours: number }[];
  projectStatus: { name: string; value: number; color: string }[];
  monthlyIncome: { month: string; amount: number }[];
  invoicesByStatus: { name: string; value: number; color: string }[];
}

export default function DashboardData({ userId }: { userId: string }) {
  const [stats, setStats] = useState<Stats>({ 
    clients: 0, 
    projects: 0, 
    activeProjects: 0, 
    hoursThisMonth: 0,
    pendingInvoices: 0,
    totalPending: 0,
  });
  const [recentProjects, setRecentProjects] = useState<RecentProject[]>([]);
  const [recentClients, setRecentClients] = useState<RecentClient[]>([]);
  const [recentInvoices, setRecentInvoices] = useState<RecentInvoice[]>([]);
  const [chartData, setChartData] = useState<ChartData>({
    weeklyHours: [],
    projectStatus: [],
    monthlyIncome: [],
    invoicesByStatus: [],
  });
  const [timeEntriesData, setTimeEntriesData] = useState<any[]>([]);
  const [invoicesData, setInvoicesData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [clientsRes, projectsRes, timeRes, invoicesRes] = await Promise.all([
        fetch("/api/clients"),
        fetch("/api/projects"),
        fetch("/api/time"),
        fetch("/api/invoices"),
      ]);

      if (clientsRes.ok && projectsRes.ok) {
        const clients = await clientsRes.json();
        const projects = await projectsRes.json();
        
        let hoursThisMonth = 0;
        if (timeRes.ok) {
          const timeEntries: TimeEntry[] = await timeRes.json();
          const now = new Date();
          const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
          
          hoursThisMonth = timeEntries
            .filter(e => new Date(e.startTime) >= monthStart)
            .reduce((acc, e) => acc + (e.duration || 0), 0) / 3600;
        }

        let pendingInvoices = 0;
        let totalPending = 0;
        let recentInvoicesData: RecentInvoice[] = [];
        if (invoicesRes.ok) {
          const invoices: Invoice[] = await invoicesRes.json();
          pendingInvoices = invoices.filter(i => i.status !== "paid" && i.status !== "canceled").length;
          totalPending = invoices
            .filter(i => i.status !== "paid" && i.status !== "canceled")
            .reduce((acc, i) => acc + i.amount, 0);
          recentInvoicesData = invoices.slice(0, 5) as RecentInvoice[];
        }

        setStats({
          clients: clients.length,
          projects: projects.length,
          activeProjects: projects.filter((p: any) => p.status === "active").length,
          hoursThisMonth,
          pendingInvoices,
          totalPending,
        });

        setRecentProjects(projects.slice(0, 5));
        setRecentClients(clients.slice(0, 5));
        setRecentInvoices(recentInvoicesData);

        const weeklyHours = getWeeklyHours(timeRes.ok ? await timeRes.json() : []);
        const projectStatus = getProjectStatusBreakdown(projects);
        
        setChartData({
          weeklyHours,
          projectStatus,
          monthlyIncome: [],
          invoicesByStatus: [],
        });

        if (timeRes.ok) {
          const timeEntries = await timeRes.json();
          setTimeEntriesData(timeEntries.map((e: any) => ({
            fecha: new Date(e.startTime).toLocaleDateString("es-CO"),
            proyecto: e.projectName || "Sin proyecto",
            duracion_minutos: e.duration ? Math.round(e.duration / 60) : 0,
            descripcion: e.description || "",
            facturable: e.billable ? "Sí" : "No",
          })));
        }

        if (invoicesRes.ok) {
          const invoices = await invoicesRes.json();
          const monthlyIncome = getMonthlyIncome(invoices);
          const invoicesByStatus = getInvoicesByStatus(invoices);
          setChartData(prev => ({
            ...prev,
            monthlyIncome,
            invoicesByStatus,
          }));
          setInvoicesData(invoices.map((inv: any) => ({
            numero: inv.invoiceNumber,
            estado: getInvoiceStatusLabel(inv.status),
            monto: inv.amount,
            fecha_vencimiento: new Date(inv.dueDate).toLocaleDateString("es-CO"),
            fecha_pago: inv.paidDate ? new Date(inv.paidDate).toLocaleDateString("es-CO") : "",
          })));
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  function getWeeklyHours(entries: any[]) {
    const days = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);

    const weeklyData = days.map((_, i) => {
      const dayStart = new Date(weekStart);
      dayStart.setDate(weekStart.getDate() + i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayStart.getDate() + 1);

      const dayHours = entries
        .filter((e: any) => {
          const entryDate = new Date(e.startTime);
          return entryDate >= dayStart && entryDate < dayEnd;
        })
        .reduce((acc: number, e: any) => acc + (e.duration || 0), 0) / 3600;

      return { day: days[i], hours: Math.round(dayHours * 10) / 10 };
    });

    return weeklyData;
  }

  function getProjectStatusBreakdown(projects: any[]) {
    const statusMap: Record<string, { name: string; color: string }> = {
      potential: { name: "Potencial", color: "#8B5CF6" },
      active: { name: "Activo", color: "#3B82F6" },
      completed: { name: "Completado", color: "#10B981" },
      canceled: { name: "Cancelado", color: "#EF4444" },
    };

    const counts: Record<string, number> = {};
    projects.forEach((p: any) => {
      counts[p.status] = (counts[p.status] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([status]) => statusMap[status])
      .map(([status, value]) => ({
        ...statusMap[status],
        value,
      }));
  }

  function getMonthlyIncome(invoices: any[]) {
    const months: Record<string, number> = {};
    const now = new Date();

    for (let i = 5; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = date.toLocaleDateString("es-CO", { month: "short", year: "2-digit" });
      months[key] = 0;
    }

    invoices
      .filter((inv: any) => inv.status === "paid" && inv.paidDate)
      .forEach((inv: any) => {
        const date = new Date(inv.paidDate);
        const key = date.toLocaleDateString("es-CO", { month: "short", year: "2-digit" });
        if (months[key] !== undefined) {
          months[key] += inv.amount;
        }
      });

    return Object.entries(months).map(([month, amount]) => ({ month, amount }));
  }

  function getInvoicesByStatus(invoices: any[]) {
    const statusMap: Record<string, { name: string; color: string }> = {
      draft: { name: "Borrador", color: "#9CA3AF" },
      sent: { name: "Enviada", color: "#3B82F6" },
      paid: { name: "Pagada", color: "#10B981" },
      overdue: { name: "Vencida", color: "#EF4444" },
      canceled: { name: "Cancelada", color: "#6B7280" },
    };

    const counts: Record<string, number> = {};
    invoices.forEach((inv: any) => {
      counts[inv.status] = (counts[inv.status] || 0) + 1;
    });

    return Object.entries(counts)
      .filter(([status]) => statusMap[status])
      .map(([status, value]) => ({
        ...statusMap[status],
        value,
      }));
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-blue-100 text-blue-700";
      case "completed": return "bg-green-100 text-green-700";
      case "canceled": return "bg-red-100 text-red-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "potential": return "Potencial";
      case "active": return "Activo";
      case "completed": return "Completado";
      case "canceled": return "Cancelado";
      default: return status;
    }
  };

  const StatCard = ({
    icon,
    label,
    value,
    color,
    href,
  }: {
    icon: React.ReactNode;
    label: string;
    value: string;
    color: "blue" | "green" | "purple" | "orange";
    href?: string;
  }) => {
    const colors = {
      blue: "bg-blue-100 text-blue-600",
      green: "bg-green-100 text-green-600",
      purple: "bg-purple-100 text-purple-600",
      orange: "bg-orange-100 text-orange-600",
      yellow: "bg-yellow-100 text-yellow-600",
    };

    const content = (
      <div className="bg-white rounded-xl border p-4 hover:shadow-md transition">
        <div className={`w-10 h-10 ${colors[color]} rounded-lg flex items-center justify-center mb-3`}>
          {icon}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-sm text-gray-500">{label}</p>
      </div>
    );

    if (href) {
      return <Link href={href}>{content}</Link>;
    }

    return content;
  };

  return (
    <>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          icon={<Users className="w-6 h-6" />}
          label="Clientes"
          value={loading ? "..." : stats.clients.toString()}
          color="blue"
          href="/dashboard/clients"
        />
        <StatCard
          icon={<FolderKanban className="w-6 h-6" />}
          label="Proyectos"
          value={loading ? "..." : stats.projects.toString()}
          color="green"
          href="/dashboard/projects"
        />
        <StatCard
          icon={<FolderKanban className="w-6 h-6" />}
          label="Activos"
          value={loading ? "..." : stats.activeProjects.toString()}
          color="purple"
          href="/dashboard/projects?status=active"
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          label="Horas (mes)"
          value={loading ? "..." : `${stats.hoursThisMonth.toFixed(1)}h`}
          color="orange"
          href="/dashboard/time"
        />
        <StatCard
          icon={<DollarSign className="w-6 h-6" />}
          label="Por Cobrar"
          value={loading ? "..." : `$${stats.totalPending.toFixed(0)}`}
          color="orange"
          href="/dashboard/invoices"
        />
      </div>

      {/* Donate Banner */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center">
            <Heart className="w-6 h-6 text-amber-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 mb-1">
              ¿Te es útil freelanceos?
            </h3>
            <p className="text-sm text-gray-600 mb-3">
              Este proyecto es 100% gratuito y sin límites. Si te ahorra tiempo,
              considera apoyar con un cafecito ☕
            </p>
            <a
              href="https://ko-fi.com/webwardlabs"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-600 transition"
            >
              <Heart className="w-4 h-4" />
              Donar en Ko-fi
            </a>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Proyectos Recientes</h2>
            <Link
              href="/dashboard/projects"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Cargando...</p>
          ) : recentProjects.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay proyectos aún</p>
              <Link
                href="/dashboard/projects/new"
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                Crear el primero
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProjects.map((project) => (
                <Link
                  key={project.id}
                  href={`/dashboard/projects/${project.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center">
                      <FolderKanban className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{project.name}</p>
                      {project.clientName && (
                        <p className="text-xs text-gray-500">{project.clientName}</p>
                      )}
                    </div>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(project.status)}`}>
                    {getStatusLabel(project.status)}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Clients */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Clientes Recientes</h2>
            <Link
              href="/dashboard/clients"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Cargando...</p>
          ) : recentClients.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay clientes aún</p>
              <Link
                href="/dashboard/clients/new"
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                Agregar el primero
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentClients.map((client) => (
                <Link
                  key={client.id}
                  href={`/dashboard/clients/${client.id}`}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-blue-600 font-medium text-sm">
                      {client.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{client.name}</p>
                    {client.company && (
                      <p className="text-xs text-gray-500">{client.company}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Invoices */}
        <div className="bg-white rounded-xl border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Facturas Recientes</h2>
            <Link
              href="/dashboard/invoices"
              className="text-sm text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Ver todos <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {loading ? (
            <p className="text-gray-500 text-center py-4">Cargando...</p>
          ) : recentInvoices.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No hay facturas aún</p>
              <Link
                href="/dashboard/invoices/new"
                className="text-sm text-blue-600 hover:text-blue-700 mt-2 inline-block"
              >
                Crear la primera
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((invoice) => (
                <Link
                  key={invoice.id}
                  href={`/dashboard/invoices/${invoice.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(invoice.dueDate).toLocaleDateString("es-CO")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">${invoice.amount.toFixed(2)}</p>
                    <span className={`inline-block px-2 py-0.5 text-xs rounded-full ${getInvoiceStatusColor(invoice.status)}`}>
                      {getInvoiceStatusLabel(invoice.status)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Charts Section */}
      <div className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Análisis y Métricas</h2>
          <div className="flex items-center gap-4">
            <ExportButton
              data={timeEntriesData}
              filename="registros-tiempo"
              label="Exportar Tiempo (CSV)"
            />
            <ExportButton
              data={invoicesData}
              filename="facturas"
              label="Exportar Facturas (CSV)"
            />
          </div>
        </div>
        <DashboardCharts {...chartData} />
      </div>
    </>
  );
}

function getInvoiceStatusColor(status: string) {
  switch (status) {
    case "paid": return "bg-green-100 text-green-700";
    case "sent": return "bg-blue-100 text-blue-700";
    case "overdue": return "bg-red-100 text-red-700";
    case "canceled": return "bg-gray-100 text-gray-500";
    default: return "bg-gray-100 text-gray-700";
  }
}

function getInvoiceStatusLabel(status: string) {
  switch (status) {
    case "draft": return "Borrador";
    case "sent": return "Enviada";
    case "paid": return "Pagada";
    case "overdue": return "Vencida";
    case "canceled": return "Cancelada";
    default: return status;
  }
}
