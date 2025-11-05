import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { updateTimesheet, deleteTimesheet } from "@/lib/timesheetStore";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { weekNumber, date, status, hours, description, project, taskName } = body;

    // Validate required fields
    if (!weekNumber || !date || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const updated = updateTimesheet(id, {
      weekNumber: Number(weekNumber),
      date,
      status,
      hours: hours ? Number(hours) : undefined,
      description,
      project,
      taskName,
    });

    if (!updated) {
      return NextResponse.json(
        { error: "Timesheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: updated });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update timesheet" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const deleted = deleteTimesheet(id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Timesheet not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Timesheet deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete timesheet" },
      { status: 500 }
    );
  }
}

