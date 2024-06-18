"use client"
import { useState, useEffect } from "react"
import axios from "axios"
import { Button } from "@/components/ui/button"
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
import moment from "moment"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
const formatDate = (isoDate) => {
  return moment(isoDate).format("DD-MM-YYYY HH:mm")
}

const TeacherNotification = () => {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [schedule, setSchedule] = useState("")
  const [notifications, setNotifications] = useState([])
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [deleteId, setDeleteId] = useState(null)
  const [icon, setIcon] = useState("CalendarIcon")
  const [students,setStudents] = useState()
  const [target,setTarget] = useState()

  const iconMap = {
    CalendarIcon: (
      <div className="rounded-full bg-blue-100 p-2 text-blue-500 dark:bg-blue-900 dark:text-blue-400">
        <CalendarIcon className="h-5 w-5" />
      </div>
    ),
    ClipboardCheckIcon: (
      <div className="rounded-full bg-green-100 p-2 text-green-500 dark:bg-green-900 dark:text-green-400">
        <ClipboardCheckIcon className="h-5 w-5" />
      </div>
    ),
    CircleAlertIcon: (
      <div className="rounded-full bg-yellow-100 p-2 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-400">
        <CircleAlertIcon className="h-5 w-5" />
      </div>
    ),
  };
  const getNotifications = async () => {
    try {
      const response = await axios.get("/api/notifications?target=everyone")
      setNotifications(response.data.notifications)
    } catch (error) {
      console.error("Error fetching notifications:", error)
    }
  }
  const getStudents = async () => {
    try {
      const response = await axios.get("/api/user")
      setStudents(response.data.users)
    } catch (error) {
      console.error("Error fetching students:", error)
    }
  }


  useEffect(() => {
    getNotifications()
    getStudents()
  }, [])

  const createNotification = async (e) => {
    e.preventDefault()
    try {
      const newNotification = {
        title: title,
        content: content,
        schedule: schedule,
        target: target === 'everyone' ? 'everyone' : 'specific',
        icon: icon,
        ...(target !== 'everyone' && { studentId: target })
      };
      

      const response = await axios.post("/api/notifications", newNotification)
      console.log("Notification created:", response.data)
      getNotifications()
    } catch (error) {
      console.error("Error creating notification:", error)
    }
  }

  const deleteNotification = async () => {
    try {
      const response = await axios.delete(`/api/notifications?id=${deleteId}`)
      console.log("Notification deleted:", response.data.message)
      getNotifications()
    } catch (error) {
      console.error("Error deleting notification:", error)
    }
  }

  const handleConfirmDelete = () => {
    setIsDialogOpen(false)
    deleteNotification()
  }

  return (
    <main className='flex-1 overflow-y-auto'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='mt-8'>
          <Card>
            <CardHeader>
              <CardTitle>Create Notification</CardTitle>
            </CardHeader>
            <CardContent className='pb-10'>
              <div className='grid gap-6 grid-cols-1 lg:grid-cols-2 '>
              <div className='grid gap-4 '>
  <form className='grid gap-4 grid-cols-1 ' onSubmit={createNotification}>
    {/* Title Input */}
    <div className='grid gap-2'>
      <Label htmlFor='title'>Title</Label>
      <Input
        id='title'
        className='w-full px-4 py-2 border rounded-md'
        placeholder='Enter notification title'
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
    </div>

    {/* Content Textarea */}
    <div className='grid gap-2'>
      <Label htmlFor='content'>Content</Label>
      <Textarea
        id='content'
        className='w-full px-4 py-2 border rounded-md'
        placeholder='Enter notification content'
        rows={4}
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
    </div>

    {/* Schedule Input */}
    <div className='grid gap-2'>
      <Label htmlFor='schedule'>Schedule</Label>
      <Input
        id='schedule'
        className='w-full px-4 py-2 border rounded-md'
        type='datetime-local'
        value={schedule}
        onChange={(e) => setSchedule(e.target.value)}
      />
    </div>

    {/* Icon Selection */}
    <div className='grid gap-5 grid-cols-2 items-end'>
      <div>
      <Label htmlFor='icon'>Icon</Label>
      <Select onValueChange={(value) => setIcon(value)}>
        <SelectTrigger className='w-full'>
          <SelectValue
            placeholder='Select an Icon'
            value={icon}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='CalendarIcon'>
              Calendar Icon
            </SelectItem>
            <SelectItem value='ClipboardCheckIcon'>
              Check Icon
            </SelectItem>
            <SelectItem value='CircleAlertIcon'>
              Alert Icon
            </SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
      </div>
      
      <div className="w-fit">
      {iconMap[icon]}
      </div>
    </div>

    {/* Target Selection */}
    <div className='grid gap-2'>
      <Label htmlFor='target'>Target</Label>
      <Select onValueChange={(value) => setTarget(value)}>
        <SelectTrigger className='w-full'>
          <SelectValue
            placeholder='Select a Target'
            value={target}
          />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value='everyone'>
              Everyone
            </SelectItem>
            {/* Map over students for specific targets */}
            {students?.map((student) => (
              <SelectItem key={student._id} value={student._id}>
                {student.name}
              </SelectItem>
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>

    {/* Submit Button */}
    <Button className='col-span-full' type='submit'>Create New</Button>
  </form>
</div>

                <div className='grid gap-4 mt-48 lg:mt-0'>
                  <div className='flex items-center justify-between'>
                    <h2 className='text-2xl font-bold'>Notifications</h2>
                  </div>
                  <div className=' rounded-lg overflow-hidden'>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Content</TableHead>
                          <TableHead>Schedule</TableHead>
                          <TableHead>Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {notifications.map((notification) => (
                          <TableRow key={notification._id}>
                            <TableCell className='font-medium'>
                              {notification.title}
                            </TableCell>
                            <TableCell>{notification.content}</TableCell>
                            <TableCell>
                              {formatDate(notification.schedule)}
                            </TableCell>
                            <TableCell className='text-right'>
                              {/* <Button size='sm' variant='link'>
                                Edit
                              </Button> */}
                              <Button
                                className='text-red-500'
                                size='sm'
                                variant='link'
                                onClick={() => {
                                  setDeleteId(notification._id)
                                  setIsDialogOpen(true)
                                }}>
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
                                      permanently delete the notification.
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
                              </AlertDialog>
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

export default TeacherNotification





function CircleAlertIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <line x1="12" x2="12" y1="8" y2="12" />
      <line x1="12" x2="12.01" y1="16" y2="16" />
    </svg>
  );
}

function ClipboardCheckIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
      <path d="m9 14 2 2 4-4" />
    </svg>
  );
}

function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}