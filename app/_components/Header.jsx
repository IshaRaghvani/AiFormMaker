"use client";
import React from "react";

import Image from "next/image";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";

function Header() {
  const { user, isSignedIn } = useUser();
  const path = usePathname();

  return (
    !path.includes("aiform") && (
      <div className="p-5 shadow-sm ">
        <div className="flex items-center justify-between">
          <Image src="/logo.svg" width={50} height={50} alt="logo" />
          {isSignedIn ? (
            <div className="flex items-center gap-5">
              <Link href={"/dashboard"}>
                <Button variant="outline">Dashboard</Button>
              </Link>

              <UserButton />
            </div>
          ) : (
            <SignInButton>
              <Button>Get Started</Button>
            </SignInButton>
          )}
          
        </div>
        <hr className="my-4 border-gray-600"></hr>
      </div>
    )
  );
}

export default Header;
