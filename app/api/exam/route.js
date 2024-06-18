import { NextResponse } from "next/server"
import Exam from "@/models/Exam"

export async function POST(request) {
  try {
    const data = await request.json()
    const newExam = await Exam.create(data)

    return NextResponse.json({ newExam }, { status: 201 })
  } catch (error) {
    console.log("error.message", error.message)
    return NextResponse.json({ error: error.message }, { status: 409 })
  }
}

export async function GET(request) {
  const { searchParams } = new URL(request.url)
  const examId = searchParams.get("id")
  try {
    if (!examId) {
      const exams = await Exam.find({})
      return NextResponse.json({ exams }, { status: 200 })
    }

    const exam = await Exam.findById(examId).populate("questions")
    // console.log("exam",exam);

    if (!exam) {
      return NextResponse.json({ error: "Exam not found" }, { status: 404 })
    }

    return NextResponse.json({ exam }, { status: 200 })
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function DELETE(request) {
  try { 
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json(
        { error: "Exam ID is required" },
        { status: 500 }
      )
    }
    const deletedExam = await Exam.findByIdAndDelete(id)
    if (!deletedExam) {
      throw new Error(`Exam with ID ${id} not found`)
    }
    return NextResponse.json(
      { message: `Exam with ID ${id} deleted successfully` },
      { status: 200 }
    )
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('id');
    const { userId, status } = await request.json();

    console.log("examId", examId);
    console.log("userId", userId);
    console.log("status", status);

    if (!examId || !userId || !status) {
      return NextResponse.json({ error: 'Exam ID, User ID, and Status are required' }, { status: 400 });
    }

    const exam = await Exam.findById(examId);

    if (!exam) {
      return NextResponse.json({ error: 'Exam not found' }, { status: 404 });
    }

    let attendee = exam.attendees.find(a => a.user.toString() === userId);

    if (status === 'Started') {
      if (!attendee) {
        // If attendee doesn't exist, create a new one
        attendee = { user: userId, status };
        exam.attendees.push(attendee);
      }
    } else {
      if (!attendee) {
        return NextResponse.json({ error: 'Attendee not found for this exam' }, { status: 404 });
      }
      // Update status for non-"started" status
      attendee.status = status;
    }

    // Save the updated exam document
    await exam.save();

    return NextResponse.json({ message: `Status updated for user ${userId} in exam ${examId}` }, { status: 200 });
  } catch (error) {
    console.error('Error updating status:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}