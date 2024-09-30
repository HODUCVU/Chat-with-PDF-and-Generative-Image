import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import {LogIn} from 'lucide-react'
import FileUpload from "@/components/FileUpload";
export default async function Home() {
  const {userId} = await auth()
  const isAuth = !!userId
  return (
    <div className="w-screen min-h-screen bg-gradient-to-r from-rose-100 to-teal-100">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col items-center text-center">
          
          <div className="flex items-center">
            {/* <h1 className="mr-3 text-6x1 font-semibold text-black">CHAT WITH ANY PDF</h1> */}
            <h1 className="text-6xl font-semibold text-black mb-6">CHAT WITH ANY PDF AND CREATE IMAGES</h1>
            <UserButton afterSignOutUrl="/"/>
          </div> 

          <div className="flex mt-2 space-x-4">
            {isAuth &&
              (
                <>
                  <Link
                    href="/chat/1"
                    className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300"
                  >
                    <span className="text-lg font-semibold">Go to Chats</span>
                  </Link>
                  <Link
                    href="/generative/1"
                    className="flex items-center px-4 py-2 bg-green-500 text-white rounded-lg shadow hover:bg-green-600 transition duration-300"
                  >
                    <span className="text-lg font-semibold">Generate Image</span>
                  </Link>
                </>
              )
            }
          </div>

          <p className="max-w-xl mt-1 text-lg text-slate-600 text-black">
          Join millions oof students, reseasrchers and professionals to instantly answer questions and understand research with AI
          </p>

          <div className="w-full mt-4 flex justify-center">
            {isAuth ? (
              <FileUpload/>
            ) : (
              <Link href="/sign-in" className="flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg shadow hover:bg-blue-600 transition duration-300">
                <span className="text-lg font-semibold">Login to Get Started!</span>
                <LogIn className="w-5 h-5 ml-2" aria-hidden="true" />
              </Link>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
