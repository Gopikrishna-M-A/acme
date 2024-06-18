"use client"
import React, { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table"

const page = () => {
  const [students, setStudents] = useState([])

  const getStudents = async () => {
    try {
      const response = await axios.get("/api/user")
      setStudents(response.data.users)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }

  useEffect(() => {
    getStudents()
  }, [])

  const deleteStudent = async (studentId) => {
    try {
      const response = await axios.delete(`/api/user?id=${studentId}`)
      console.log("Student deleted:", response.data.message)
      getStudents() // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting student:", error)
    }
  }

  const renderGrade = (grade) => {
    switch (grade) {
      case "A":
        return <span className='text-green-500'>{grade}</span>
      case "B+":
        return <span className='text-blue-500'>{grade}</span>
      case "C":
        return <span className='text-yellow-500'>{grade}</span>
      default:
        return <span>{grade}</span>
    }
  }


  return (
    <main className='flex-1 p-4 md:p-6'>
      <div className='grid gap-6'>
        <div className='grid gap-4'>
          <div className='flex items-center justify-between'>
            <h2 className='text-2xl font-bold'>Student List</h2>
          </div>
          <div className='border rounded-lg overflow-hidden'>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Grade</TableHead>
                  <TableHead className='text-end'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students?.map((student) => (
                  <TableRow key={student._id}>
                    <TableCell className='font-medium'>
                      {student.name}
                    </TableCell>
                    <TableCell>{student.email}</TableCell>
                    <TableCell>{renderGrade(student?.grade)}</TableCell>
                    <TableCell className='text-right'>
                      <Button
                        onClick={() => deleteStudent(student._id)}
                        size='sm'
                        variant='outline'>
                        <TrashIcon className='w-4 h-4' />
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </main>
  )
}

export default page

function TrashIcon(props) {
  return (
    <svg
      {...props}
      xmlns='http://www.w3.org/2000/svg'
      width='24'
      height='24'
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth='2'
      strokeLinecap='round'
      strokeLinejoin='round'>
      <path d='M3 6h18' />
      <path d='M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6' />
      <path d='M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2' />
    </svg>
  )
}
