export interface TimesheetEntry {
  id: string;
  weekNumber: number;
  date: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  hours?: number;
  description?: string;
  project?: string;
  taskName?: string;
}

export interface TimesheetFormData {
  weekNumber: number;
  date: string;
  status: "draft" | "submitted" | "approved" | "rejected";
  hours?: number;
  description?: string;
  project?: string;
  taskName?: string;
}

