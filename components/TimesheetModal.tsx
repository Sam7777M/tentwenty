"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { X } from "lucide-react";
import { TimesheetEntry, TimesheetFormData } from "@/lib/types";

const timesheetSchema = z.object({
  weekNumber: z.number().min(1).max(52, "Week number must be between 1 and 52"),
  date: z.string().min(1, "Date is required"),
  status: z.enum(["draft", "submitted", "approved", "rejected"]),
  hours: z.number().min(0).max(168).optional(),
  description: z.string().optional(),
  project: z.string().optional(),
  taskName: z.string().optional(),
});

type TimesheetFormValues = z.infer<typeof timesheetSchema>;

interface TimesheetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: TimesheetFormData) => Promise<void>;
  entry?: TimesheetEntry | null;
  defaultDate?: string | null;
}

export default function TimesheetModal({
  isOpen,
  onClose,
  onSave,
  entry,
  defaultDate,
}: TimesheetModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm<TimesheetFormValues>({
    resolver: zodResolver(timesheetSchema),
    defaultValues: {
      weekNumber: entry?.weekNumber || 1,
      date: entry?.date || defaultDate || new Date().toISOString().split("T")[0],
      status: entry?.status || "draft",
      hours: entry?.hours || 0,
      description: entry?.description || "",
      project: entry?.project || "",
      taskName: entry?.taskName || "",
    },
  });

  useEffect(() => {
    if (entry) {
      setValue("weekNumber", entry.weekNumber);
      setValue("date", entry.date);
      setValue("status", entry.status);
      setValue("hours", entry.hours || 0);
      setValue("description", entry.description || "");
      setValue("project", entry.project || "");
      setValue("taskName", entry.taskName || "");
    } else {
      const dateToUse = defaultDate || new Date().toISOString().split("T")[0];
      reset({
        weekNumber: 1,
        date: dateToUse,
        status: "draft",
        hours: 0,
        description: "",
        project: "",
        taskName: "",
      });
    }
  }, [entry, defaultDate, setValue, reset]);

  if (!isOpen) return null;

  const onSubmit = async (data: TimesheetFormValues) => {
    setIsSubmitting(true);
    setError("");

    try {
      await onSave({
        weekNumber: data.weekNumber,
        date: data.date,
        status: data.status,
        hours: data.hours,
        description: data.description,
        project: data.project,
        taskName: data.taskName,
      });
      reset();
      onClose();
    } catch (err) {
      setError("Failed to save timesheet. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={onClose}
        ></div>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900">
                {entry ? "Edit Timesheet" : "Add Timesheet"}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            {error && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label
                  htmlFor="weekNumber"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Week Number *
                </label>
                <input
                  {...register("weekNumber", { valueAsNumber: true })}
                  type="number"
                  id="weekNumber"
                  min="1"
                  max="52"
                  className="block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none placeholder:text-gray-400"
                />
                {errors.weekNumber && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.weekNumber.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="date"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Date *
                </label>
                <input
                  {...register("date")}
                  type="date"
                  id="date"
                  className="block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none"
                />
                {errors.date && (
                  <p className="mt-1 text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status *
                </label>
                <select
                  {...register("status")}
                  id="status"
                  className="block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none"
                >
                  <option value="draft">Draft</option>
                  <option value="submitted">Submitted</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
                {errors.status && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.status.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="hours"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Hours
                </label>
                <input
                  {...register("hours", { valueAsNumber: true })}
                  type="number"
                  id="hours"
                  min="0"
                  max="168"
                  className="block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none placeholder:text-gray-400"
                />
                {errors.hours && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.hours.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="taskName"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Task Name
                </label>
                <input
                  {...register("taskName")}
                  type="text"
                  id="taskName"
                  className="block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none placeholder:text-gray-400"
                  placeholder="e.g., Homepage Development"
                />
                {errors.taskName && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.taskName.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="project"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Project
                </label>
                <input
                  {...register("project")}
                  type="text"
                  id="project"
                  className="block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none placeholder:text-gray-400"
                  placeholder="Project name"
                />
                {errors.project && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.project.message}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Description
                </label>
                <textarea
                  {...register("description")}
                  id="description"
                  rows={3}
                  className="block w-full px-3 py-2 bg-white text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:bg-white outline-none placeholder:text-gray-400"
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.description.message}
                  </p>
                )}
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Save"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

