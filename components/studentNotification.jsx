import axios from "axios"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"
import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card,
  CardFooter,
} from "@/components/ui/card"

const iconMap = {
  CalendarIcon: (
    <div className='rounded-full bg-blue-100 p-2 text-blue-500 dark:bg-blue-900 dark:text-blue-400'>
      <CalendarIcon className='h-5 w-5' />
    </div>
  ),
  ClipboardCheckIcon: (
    <div className='rounded-full bg-green-100 p-2 text-green-500 dark:bg-green-900 dark:text-green-400'>
      <ClipboardCheckIcon className='h-5 w-5' />
    </div>
  ),
  CircleAlertIcon: (
    <div className='rounded-full bg-yellow-100 p-2 text-yellow-500 dark:bg-yellow-900 dark:text-yellow-400'>
      <CircleAlertIcon className='h-5 w-5' />
    </div>
  ),
}

const calculateTimeAgo = (createdAt) => {
  const now = new Date()
  const created = new Date(createdAt)
  const diffMs = now - created

  // Convert milliseconds to hours and minutes
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))

  if (diffHours === 0 && diffMinutes === 0) {
    return `just now`
  } else if (diffHours === 0) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`
  } else {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`
  }
}

const StudentNotification = () => {
  const [notifications, setNotifications] = useState()
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)

  useEffect(() => {
    getNotifications()
  }, [])

  const getNotifications = async () => {
    try {
      const specificResponse = await axios.get(
        `/api/notifications?target=specific&userId=${user?._id}`
      );
  
      const everyoneResponse = await axios.get(
        `/api/notifications?target=everyone`
      );
  
      const specificNotifications = specificResponse.data.notifications;
      const everyoneNotifications = everyoneResponse.data.notifications;
  
      // Combine specific and everyone notifications
      const allNotifications = [...specificNotifications, ...everyoneNotifications];
      // Sort combined notifications by createdAt timestamp
      allNotifications.sort((a, b) => {
        const now = new Date();
        const createdA = new Date(a.createdAt);
        const timeAgoA = now - createdA;
        const createdB = new Date(b.createdAt);
        const timeAgoB = now - createdB;
  
        // Compare timestamps based on timeAgo (assuming it's in a readable format)
        return timeAgoA - timeAgoB;
      });
  
      // Update state with sorted notifications (get the latest 3)
      setNotifications(allNotifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Handle error state or logging as necessary
    }
  };


  return (
    <main className='flex-1 p-4 md:p-6'>
      <div className='grid gap-6'>
        <div className='grid gap-4'>
          <h2 className='text-2xl font-bold'>Notifications</h2>
          <div className='grid gap-4 lg:grid-cols-2'>
            {notifications?.map((notification) => (

              <Card>
                <CardHeader className='pl-0'>
                  <CardContent className='pb-0'>
                    <CardTitle className='flex items-center gap-2'>
                      {iconMap[notification.icon]}
                      {notification.title}
                    </CardTitle>
                    <CardDescription className='ml-11'>
                      {notification.content}
                    </CardDescription>
                  </CardContent>
                </CardHeader>
                <CardFooter>
                  <div className='text-xs text-gray-500 dark:text-gray-400'>
                    {calculateTimeAgo(notification.createdAt)}
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </main>
  )
}

export default StudentNotification

function CircleAlertIcon(props) {
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
      <circle cx='12' cy='12' r='10' />
      <line x1='12' x2='12' y1='8' y2='12' />
      <line x1='12' x2='12.01' y1='16' y2='16' />
    </svg>
  )
}

function ClipboardCheckIcon(props) {
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
      <rect width='8' height='4' x='8' y='2' rx='1' ry='1' />
      <path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2' />
      <path d='m9 14 2 2 4-4' />
    </svg>
  )
}

function CalendarIcon(props) {
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
      <path d='M8 2v4' />
      <path d='M16 2v4' />
      <rect width='18' height='18' x='3' y='4' rx='2' />
      <path d='M3 10h18' />
    </svg>
  )
}
