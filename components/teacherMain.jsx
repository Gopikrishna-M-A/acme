import React, { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar"
import { CardTitle, CardDescription, CardHeader, CardContent, Card } from "@/components/ui/card"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import Link from 'next/link'
import axios from 'axios'

const TeacherMain = () => {
  const [students,setStudents] = useState()
  const getStudents = async () => {
    try {
      const response = await axios.get("/api/user")
      setStudents(response.data.users)
      console.log("res",response);
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  useEffect(() => {
    getStudents()
  }, [])
  return (
<main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Exams</CardTitle>
                <CardDescription>Create and manage exams for your students.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Link href='/exams'><Button variant="secondary">Create Exam</Button></Link>
                  <Link href='/exams'><Button variant="outline">View Exams</Button></Link>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Grading</CardTitle>
                <CardDescription>Grade exams manually or using the ChatGPT API.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-4">
                  <Link href='/grading'><Button variant="secondary">Grade Exams</Button></Link>
                  <Link href='/grading'><Button variant="outline">View Grades</Button></Link>
                </div>
              </CardContent>
            </Card>
            <Card>
  <CardHeader>
    <CardTitle>Questions</CardTitle>
    <CardDescription>Explore and manage questions for the aptitude test.</CardDescription>
  </CardHeader>
  <CardContent>
    <div className="flex flex-col space-y-4">
      <Link href="/questions"><Button variant="secondary">Add Question</Button></Link>
      <Link href="/questions"><Button variant="outline">View Questions</Button></Link>
    </div>
  </CardContent>
</Card>
          </div>
          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>Student Profiles</CardTitle>
                <CardDescription>View basic information about your students.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Grade</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students?.map((student)=>(
                      <TableRow key={student._id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Avatar>
                            <AvatarImage alt="Student Avatar" src={student.image} />
                            <AvatarFallback>JS</AvatarFallback>
                          </Avatar>
                          <span>{student.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{student.email}</TableCell>
                      <TableCell>{student?.grade}</TableCell>
                    </TableRow>
                    ))}
                    
                    
                    
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
  )
}

export default TeacherMain