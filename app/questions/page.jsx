'use client'
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import {
  SelectValue,
  SelectTrigger,
  SelectItem,
  SelectContent,
  Select,
} from "@/components/ui/select"
import {
  TableHead,
  TableRow,
  TableHeader,
  TableCell,
  TableBody,
  Table,
} from "@/components/ui/table"
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "@/components/ui/alert-dialog"
import { useEffect, useState } from "react"
import axios from "axios"

const page = () => {

    const [questions,setQuestions] = useState()
    const [question,setQuestion] = useState()
    const [optionA,setOptionA] = useState()
    const [optionB,setOptionB] = useState()
    const [optionC,setOptionC] = useState()
    const [optionD,setOptionD] = useState()
    const [subject,setSubject] = useState()
    const [mark,setMark] = useState()
    const [answer,setAnswer] = useState()
    // const [isDialogOpen, setIsDialogOpen] = useState(false)
    // const [deleteId, setDeleteId] = useState(null)

    useEffect(()=>{
        getQuestions()
    },[])

    const getQuestions = async () => {
        const response = await axios.get('/api/questions')
        setQuestions(response.data.questions);
    }


    const deleteQuestion = async (id) => {
        try {
          const response = await axios.delete(`/api/questions?id=${id}`)
          console.log("Questions deleted:", response.data.message)
          getQuestions()
        } catch (error) {
          console.error("Error deleting notification:", error)
        }
      }
    
    //   const handleConfirmDelete = () => {
    //     setIsDialogOpen(false)
    //     deleteQuestion()
    //   }
    

    const addQuestion = async () => {
        const newQuestion = {
            question,
            optionA,
            optionB,
            optionC,
            optionD,
            answer: answer === 'A' ? optionA : // If answer is 'A', use optionA
            answer === 'B' ? optionB : // If answer is 'B', use optionB
            answer === 'C' ? optionC : // If answer is 'C', use optionC
            answer === 'D' ? optionD : '', // If answer is 'D', use optionD
            mark,
            subject
        }

        axios.post('/api/questions',newQuestion).then((res)=>{
            console.log(res.data);
            getQuestions()
        }).catch((err)=>{
            console.log(err);
        })
        
    }



  return (
    <main className='flex-1 overflow-auto'>
      <div className='grid gap-6 p-6 md:p-10'>
        <div className='grid grid-cols-1 gap-6'>
          <Card className='pt-10'>
            <CardContent>
              <div className='grid gap-6'>
                <div className='grid gap-4'>
                  <div className='flex items-center justify-between'>
                      <CardTitle>Add New Question</CardTitle>
                    {/* <Button size='sm'>Create Question Paper</Button> */}
                  </div>
                  <div className='border rounded-lg overflow-hidden'>
                    <form className='p-6 space-y-4'>
                      <div className='grid gap-2'>
                        <Label htmlFor='question'>Question</Label>
                        <Textarea
                          id='question'
                          placeholder='Enter the question'
                          rows={3}
                          value={question}
                          onChange={(e)=>setQuestion(e.target.value)}
                        />
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='options'>Options</Label>
                        <div className='grid gap-2'>
                          <Input id='option1' placeholder='Option 1' value={optionA}  onChange={(e)=>setOptionA(e.target.value)}/>
                          <Input id='option2' placeholder='Option 2' value={optionB}  onChange={(e)=>setOptionB(e.target.value)}/>
                          <Input id='option3' placeholder='Option 3' value={optionC}  onChange={(e)=>setOptionC(e.target.value)}/>
                          <Input id='option4' placeholder='Option 4' value={optionD}  onChange={(e)=>setOptionD(e.target.value)}/>
                        </div>
                      </div>
                      <div className='grid gap-2'>
                        <Label htmlFor='answer'>Answer</Label>
                        <Select  onValueChange={(value)=>setAnswer(value)}>
                          <SelectTrigger>
                            <SelectValue placeholder='Select the correct answer' />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="A">Option 1</SelectItem>
                            <SelectItem value="B">Option 2</SelectItem>
                            <SelectItem value="C">Option 3</SelectItem>
                            <SelectItem value="D">Option 4</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className='grid gap-2'>
                        <Label htmlFor='marks'>Mark</Label>
                        <div className='grid gap-2'>
                          <Input value={mark}  onChange={(e)=>setMark(e.target.value)} id='marks' placeholder='mark' />
                        </div>
                      </div>

                      <div className='grid gap-2'>
                        <Label htmlFor='subject'>Subject</Label>
                        <div className='grid gap-2'>
                          <Input value={subject}  onChange={(e)=>setSubject(e.target.value)} id='subject' placeholder='subject' />
                        </div>
                      </div>

                      <div className='flex justify-end'>
                        <Button type='button' onClick={addQuestion}>Add Question</Button>
                      </div>
                    </form>
                  </div>
                </div>
                <div className='grid gap-4'>
                  <div className='flex items-center justify-between'>
                  <CardTitle>Question List</CardTitle>
                    {/* <Button size='sm'>Add Question</Button> */}
                  </div>
                  <div className='border rounded-lg overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Question</TableHead>
                          <TableHead>Options</TableHead>
                          <TableHead>Answer</TableHead>
                          <TableHead className='text-right'>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>

                        {questions?.map((question)=>(
                            <TableRow key={question._id}>
                          <TableCell className='font-medium'>
                            {question.question}
                          </TableCell>
                          <TableCell>
                            <ul className='space-y-1'>
                              <li>{question.optionA}</li>
                              <li>{question.optionB}</li>
                              <li>{question.optionC}</li>
                              <li>{question.optionD}</li>
                            </ul>
                          </TableCell>
                          <TableCell>{question.answer}</TableCell>
                          <TableCell className='text-right'>
                              {/* <Button size='sm' variant='link'>
                                Edit
                              </Button> */}
                              <Button
                                className='text-red-500'
                                size='sm'
                                variant='link'
                                onClick={() => {
                                    deleteQuestion(question._id)
                                }}>
                                Delete
                              </Button>
                              {/* <AlertDialog
                                open={isDialogOpen}
                                onOpenChange={setIsDialogOpen}>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Are you absolutely sure?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      This action cannot be undone. This will
                                      permanently delete the question.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel
                                      onClick={() => setIsDialogOpen(false)}>
                                      Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={handleConfirmDelete}>
                                      Continue
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog> */}
                            
                          </TableCell>
                        </TableRow>
                        ))}
                        
                        
                        
                      </TableBody>
                    </Table>
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
