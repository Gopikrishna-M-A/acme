import { NextResponse } from "next/server";
import Question from "@/models/Question";

export async function GET(request) {
  try {
    const questions = await Question.find();
    return NextResponse.json({ questions }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const data = await request.json();
    const newQuestion = await Question.create(data);
    return NextResponse.json({ newQuestion }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 409 });
  }
}

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }
    const deletedQuestion = await Question.findByIdAndDelete(id);
    if (!deletedQuestion) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return NextResponse.json({ message: `Question with ID ${id} deleted successfully` }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: "Question ID is required" }, { status: 400 });
    }
    const data = await request.json();
    const updatedQuestion = await Question.findByIdAndUpdate(id, data, { new: true });
    if (!updatedQuestion) {
      throw new Error(`Question with ID ${id} not found`);
    }
    return NextResponse.json({ updatedQuestion }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
