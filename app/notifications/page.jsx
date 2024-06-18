'use client'
import React, { useState } from "react"
import TeacherNotification from "@/components/teacherNotification"
import StudentNotification from "@/components/studentNotification"
import { useSession } from "next-auth/react"

const page = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  return (
    <div>
      {user?.isTeacher ? <TeacherNotification /> : <StudentNotification />}
    </div>
  )
}

export default page
