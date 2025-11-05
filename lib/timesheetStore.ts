import { TimesheetEntry } from "@/lib/types";

// Shared in-memory storage for demo purposes
// In a real app, this would be a database
let timesheets: TimesheetEntry[] = [
  {
    id: "1",
    weekNumber: 1,
    date: "2025-01-06",
    status: "submitted",
    hours: 40,
    description: "Week 1 timesheet",
  },
  {
    id: "2",
    weekNumber: 2,
    date: "2025-01-13",
    status: "approved",
    hours: 40,
    description: "Week 2 timesheet",
  },
  {
    id: "3",
    weekNumber: 3,
    date: "2025-01-20",
    status: "draft",
    hours: 35,
    description: "Week 3 timesheet",
  },
];

export function getTimesheets(): TimesheetEntry[] {
  return timesheets;
}

export function addTimesheet(entry: TimesheetEntry): TimesheetEntry {
  timesheets.push(entry);
  return entry;
}

export function updateTimesheet(id: string, updates: Partial<TimesheetEntry>): TimesheetEntry | null {
  const index = timesheets.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return null;
  }
  timesheets[index] = { ...timesheets[index], ...updates };
  return timesheets[index];
}

export function deleteTimesheet(id: string): boolean {
  const index = timesheets.findIndex((entry) => entry.id === id);
  if (index === -1) {
    return false;
  }
  timesheets.splice(index, 1);
  return true;
}

