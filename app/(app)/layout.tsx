"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useClerk, useUser } from "@clerk/nextjs";

export default function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const { signOut } = useClerk();
  const { user } = useUser();

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in")
  };
  

  return (
    <div>
      <div className="navbar bg-base-100">
        <div className="flex-1">
          <a className="btn btn-ghost text-xl" onClick={() => router.push("/")}>
            MediaMorph
          </a>
        </div>
        <div className="flex-none gap-8">
          <div className="navbar-center hidden lg:flex">
            <ul className="menu menu-horizontal px-1 w-full">
              <li>
                <details>
                  <summary className="w-full">Services</summary>
                  <ul className="pr-4 w-72">
                    <li>
                      <a onClick={() => router.push("/home")}>Home</a>
                    </li>
                    <li>
                      <a onClick={() => router.push("/social-share")}>
                        Social Share
                      </a>
                    </li>
                    <li>
                      <a onClick={() => router.push("/video-upload")}>
                        Video Upload
                      </a>
                    </li>
                  </ul>
                </details>
              </li>
            </ul>
          </div>
          <div className="dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-ghost btn-circle avatar"
            >
              <div className="w-10 rounded-full">
                <img
                  alt={user?.emailAddresses[0].emailAddress || user?.username}
                  src={user?.imageUrl}
                />
              </div>
            </div>
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
            >
              <li>
                <a onClick={ handleSignOut}>Logout</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 my-8">
          {children}
        </div>
      </main>
    </div>
  );
}
