'use client';

import { ThemeProvider } from '../context/ThemeContext'
import Navbar from './Navbar'
import Footer from './Footer'

export default function RootLayoutClient({
  children,
  className,
}: {
  children: React.ReactNode
  className: string
}) {
  return (
    <body className={`${className} transition-colors duration-300`}>
      <ThemeProvider>
        <div className="flex flex-col min-h-screen dark:bg-gray-900">
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </div>
      </ThemeProvider>
    </body>
  )
}
