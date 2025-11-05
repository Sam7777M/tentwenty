"use client";

import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Plus, LogOut, Calendar, LayoutGrid, List } from "lucide-react";
import TimesheetTable from "@/components/TimesheetTable";
import TimesheetList from "@/components/TimesheetList";
import TimesheetModal from "@/components/TimesheetModal";
import { TimesheetEntry, TimesheetFormData } from "@/lib/types";

type ViewMode = "table" | "list";

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [entries, setEntries] = useState<TimesheetEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<TimesheetEntry | null>(null);
  const [defaultDate, setDefaultDate] = useState<string | null>(null);
  const [error, setError] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("timesheetViewMode");
      return (saved === "table" || saved === "list") ? saved : "table";
    }
    return "table";
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("timesheetViewMode", viewMode);
    }
  }, [viewMode]);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchTimesheets();
    }
  }, [session]);

  const fetchTimesheets = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/timesheets");
      
      if (!response.ok) {
        throw new Error("Failed to fetch timesheets");
      }

      const result = await response.json();
      setEntries(result.data || []);
    } catch (err) {
      setError("Failed to load timesheets. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEntry(null);
    setDefaultDate(null);
    setIsModalOpen(true);
  };

  const handleAddTask = (date: string) => {
    setEditingEntry(null);
    setDefaultDate(date);
    setIsModalOpen(true);
  };

  const handleEdit = (entry: TimesheetEntry) => {
    setEditingEntry(entry);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this timesheet entry?")) {
      return;
    }

    try {
      const response = await fetch(`/api/timesheets/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete timesheet");
      }

      setEntries(entries.filter((entry) => entry.id !== id));
    } catch (err) {
      setError("Failed to delete timesheet. Please try again.");
    }
  };

  const handleSave = async (data: TimesheetFormData) => {
    try {
      if (editingEntry) {
        // Update existing entry
        const response = await fetch(`/api/timesheets/${editingEntry.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to update timesheet");
        }

        const result = await response.json();
        setEntries(
          entries.map((entry) =>
            entry.id === editingEntry.id ? result.data : entry
          )
        );
      } else {
        // Create new entry
        const response = await fetch("/api/timesheets", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error("Failed to create timesheet");
        }

        const result = await response.json();
        setEntries([...entries, result.data]);
      }

      setIsModalOpen(false);
      setEditingEntry(null);
    } catch (err) {
      throw err;
    }
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <h1 className="ml-3 text-xl font-semibold text-gray-900">
                Timesheet Management
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-700">
                {session.user?.email}
              </span>
              <button
                onClick={() => signOut({ callbackUrl: "/login" })}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Timesheet Entries</h2>
            <div className="flex items-center space-x-3">
              <div className="flex items-center bg-white border border-gray-300 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("table")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "table"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Table view"
                  title="Table view"
                >
                  <List className="h-5 w-5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition ${
                    viewMode === "list"
                      ? "bg-indigo-600 text-white"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                  aria-label="Grid view"
                  title="Grid view"
                >
                  <LayoutGrid className="h-5 w-5" />
                </button>
              </div>
              <button
                onClick={handleAdd}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Timesheet
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {viewMode === "table" ? (
            <div className="bg-white shadow rounded-lg overflow-hidden">
              <TimesheetTable
                entries={entries}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            </div>
          ) : (
            <div>
              <TimesheetList
                entries={entries}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onAddTask={handleAddTask}
              />
            </div>
          )}
        </div>
      </main>

      <TimesheetModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEntry(null);
          setDefaultDate(null);
        }}
        onSave={handleSave}
        entry={editingEntry}
        defaultDate={defaultDate}
      />
    </div>
  );
}

