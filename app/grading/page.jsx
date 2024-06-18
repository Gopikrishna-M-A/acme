import React from 'react'
import { Button } from "@/components/ui/button"
import { TableHead, TableRow, TableHeader, TableCell, TableBody, Table } from "@/components/ui/table"
import { Textarea } from "@/components/ui/textarea"
import {
    CardTitle,
    CardDescription,
    CardHeader,
    CardContent,
    Card,
  } from "@/components/ui/card";


const page = () => {
  return (
    <main className="flex-1 overflow-y-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle>Create Notification</CardTitle>
          </CardHeader>
          <CardContent>
          <div className="grid gap-6">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Exam Submissions</h2>
                <Button size="sm">Grade Exam</Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student Name</TableHead>
                      <TableHead>Exam Name</TableHead>
                      <TableHead>Score</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell className="font-medium">John Doe</TableCell>
                      <TableCell>Math Exam</TableCell>
                      <TableCell>90</TableCell>
                      <TableCell>A</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="link">
                          Review
                        </Button>
                        <Button className="text-red-500" size="sm" variant="link">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Jane Smith</TableCell>
                      <TableCell>English Exam</TableCell>
                      <TableCell>85</TableCell>
                      <TableCell>B+</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="link">
                          Review
                        </Button>
                        <Button className="text-red-500" size="sm" variant="link">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell className="font-medium">Bob Johnson</TableCell>
                      <TableCell>Science Exam</TableCell>
                      <TableCell>75</TableCell>
                      <TableCell>C</TableCell>
                      <TableCell className="text-right">
                        <Button size="sm" variant="link">
                          Review
                        </Button>
                        <Button className="text-red-500" size="sm" variant="link">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Student Exam Details</h2>
                <div className="flex items-center gap-2">
                  <Button size="sm">Grade Manually</Button>
                  <Button size="sm">Auto-Grade</Button>
                </div>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-lg font-bold">Student Name</h3>
                      <p>John Doe</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Exam Name</h3>
                      <p>Math Exam</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Exam Score</h3>
                      <p>90</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Exam Grade</h3>
                      <p>A</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Feedback</h3>
                      <Textarea placeholder="Enter feedback for the student" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">Analytics</h2>
                <Button size="sm">View Full Report</Button>
              </div>
              <div className="border rounded-lg overflow-hidden">
                <div className="p-6">
                  <div className="grid gap-4">
                    <div>
                      <h3 className="text-lg font-bold">Average Exam Score</h3>
                      <p>85</p>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Top Performing Students</h3>
                      <ul className="space-y-2">
                        <li>1. John Doe - 90</li>
                        <li>2. Jane Smith - 85</li>
                        <li>3. Bob Johnson - 75</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Grading Efficiency</h3>
                      <p>92% of exams graded within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default page