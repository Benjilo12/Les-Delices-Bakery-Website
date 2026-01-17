"use client";

import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function UserMenu() {
  return (
    <>
      <SignedOut>
        {/* Removed mode="modal" to force a redirect to your custom sign-in page */}
        <SignInButton>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-gray-700 hover:text-amber-600 cursor-pointer"
          >
            <User className="w-5 h-5" />
            <span className="hidden md:inline">Login / Register</span>
          </Button>
        </SignInButton>
      </SignedOut>

      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: "w-9 h-9",
            },
          }}
        />
      </SignedIn>
    </>
  );
}
