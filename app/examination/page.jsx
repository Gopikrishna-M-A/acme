"use client"
import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import axios from "axios"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
} from "@/components/ui/card"

const page = () => {
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)
  const searchParams = useSearchParams()
  const examId = searchParams.get("id")

  const [exam, setExam] = useState()
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null) // 60 minutes in seconds
  const [isSubmitted, setIsSubmitted] = useState(false)

  useEffect(() => {
    getExam()
    axios.patch(`/api/exam?id=${examId}`, {
      userId: user._id,
      status: "Started",
    })
  }, [])

  useEffect(() => {
    if (exam && exam.duration) {
      const storedTimeLeft = localStorage.getItem(`timeLeft_${examId}`)
      const startTime = localStorage.getItem(`startTime_${examId}`)
      const duration = exam.duration * 60

      if (storedTimeLeft && startTime) {
        const elapsedTime = Math.floor(
          (Date.now() - parseInt(startTime)) / 1000
        )
        const newTimeLeft = Math.max(duration - elapsedTime, 0)
        setTimeLeft(newTimeLeft)
      } else {
        setTimeLeft(duration)
        localStorage.setItem(`startTime_${examId}`, Date.now().toString())
      }
    }
  }, [exam])

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTimeLeft = prevTime > 0 ? prevTime - 1 : 0
        localStorage.setItem(`timeLeft_${examId}`, newTimeLeft)
        if (newTimeLeft === 0) {
          clearInterval(timer)
          handleSubmit()
        }
        return newTimeLeft
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft])

  useEffect(() => {
    const savedAnswers = localStorage.getItem(`answers_${examId}`)
    if (savedAnswers) {
      setAnswers(JSON.parse(savedAnswers))
    }
  }, [examId])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60

  const getExam = async () => {
    // console.log(examId);
    const response = await axios.get(`/api/exam?id=${examId}`)
    setExam(response.data.exam)
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers((prevAnswers) => {
      const newAnswers = {
        ...prevAnswers,
        [questionId]: answer,
      }
      localStorage.setItem(`answers_${examId}`, JSON.stringify(newAnswers))
      return newAnswers
    })
    // console.log("answers",answers);
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  const handleSubmit = async () => {
    const totalMarks = exam.questions.reduce(
      (acc, question) => acc + question.mark,
      0
    )
    const obtainedMarks = exam.questions.reduce((acc, question) => {
      if (answers[question._id] === question.answer) {
        return acc + question.mark
      }

      return acc
    }, 0)

    const grade = (obtainedMarks / totalMarks) * 100

    const gradeData = {
      student: user._id,
      exam: exam._id,
      grade: grade,
      response: answers,
    }

    // console.log("gradeData",gradeData);

    try {
      const response = await axios.post("/api/grade", gradeData)
      // console.log("Grade saved:", response.data)
      localStorage.removeItem(`answers_${examId}`)
      localStorage.removeItem(`timeLeft_${examId}`)
      localStorage.removeItem(`startTime_${examId}`)
      setIsSubmitted(true) // Set the isSubmitted state to true
      axios.patch(`/api/exam?id=${examId}`, {
        userId: user._id,
        status: "Completed",
      })
    } catch (error) {
      console.error("Error saving grade:", error)
    }
  }

  if (!exam) {
    return <div>Loading...</div>
  }

  if (isSubmitted || timeLeft === 0) {
    return (
      <div className='flex-1 overflow-auto'>
        <div className='grid gap-6 p-6 md:p-10'>
          <Card className='pt-10'>
            <CardContent>
              <div className='text-center'>
                <h2 className='text-2xl font-bold'>
                  Thank you for completing the exam!
                </h2>
                <p className='text-gray-500'>
                  Your responses have been successfully submitted. We appreciate
                  your effort and diligence.
                </p>
                <p className='text-gray-500'>
                  You will be notified of your results in due course.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const currentQuestion = exam.questions[currentQuestionIndex]

  return (
    <main className='flex-1 overflow-auto'>
      <div className='grid gap-6 p-6 md:p-10'>
        <div className='grid grid-cols-1 gap-6'>
          <Card className='pt-10'>
            <CardContent>
              <div className='grid gap-6'>
                <div className='grid gap-4'>
                  <div className='rounded-lg overflow-hidden p-6'>
                    <div className='mb-4'>
                      <h2 className='text-2xl font-bold'>Instructions</h2>
                      <p className='text-gray-500'>
                        Please read the following instructions carefully before
                        starting the test:
                      </p>
                      <ul className='list-disc pl-6 text-gray-500'>
                        <li>
                          You will have {exam.duration} minutes to complete the
                          test, and the timer will automatically start upon
                          entering this page.
                        </li>
                        <li>
                          The test consists of {exam.questions.length}{" "}
                          multiple-choice questions. You must answer all
                          questions to submit the test.
                        </li>
                        <li>
                          You can navigate between questions using the
                          "Previous" and "Next" buttons.
                        </li>
                        <li>
                          Your answers will be automatically saved as you
                          progress through the test.
                        </li>
                        <li>
                          Once you are ready, click the "Submit" button to
                          finalize your test.
                        </li>
                      </ul>
                    </div>
                    <div className='flex justify-between items-center mb-4'>
                      <span className='font-medium'>
                        Time Left: {minutes}:
                        {seconds < 10 ? `0${seconds}` : seconds}
                      </span>
                      <span className='font-medium'>
                        Question {currentQuestionIndex + 1} of{" "}
                        {exam.questions.length}
                      </span>
                    </div>
                    <div className='border rounded-lg p-4'>
                      <h3 className='text-lg font-medium'>
                        {currentQuestion.question}
                      </h3>
                      <div className='flex flex-col gap-1 mt-3'>
                        <div className='flex gap-1'>
                          <Checkbox
                            checked={
                              answers[currentQuestion._id] ===
                              currentQuestion["optionA"]
                            }
                            onCheckedChange={() =>
                              handleAnswerChange(
                                currentQuestion._id,
                                currentQuestion["optionA"]
                              )
                            }
                            name={`question-${currentQuestionIndex}`}
                            id={`question-${currentQuestionIndex}-optionA`}
                          />
                          <Label
                            htmlFor={`question-${currentQuestionIndex}-optionA`}>
                            {currentQuestion["optionA"]}
                          </Label>
                        </div>
                        <div className='flex gap-1'>
                          <Checkbox
                            checked={
                              answers[currentQuestion._id] ===
                              currentQuestion["optionB"]
                            }
                            onCheckedChange={() =>
                              handleAnswerChange(
                                currentQuestion._id,
                                currentQuestion["optionB"]
                              )
                            }
                            name={`question-${currentQuestionIndex}`}
                            id={`question-${currentQuestionIndex}-optionB`}
                          />
                          <Label
                            htmlFor={`question-${currentQuestionIndex}-optionB`}>
                            {currentQuestion["optionB"]}
                          </Label>
                        </div>
                        <div className='flex gap-1'>
                          <Checkbox
                            checked={
                              answers[currentQuestion._id] ===
                              currentQuestion["optionC"]
                            }
                            onCheckedChange={() =>
                              handleAnswerChange(
                                currentQuestion._id,
                                currentQuestion["optionC"]
                              )
                            }
                            name={`question-${currentQuestionIndex}`}
                            id={`question-${currentQuestionIndex}-optionC`}
                          />
                          <Label
                            htmlFor={`question-${currentQuestionIndex}-optionC`}>
                            {currentQuestion["optionC"]}
                          </Label>
                        </div>
                        <div className='flex gap-1'>
                          <Checkbox
                            checked={
                              answers[currentQuestion._id] ===
                              currentQuestion["optionD"]
                            }
                            onCheckedChange={() =>
                              handleAnswerChange(
                                currentQuestion._id,
                                currentQuestion["optionD"]
                              )
                            }
                            name={`question-${currentQuestionIndex}`}
                            id={`question-${currentQuestionIndex}-optionD`}
                          />
                          <Label
                            htmlFor={`question-${currentQuestionIndex}-optionD`}>
                            {currentQuestion["optionD"]}
                          </Label>
                        </div>
                      </div>
                    </div>
                    <div className='flex justify-between mt-4'>
                      <Button
                        variant='outline'
                        onClick={handlePreviousQuestion}
                        disabled={currentQuestionIndex === 0}>
                        Previous
                      </Button>
                      <Button
                        variant='outline'
                        onClick={handleNextQuestion}
                        disabled={
                          currentQuestionIndex === exam.questions.length - 1
                        }>
                        Next
                      </Button>
                    </div>
                    <div className='flex justify-end gap-2 mt-4'>
                      {/* <Button variant="outline">Save</Button> */}
                      <Button onClick={handleSubmit}>Submit</Button>
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
