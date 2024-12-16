import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { SalesAgentLogo, GithubLogo } from "@/components/logos";
import { Providers } from "./providers";
import Image from "next/image";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ConvAI",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang='en' suppressHydrationWarning className={"h-full w-full "}>
      <body
        className={`${inter.className} antialiased w-full h-full lex flex-col relative bg-gray-900`}>
        <Providers>
          <div className='flex flex-col flex-grow w-full items-center justify-center sm:px-4'>
            <div className='fixed inset-0 z-0 w-full'>
              <Image
                src='/image.png'
                alt='Background'
                fill
                className='object-cover opacity-40'
                priority
              />
            </div>
            <nav
              className={
                "sm:fixed w-full top-0 left-0 grid grid-cols-2 py-4 px-8 z-50"
              }>
              <div className={"flex"}>
                <Link href={"/"} prefetch={true}>
                  <SalesAgentLogo className='h-[35px] w-auto text-slate-200 hover:text-slate-300' />
                </Link>
              </div>

              <div className={"flex gap-4 justify-end"}>
                <Link
                  href='https://github.com/C-Vane/AI-Boothcamp-Homeworks/tree/main/FINAL-PROJECT'
                  target='_blank'
                  rel='noopener noreferrer'
                  className={"py-0.5 cursor-pointer"}
                  aria-label='View source on GitHub'>
                  <GithubLogo className='w-5 h-5 hover:text-gray-500 text-[#24292f]' />
                </Link>
              </div>
            </nav>
            <div className='z-10 min-h-screen w-full flex pt-16'>
              {children}
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
