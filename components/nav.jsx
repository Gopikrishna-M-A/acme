"use client"
import React, { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenu,
} from "@/components/ui/dropdown-menu"

import { useSession } from "next-auth/react"
import axios from "axios"

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

const calculateTimeAgo = (createdAt) => {
  const now = new Date();
  const created = new Date(createdAt);
  const diffMs = now - created;

  // Convert milliseconds to hours and minutes
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  if (diffHours === 0 && diffMinutes === 0) {
    return `just now`;
  } else if (diffHours === 0) {
    return `${diffMinutes} ${diffMinutes === 1 ? "minute" : "minutes"} ago`;
  } else {
    return `${diffHours} ${diffHours === 1 ? "hour" : "hours"} ago`;
  }
};


const nav = () => {
  const [notifications, setNotifications] = useState()
  const { data: session } = useSession()
  const [user, setUser] = useState(session?.user)

  useEffect(() => {
    if(user){
      getNotifications()
    }
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
      setNotifications(allNotifications.slice(0, 3));
    } catch (error) {
      console.error('Error fetching notifications:', error);
      // Handle error state or logging as necessary
    }
  };
  return (
    <header className='sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b bg-white px-6 dark:border-gray-800 dark:bg-gray-950 md:h-20'>
      <div className='flex items-center gap-4'>
        <Button className='lg:hidden' size='icon' variant='ghost'>
          <MenuIcon className='h-6 w-6' />
          <span className='sr-only'>Toggle navigation</span>
        </Button>
        <Link className='flex items-center gap-2 font-semibold' href='/'>
          <BookIcon className='h-6 w-6' />
          <span className='text-lg font-bold'>Acme Edu</span>
        </Link>
      </div>
      <div className='flex items-center gap-4'>
        {user && (
          <>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button size='icon' variant='ghost'>
                  <BellIcon className='h-5 w-5' />
                  <span className='sr-only'>Notifications</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-[300px]'>
                <DropdownMenuLabel className='font-medium'>
                  Notifications
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {notifications?.map((notification) => (
                  <DropdownMenuItem className='grid gap-2 p-4' key={notification._id}>
                    <div className='flex items-center gap-3'>
                      {iconMap[notification.icon]}
                      <div>
                        <div className='font-medium'>{notification.title}</div>
                        <div className='text-sm text-gray-500 dark:text-gray-400'>
                        {notification.content}
                        </div>
                      </div>
                    </div>
                    <div className='text-xs text-gray-500 dark:text-gray-400'>
                      {/* 2 hours ago */}
                      {calculateTimeAgo(notification.createdAt)}
                    </div>
                  </DropdownMenuItem>
                ))}

                <DropdownMenuSeparator />
               <Link href='/notifications'> <DropdownMenuItem className='flex items-center justify-center gap-2 p-4 text-sm font-medium text-blue-500 hover:bg-gray-100 dark:hover:bg-gray-800'>
                  View all notifications
                </DropdownMenuItem></Link>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        )}
      </div>
    </header>
  )
}

export default nav

function LogOutIcon(props) {
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
      <path d='M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4' />
      <polyline points='16 17 21 12 16 7' />
      <line x1='21' x2='9' y1='12' y2='12' />
    </svg>
  )
}

function MenuIcon(props) {
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
      <line x1='4' x2='20' y1='12' y2='12' />
      <line x1='4' x2='20' y1='6' y2='6' />
      <line x1='4' x2='20' y1='18' y2='18' />
    </svg>
  )
}

function SearchIcon(props) {
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
      <circle cx='11' cy='11' r='8' />
      <path d='m21 21-4.3-4.3' />
    </svg>
  )
}

function SettingsIcon(props) {
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
      <path d='M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z' />
      <circle cx='12' cy='12' r='3' />
    </svg>
  )
}

function BellIcon(props) {
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
      <path d='M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9' />
      <path d='M10.3 21a1.94 1.94 0 0 0 3.4 0' />
    </svg>
  )
}

function BookIcon(props) {
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
      <path d='M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20' />
    </svg>
  )
}

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

function UserIcon(props) {
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
      <path d='M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2' />
      <circle cx='12' cy='7' r='4' />
    </svg>
  )
}
