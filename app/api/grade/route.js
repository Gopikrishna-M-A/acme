import { NextResponse } from "next/server";
import Grade from "@/models/Grade";

// Create a new grade
export async function POST(request) {
  try {
    const data = await request.json();
    const newGrade = await Grade.create(data);

    return NextResponse.json({ newGrade }, { status: 201 });
  } catch (error) {
    console.error("Error creating grade:", error.message);
    return NextResponse.json({ error: error.message }, { status: 409 });
  }
}

export async function GET(request) {
    try {
      const { searchParams } = new URL(request.url);
      const studentId = searchParams.get("studentId");
      const examId = searchParams.get("examId");
      let query = {};
  
      if (studentId) {
        query.student = studentId;
      }
  
      if (examId) {
        query.exam = examId;
      }
  
      let grades;
      if (Object.keys(query).length === 0) {
        // If no parameters provided, fetch all grades
        grades = await Grade.find()
          .populate("student", "name") // Populate student details
          .populate("exam", "name date"); // Populate exam details
      } else {
        // If studentId or examId is provided, filter grades
        grades = await Grade.find(query)
          .populate("student", "name") // Populate student details
          .populate("exam", "name date"); // Populate exam details
      }
  
      return NextResponse.json({ grades }, { status: 200 });
    } catch (error) {
      console.error("Error fetching grades:", error.message);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }

// Update an existing grade
export async function PUT(request) {
  try {
    const { id } = request.query;
    const data = await request.json();
    const updatedGrade = await Grade.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!updatedGrade) {
      return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    }

    return NextResponse.json({ updatedGrade }, { status: 200 });
  } catch (error) {
    console.error("Error updating grade:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a grade
export async function DELETE(request) {
  try {
    const { id } = request.query;
    const deletedGrade = await Grade.findByIdAndDelete(id);

    if (!deletedGrade) {
      return NextResponse.json({ error: "Grade not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Grade deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting grade:", error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
