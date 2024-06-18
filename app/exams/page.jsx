"use client"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table"
import { useEffect, useState } from "react"
import { useSession, signIn, signOut } from "next-auth/react"
import axios from "axios"
import moment from "moment"
const formatDate = (isoDate) => {
  return moment(isoDate).format("DD-MM-YYYY")
}

const page = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const [examName, setExamName] = useState()
  const [examDesc, setExamDesc] = useState()
  const [examDate, setExamDate] = useState()
  const [examDuration, setExamDuration] = useState()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [questions,setQuestions] = useState()
  const [exams, setExams] = useState()
  const [selectedQuestions, setSelectedQuestions] = useState([])

  const isSelected = (questionId) => {
    return selectedQuestions.includes(questionId)
  }

  const toggleQuestionSelection = (questionId) => {
    if (isSelected(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId))
    } else {
      setSelectedQuestions([...selectedQuestions, questionId])
    }
  }

  const getExams = () => {
    axios.get("/api/exam").then((res) => {
      setExams(res.data.exams)
    }).catch((err)=>{
      console.log('exam err',err);
    })
  }
  const getQuestions = async () => {
    const response = await axios.get('/api/questions')
    setQuestions(response.data.questions);
}

  useEffect(() => {
    getExams()
    getQuestions()
  }, [])

  const createExam = async () => {
    try {
      const newExamData = {
        name: examName,
        description: examDesc,
        date: new Date(examDate),
        duration: parseInt(examDuration),
        createdBy: user._id,
        questions: selectedQuestions
      }
      console.log("newExamData",newExamData);
      const response = await axios.post("/api/exam", newExamData)
      console.log("Exam created:", response.data)
      getExams()
    } catch (error) {
      console.error("Error creating exam:", error)
    }
  }

  const deleteExam = async (examId) => {
    try {
      const response = await axios.delete(`/api/exam?id=${examId}`)
      console.log("Exam deleted:", response.data.message)
      getExams()
    } catch (error) {
      console.error("Error deleting exam:", error.response.data)
    }
  }

  const handleConfirmDelete = (examId) => {
    setIsDialogOpen(false)
    deleteExam(examId)
  }

  return (
    <main className='flex-1 overflow-y-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle className='hidden md:block'>Exams</CardTitle>
              <CardDescription className='hidden md:block'>
                Create and manage exams for your students.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div className='order-2 md:order-1'>
                  <h3 className='text-lg font-medium mb-4'>Create Exam</h3>
                  <form>
                    <div className='space-y-4'>
                      <div>
                        <Label htmlFor='exam-name'>Exam Name</Label>
                        <Input
                          id='exam-name'
                          placeholder='Enter exam name'
                          value={examName}
                          onChange={(e) => setExamName(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor='exam-description'>
                          Exam Description
                        </Label>
                        <Textarea
                          id='exam-description'
                          placeholder='Enter exam description'
                          value={examDesc}
                          onChange={(e) => setExamDesc(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor='exam-date'>Exam Date</Label>
                        <Input
                          id='exam-date'
                          type='date'
                          value={examDate}
                          onChange={(e) => setExamDate(e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor='exam-duration'>
                          Exam Duration (minutes)
                        </Label>
                        <Input
                          id='exam-duration'
                          type='number'
                          value={examDuration}
                          onChange={(e) => setExamDuration(e.target.value)}
                        />
                      </div>
                      <Button
                        onClick={createExam}
                        type='button'
                        variant='secondary'>
                        Create Exam
                      </Button>
                    </div>
                  </form>
                </div>
                <div className='order-1 md:order-2'>
                  <h3 className='text-lg font-medium mb-4'>Exams</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {exams?.map((exam) => (
                        <>
                          <TableRow>
                            <TableCell>{exam.name}</TableCell>
                            <TableCell>{formatDate(exam.date)}</TableCell>
                            <TableCell>{exam.duration} minutes</TableCell>
                            <TableCell>
                              <div className='flex items-center space-x-2'>
                                <Button size='sm' variant='outline'>
                                  <FilePenIcon className='w-4 h-4' />
                                  Edit
                                </Button>
                                <Button
                                  onClick={() => setIsDialogOpen(true)}
                                  size='sm'
                                  variant='outline'>
                                  <TrashIcon className='w-4 h-4' />
                                  Delete
                                </Button>

                                <AlertDialog
                                  open={isDialogOpen}
                                  onOpenChange={setIsDialogOpen}>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>
                                        Are you absolutely sure?
                                      </AlertDialogTitle>
                                      <AlertDialogDescription>
                                        This action cannot be undone. This will
                                        permanently delete your account and
                                        remove your data from our servers.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel
                                        onClick={() => setIsDialogOpen(false)}>
                                        Cancel
                                      </AlertDialogCancel>
                                      <AlertDialogAction
                                        onClick={() =>
                                          handleConfirmDelete(exam._id)
                                        }>
                                        Continue
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </TableCell>
                          </TableRow>
                        </>
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/*  */}
                      

                <div className='order-3'>
                  <h3 className='text-lg font-medium mb-4'>Questions</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Action</TableHead>
                        <TableHead>Question</TableHead>
                        <TableHead>Options</TableHead>
                        <TableHead>Answer</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                            {questions?.map((question) => (
                              <TableRow key={question._id} >
                                <TableCell>
                                  <input
                                    type="checkbox"
                                    checked={isSelected(question._id)}
                                    onChange={() => toggleQuestionSelection(question._id)}
                                  />
                                </TableCell>
                                <TableCell>{question.question}</TableCell>
                                <TableCell>{ <ul className='space-y-1'>
                              <li>{question.optionA}</li>
                              <li>{question.optionB}</li>
                              <li>{question.optionC}</li>
                              <li>{question.optionD}</li>
                            </ul>}</TableCell>
                                <TableCell>{question.answer}</TableCell>
                              </TableRow>
                            ))}
                    </TableBody>
                  </Table>
                </div>



                {/*  */}
                
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}

export default page

function FilePenIcon(props) {
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
      <path d='M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10' />
      <path d='M14 2v4a2 2 0 0 0 2 2h4' />
      <path d='M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z' />
    </svg>
  )
}

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
