"use client"
import React, { useEffect, useState } from "react"
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card"
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import axios from "axios"
import moment from "moment"

import { useSession } from "next-auth/react"
import Link from "next/link"

const formatDate = (isoDate) => {
  return moment(isoDate).format("MMM DD, YYYY")
}

const StudentMain = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const [exams, setExams] = useState([])
  const [grades, setGrades] = useState([])

  useEffect(() => {
    getExams()
    getStudentGrades()
  }, [])

  const getStudentGrades = async () => {
    try {
      const response = await axios.get(`/api/grade?studentId=${user?._id}`)
      setGrades(response.data.grades)
      console.log(response.data.grades);
    } catch (error) {}
  }

  const getExams = async () => {
    try {
      const response = await axios.get("/api/exam")
      const allExams = response.data.exams


      // const updatedExams = await Promise.all(
      //   allExams.map(async (exam) => {
      //     // Find the status for the current user
      //     if(exam.attendee){
      //       const attendee = exam.attendees.find(att => att.user.toString() === user._id.toString())
      //       const status = attendee ? attendee.status : 'Upcoming' // Default to 'Upcoming' if no status found
      //       return {
      //         ...exam,
      //         userStatus: status
      //       }
      //     }else{
      //       return exam
      //     }
      //   })
      // )

      // Filter exams to keep only upcoming ones
      const upcomingExams = allExams.filter((exam) =>
        moment(exam.date).isAfter(moment())
      )

      setExams(upcomingExams)
    } catch (error) {
      console.error("Error fetching exams:", error)
    }
  }

  return (
    <main className='flex-1 overflow-auto'>
      <div className='grid gap-6 p-6 md:p-10'>
        <div className='grid grid-cols-1 gap-6'>
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Exams</CardTitle>
              <CardDescription>
                View the details of your upcoming exams.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Exam</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead />
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {exams?.map((exam) => (
                    <TableRow key={exam._id}>
                      <TableCell className='font-medium'>{exam.name}</TableCell>
                      <TableCell>{formatDate(exam.date)}</TableCell>
                      <TableCell>{exam.duration} minutes</TableCell>
                      <TableCell>
                        <Badge variant='success'>
                          {exam.attendees
                            .map((attendee) => {
                              if (attendee.user === user._id) {
                                return attendee.status
                              }
                              return null
                            })
                            .find((status) => status !== null) || "Upcoming"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {! grades.some((grade) => grade.exam._id === exam._id) && (
                          <Link href={`/examination?id=${exam._id}`}>
                            <Button size='sm' variant='outline'>
                              Start Exam
                            </Button>
                          </Link>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Grades</CardTitle>
              <CardDescription>View your latest exam grades.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid gap-4'>
                {grades?.map((grade) => (
                  <div
                    key={grade._id}
                    className='flex items-center justify-between'>
                    <div>
                      <div className='font-medium'>{grade.exam?.name}</div>
                      <div className='text-sm text-gray-500 dark:text-gray-400'>
                        Grade: {grade.grade}%
                      </div>
                    </div>
                    <Button size='sm' variant='outline'>
                      View
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default StudentMain
