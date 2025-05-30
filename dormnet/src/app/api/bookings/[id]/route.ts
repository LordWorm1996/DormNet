import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/utils/db";
import Reservation from "@/models/Reservation";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    await connectDB();

    const deleted = await Reservation.findByIdAndDelete(params.id);

    if (!deleted) {
      return NextResponse.json(
        { error: "Reservation not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting reservation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
