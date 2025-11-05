import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { TimesheetEntry } from "@/lib/types";
import { getTimesheets, addTimesheet } from "@/lib/timesheetStore";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const timesheets = getTimesheets();
    return NextResponse.json({ data: timesheets });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch timesheets" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { weekNumber, date, status, hours, description, project, taskName } = body;

    // Validate required fields
    if (!weekNumber || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const newEntry: TimesheetEntry = {
      id: Date.now().toString(),
      weekNumber: Number(weekNumber),
      date,
      status,
      hours: hours ? Number(hours) : undefined,
      description,
      project,
      taskName,
    };

    const savedEntry = addTimesheet(newEntry);

    return NextResponse.json({ data: savedEntry }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create timesheet" },
      { status: 500 }
    );
  }
}

