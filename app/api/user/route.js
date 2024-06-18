import { NextResponse } from 'next/server';
import User from '@/models/User';


// Create a new user
export async function POST(request) {
  try {
    const data = await request.json();
    const newUser = await User.create(data);

    return NextResponse.json({ newUser }, { status: 201 });
  } catch (error) {
    console.log('error.message', error.message);
    return NextResponse.json({ error: error.message }, { status: 409 });
  }
}

// Get all users
export async function GET() {
  try {
    const users = await User.find({ isTeacher: false });

    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// Delete a user
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 500 });
    }
    const deletedUser = await User.findByIdAndDelete(id);
    if (!deletedUser) {
      throw new Error(`User with ID ${id} not found`);
    }
    return NextResponse.json(
      { message: `User with ID ${id} deleted successfully` },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
