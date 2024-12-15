import Link from "next/link";

export default function Home() {
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
            <Link
              href='/auth/signin'
              className='px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold'>
              Sign In
            </Link>
            <Link
              href='/auth/signup'
              className='px-8 py-3 bg-white text-blue-600 rounded-lg hover:bg-gray-100 transition-colors duration-200 font-semibold border-2 border-blue-600'>
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
