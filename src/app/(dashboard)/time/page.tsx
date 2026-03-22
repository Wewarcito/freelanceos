"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Play, Pause, Square, Plus, Trash2, Pencil, Calendar, FolderKanban } from "lucide-react";
import Link from "next/link";

interface TimeEntry {
  id: string;
  description: string | null;
  startTime: string;
  endTime: string | null;
  duration: number | null;
  billable: boolean;
  projectId: string | null;
  projectName: string | null;
  clientName: string | null;
}

interface Project {
  id: string;
  name: string;
}

interface TimerState {
  isRunning: boolean;
  startTime: Date | null;
  elapsed: number;
  description: string;
  projectId: string;
}

export default function TimePage() {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  
  const [timer, setTimer] = useState<TimerState>({
    isRunning: false,
    startTime: null,
    elapsed: 0,
    description: "",
    projectId: "",
  });
  
  const [form, setForm] = useState({
    description: "",
    date: new Date().toISOString().split("T")[0],
    startTime: "09:00",
    endTime: "10:00",
    projectId: "",
    billable: true,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchData();
    
    const savedTimer = localStorage.getItem("freelanceos_timer");
    if (savedTimer) {
      const parsed = JSON.parse(savedTimer);
      if (parsed.isRunning && parsed.startTime) {
        setTimer({
          ...parsed,
          startTime: new Date(parsed.startTime),
        });
      }
    }
    
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (timer.isRunning && timer.startTime) {
      intervalRef.current = setInterval(() => {
        const now = new Date();
        const elapsed = Math.floor((now.getTime() - timer.startTime!.getTime()) / 1000);
        setTimer(prev => ({ ...prev, elapsed }));
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    
    localStorage.setItem("freelanceos_timer", JSON.stringify({
      ...timer,
      startTime: timer.startTime?.toISOString(),
    }));
  }, [timer.isRunning, timer.startTime]);

  const fetchData = async () => {
    try {
      const [entriesRes, projectsRes] = await Promise.all([
        fetch("/api/time"),
        fetch("/api/projects"),
      ]);
      
      if (entriesRes.ok) {
        const entriesData = await entriesRes.json();
        setEntries(entriesData);
      }
      
      if (projectsRes.ok) {
        const projectsData = await projectsRes.json();
        setProjects(projectsData);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const startTimer = () => {
    setTimer(prev => ({
      ...prev,
      isRunning: true,
      startTime: new Date(),
      elapsed: 0,
    }));
  };

  const pauseTimer = () => {
    setTimer(prev => ({ ...prev, isRunning: false }));
  };

  const stopTimer = async () => {
    if (!timer.startTime) return;
    
    const endTime = new Date();
    const duration = Math.floor((endTime.getTime() - timer.startTime.getTime()) / 1000);
    
    try {
      await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: timer.description || "Tiempo registrado",
          startTime: timer.startTime.toISOString(),
          endTime: endTime.toISOString(),
          duration: duration,
          billable: true,
          projectId: timer.projectId || null,
        }),
      });
      
      setTimer({
        isRunning: false,
        startTime: null,
        elapsed: 0,
        description: "",
        projectId: "",
      });
      
      localStorage.removeItem("freelanceos_timer");
      fetchData();
    } catch (error) {
      console.error("Error saving time entry:", error);
    }
  };

  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const startDateTime = new Date(`${form.date}T${form.startTime}`);
    const endDateTime = new Date(`${form.date}T${form.endTime}`);
    const duration = Math.floor((endDateTime.getTime() - startDateTime.getTime()) / 1000);
    
    if (duration <= 0) {
      alert("La hora de fin debe ser posterior a la hora de inicio");
      return;
    }
    
    try {
      await fetch("/api/time", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          description: form.description || "Tiempo registrado",
          startTime: startDateTime.toISOString(),
          endTime: endDateTime.toISOString(),
          duration: duration,
          billable: form.billable,
          projectId: form.projectId || null,
        }),
      });
      
      setShowForm(false);
      setForm({
        description: "",
        date: new Date().toISOString().split("T")[0],
        startTime: "09:00",
        endTime: "10:00",
        projectId: "",
        billable: true,
      });
      fetchData();
    } catch (error) {
      console.error("Error saving time entry:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta entrada de tiempo?")) return;
    
    setDeletingId(id);
    try {
      await fetch(`/api/time/${id}`, { method: "DELETE" });
      setEntries(entries.filter(e => e.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    } finally {
      setDeletingId(null);
    }
  };

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDuration = (minutes: number | null) => {
    if (!minutes) return "-";
    const hrs = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
  };

  const formatDateTime = (date: string) => {
    return new Date(date).toLocaleString("es-CO", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const totalHoursThisWeek = entries
    .filter(e => {
      const entryDate = new Date(e.startTime);
      const now = new Date();
      const weekStart = new Date(now.setDate(now.getDate() - now.getDay()));
      weekStart.setHours(0, 0, 0, 0);
      return entryDate >= weekStart;
    })
    .reduce((acc, e) => acc + (e.duration || 0), 0) / 3600;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Control de Tiempo</h1>
          <p className="text-gray-600">
            {totalHoursThisWeek.toFixed(1)} horas esta semana
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          <Plus className="w-4 h-4" />
          Registro Manual
        </button>
      </div>

      {/* Timer Card */}
      <div className="bg-white rounded-xl border p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
              timer.isRunning ? "bg-green-100" : "bg-gray-100"
            }`}>
              <Clock className={`w-6 h-6 ${timer.isRunning ? "text-green-600" : "text-gray-600"}`} />
            </div>
            <div>
              <p className="text-sm text-gray-500">Timer</p>
              <p className={`text-3xl font-mono font-bold ${timer.isRunning ? "text-green-600" : "text-gray-900"}`}>
                {formatTime(timer.elapsed)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {!timer.isRunning ? (
              <button
                onClick={startTimer}
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition"
              >
                <Play className="w-4 h-4" />
                Iniciar
              </button>
            ) : (
              <>
                <button
                  onClick={pauseTimer}
                  className="inline-flex items-center gap-2 bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition"
                >
                  <Pause className="w-4 h-4" />
                  Pausar
                </button>
                <button
                  onClick={stopTimer}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition"
                >
                  <Square className="w-4 h-4" />
                  Detener
                </button>
              </>
            )}
          </div>
        </div>

        {/* Timer options */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
            <input
              type="text"
              value={timer.description}
              onChange={(e) => setTimer({ ...timer, description: e.target.value })}
              placeholder="¿En qué estás trabajando?"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
            <select
              value={timer.projectId}
              onChange={(e) => setTimer({ ...timer, projectId: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Sin proyecto</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Manual Entry Form */}
      {showForm && (
        <div className="bg-white rounded-xl border p-6">
          <h3 className="font-semibold text-gray-900 mb-4">Registro Manual</h3>
          <form onSubmit={handleManualSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fecha</label>
                <input
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora inicio</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Hora fin</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Proyecto</label>
                <select
                  value={form.projectId}
                  onChange={(e) => setForm({ ...form, projectId: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="">Sin proyecto</option>
                  {projects.map((p) => (
                    <option key={p.id} value={p.id}>{p.name}</option>
                  ))}
                </select>
              </div>
              <div className="flex items-center">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={form.billable}
                    onChange={(e) => setForm({ ...form, billable: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm text-gray-700">Facturable</span>
                </label>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Descripción</label>
              <input
                type="text"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Descripción del trabajo"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Guardar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Time Entries List */}
      <div className="bg-white rounded-xl border overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="font-semibold text-gray-900">Registros de Tiempo</h3>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <p className="text-gray-500">Cargando...</p>
          </div>
        ) : entries.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Sin registros de tiempo</h3>
            <p className="text-gray-500">Inicia el timer o crea un registro manual</p>
          </div>
        ) : (
          <div className="divide-y">
            {entries.map((entry) => (
              <div key={entry.id} className="p-4 hover:bg-gray-50 transition">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {entry.description || "Sin descripción"}
                        </p>
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDateTime(entry.startTime)}
                          </span>
                          {entry.projectName && (
                            <span className="flex items-center gap-1">
                              <FolderKanban className="w-3 h-3" />
                              {entry.projectName}
                            </span>
                          )}
                          {entry.billable && (
                            <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded text-xs">
                              Facturable
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-lg font-mono font-semibold text-gray-900">
                      {formatDuration(entry.duration ? Math.floor(entry.duration / 60) : null)}
                    </span>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      disabled={deletingId === entry.id}
                      className="p-2 text-gray-400 hover:text-red-600 transition disabled:opacity-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
