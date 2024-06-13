import React from "react";
import "./globals.css";
import Header from "./_components/Header";
import Hero from "./_components/Hero";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner"

export default function RootLayout({ children }) {
  return (
    <ClerkProvider><html lang="en">
      <body className="bg-gray-900 min-h-screen">
        <Header />
        <Toaster />
       
        {children}
      </body>
    </html>
    </ClerkProvider>
  );
}
