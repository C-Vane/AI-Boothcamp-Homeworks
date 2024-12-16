"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function Home() {
  const { data: session } = useSession();

  return (
    <div className='relative w-full h-screen'>
      {/* Content */}
      <div className='relative z-10 flex flex-col items-center justify-center h-screen text-center'>
        <div className='max-w-3xl mx-auto space-y-8'>
          <h1 className='text-5xl font-bold text-gray-100 mb-4'>
            Sales Agent AI
          </h1>

          <p className='text-xl text-gray-100 mb-8 max-w-2xl mx-auto'>
            Your intelligent sales assistant powered by AI. Streamline your
            sales process, enhance customer interactions, and boost your revenue
            with cutting-edge AI technology.
          </p>

          <div className='flex gap-4 justify-center'>
            {session ? (
              <>
                <Link href='/dashboard'>
                  <Button>Dashboard</Button>
                </Link>
                <Button onClick={() => signOut({ callbackUrl: "/" })}>
                  Log Out
                </Button>
              </>
            ) : (
              <>
                <Link href='/auth/signin'>
                  <Button>Sign In</Button>
                </Link>
                <Link href='/auth/signup'>
                  <Button>Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
