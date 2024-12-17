"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";

export default function SignUp() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      // Redirect to sign in page after successful signup
      router.push("/auth/signin");
    } catch (error) {
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='flex items-center justify-center bg-slate/10 backdrop-blur-lg py-12 px-4 sm:px-6 lg:px-8 m-auto'>
      <div className='max-w-md w-full space-y-8'>
        <div>
          <h2 className='text-center text-3xl font-extrabold text-gray-900'>
            Create your account
          </h2>
        </div>
        <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
          <div className='rounded-md shadow-sm space-y-4'>
            <Input
              id='name'
              name='name'
              type='text'
              required
              placeholder='Full name'
            />

            <Input
              id='email'
              name='email'
              type='email'
              autoComplete='email'
              required
              placeholder='Email address'
            />

            <Input
              id='password'
              name='password'
              type='password'
              autoComplete='new-password'
              required
              placeholder='Password'
            />
          </div>

          {error && (
            <div className='text-red-500 text-sm text-center'>{error}</div>
          )}

          <div className='flex justify-center'>
            <Button type='submit' disabled={isLoading}>
              {isLoading ? "Creating account..." : "Sign up"}
            </Button>
          </div>

          <div className='flex justify-center'>
            <p className='text-sm text-gray-500'>
              Already have an account?
              <Link
                href='/auth/signin'
                className='ml-1 font-medium text-cyan-600 hover:text-cyan-500'>
                Sign in
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
