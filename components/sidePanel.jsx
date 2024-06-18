"use client";
import { AvatarImage, AvatarFallback, Avatar } from "@/components/ui/avatar";
import { useState } from "react";

import TeacherNav from "./teacherNav";
import StudentNav from "./studentNav";

import { useSession, signIn, signOut } from "next-auth/react";
import { Button } from "./ui/button";
import Link from "next/link";

export function SidePanel({ children }) {
  const { data: session } = useSession();
  const [user, setUser] = useState(session?.user);
  return (
    <div className="flex min-h-screen w-full flex-col bg-gray-50 dark:bg-gray-950">
      <div className="flex flex-1">
        <div className="hidden w-64 shrink-0 border-r bg-white p-6 dark:border-gray-800 dark:bg-gray-950 md:block">
          <div className="flex flex-col gap-6">
            {user ? (
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage alt="User avatar" src={user?.image} />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div className="grid gap-0.5 text-sm">
                  <div className="font-medium">{user?.name}</div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {user.isTeacher ? "Teacher" : "Student"}
                  </div>
                </div>
              </div>
            ) : (
              <Button onClick={signIn}>Login</Button>
            )}
            {user && (user?.isTeacher ? <TeacherNav /> : <StudentNav />)}

           {user &&  <Link
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              href="#"
              onClick={signOut}
            >
              <LogOutIcon className="h-4 w-4" />
              Logout
            </Link>}
          </div>
        </div>
        {children}
      </div>
    </div>
  );
}

function LogOutIcon(props) {
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
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
