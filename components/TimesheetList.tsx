"use client";

import { useState } from "react";
import { TimesheetEntry } from "@/lib/types";
import { Plus, MoreVertical, Edit, Trash2 } from "lucide-react";

interface TimesheetListProps {
  entries: TimesheetEntry[];
  onEdit: (entry: TimesheetEntry) => void;
  onDelete: (id: string) => void;
  onAddTask: (date: string) => void;
}

export default function TimesheetList({
  entries,
  onEdit,
  onDelete,
  onAddTask,
}: TimesheetListProps) {
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  // Group entries by date
  const groupedByDate = entries.reduce((acc, entry) => {
    const dateKey = entry.date;
    if (!acc[dateKey]) {
      acc[dateKey] = [];
    }
    acc[dateKey].push(entry);
    return acc;
  }, {} as Record<string, TimesheetEntry[]>);

  // Get all unique dates and sort them
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => 
    new Date(a).getTime() - new Date(b).getTime()
  );

  // Calculate total hours
  const totalHours = entries.reduce((sum, entry) => sum + (entry.hours || 0), 0);
  const targetHours = 40; // Default target
  const progressPercentage = Math.min((totalHours / targetHours) * 100, 100);

  // Format date for display (e.g., "Jan 21")
  const formatDayDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  // Format date range for header (e.g., "21 - 26 January, 2024")
  const getDateRange = () => {
    if (sortedDates.length === 0) return "";
    const firstDate = new Date(sortedDates[0]);
    const lastDate = new Date(sortedDates[sortedDates.length - 1]);
    
    const firstDay = firstDate.getDate();
    const lastDay = lastDate.getDate();
    const month = firstDate.toLocaleDateString("en-US", { month: "long" });
    const year = firstDate.getFullYear();
    
    return `${firstDay} - ${lastDay} ${month}, ${year}`;
  };

  // Get week dates (Monday to Friday for the current week)
  const getWeekDates = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const diff = today.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust to Monday
    const monday = new Date(today.setDate(diff));
    
    const weekDates = [];
    for (let i = 0; i < 5; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      weekDates.push(date.toISOString().split("T")[0]);
    }
    return weekDates;
  };

  const weekDates = getWeekDates();

  const toggleMenu = (id: string) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  const handleEdit = (entry: TimesheetEntry) => {
    setOpenMenuId(null);
    onEdit(entry);
  };

  const handleDelete = (id: string) => {
    setOpenMenuId(null);
    onDelete(id);
  };

  return (
    <div className="space-y-6">
      {/* Progress Bar */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-700">This week&apos;s timesheet</span>
          <span className="text-sm font-semibold text-gray-900">
            {totalHours}/{targetHours} hrs
          </span>
        </div>
        <div className="text-xs text-gray-500 mb-3">{getDateRange()}</div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-orange-500 h-2.5 rounded-full transition-all"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="text-xs text-gray-500 mt-1">{Math.round(progressPercentage)}%</div>
      </div>

      {/* Daily Tasks */}
      <div className="space-y-6">
        {weekDates.map((date) => {
          const dayEntries = groupedByDate[date] || [];
          const dayDate = new Date(date);
          const dayName = dayDate.toLocaleDateString("en-US", { weekday: "short" });
          const dayNumber = dayDate.getDate();
          const monthName = dayDate.toLocaleDateString("en-US", { month: "short" });

          return (
            <div key={date} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {dayName}, {monthName} {dayNumber}
                </h3>
              </div>

              <div className="space-y-3">
                {dayEntries.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="flex-1 flex items-center gap-4">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {entry.description || entry.taskName || "Task"}
                        </p>
                      </div>
                      <div className="text-sm text-gray-600">
                        {entry.hours || 0} hrs
                      </div>
                      <div>
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                          {entry.project || entry.status || "Project"}
                        </span>
                      </div>
                    </div>

                    <div className="relative ml-4">
                      <button
                        onClick={() => toggleMenu(entry.id)}
                        className="p-1 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        aria-label="More options"
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>

                      {openMenuId === entry.id && (
                        <>
                          <div
                            className="fixed inset-0 z-10"
                            onClick={() => setOpenMenuId(null)}
                          ></div>
                          <div className="absolute right-0 mt-2 w-32 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-20">
                            <div className="py-1">
                              <button
                                onClick={() => handleEdit(entry)}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(entry.id)}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </button>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => onAddTask(date)}
                  className="w-full flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition"
                >
                  <Plus className="h-4 w-4" />
                  Add new task
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {entries.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg border border-gray-200">
          <p className="text-sm text-gray-500">No timesheet entries found.</p>
          <p className="text-sm text-gray-500 mt-1">
            Click &quot;Add new task&quot; to get started.
          </p>
        </div>
      )}
    </div>
  );
}
