import { NextResponse } from "next/server";
import Notification from "@/models/Notification";

export async function POST(request) {
  try {
    const data = await request.json();
    const newNotification = await Notification.create(data);

    return NextResponse.json({ newNotification }, { status: 201 });
  } catch (error) {
    console.log("error.message", error.message);
    return NextResponse.json({ error: error.message }, { status: 409 });
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const target = searchParams.get("target");
    const userId = searchParams.get("userId");

    let notifications;
    if (target === "specific" && userId) {
      notifications = await Notification.find({ target: "specific", studentId: userId });
    } else {
      notifications = await Notification.find({ target: "everyone" });
    }

    return NextResponse.json({ notifications }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "Notification ID is required" }, { status: 500 });
    }
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      throw new Error(`Notification with ID ${id} not found`);
    }
    return NextResponse.json(
      { message: `Notification with ID ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
