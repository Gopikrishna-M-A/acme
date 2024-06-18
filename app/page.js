"use client"
import React, { useState } from "react"
import StudentMain from "@/components/studentMain"
import TeacherMain from "@/components/teacherMain"
import { useSession, signIn, signOut } from "next-auth/react";
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button";

const page = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  return (
    <div className="w-full">
      {user ? (
        user?.isTeacher ? (
          <TeacherMain />
        ) : (
          <StudentMain />
        )
      ) : (
    <div className="h-full flex justify-center items-start p-10">
          <Card>
        <CardHeader>
          <CardTitle>Login to Continue</CardTitle>
        </CardHeader>
        <CardContent>
          <CardDescription>
            You are not logged in. Please log in to continue.
          </CardDescription>
        </CardContent>
        <CardFooter>
        <Button onClick={signIn}>Login</Button>
        </CardFooter>
      </Card>
    </div>
      )}
    </div>
  )
}

export default page
