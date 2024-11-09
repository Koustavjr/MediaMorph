"use client"
import { useRouter } from "next/navigation";
import { useEffect } from "react";






export default function Home() {
  const router = useRouter()
  useEffect(()=>{
    router.push("/sign-in")
  },[])
  return (
    <div className="w-full h-full flex items-center justify-center">
      <span className="loading loading-ball loading-xs"></span>
<span className="loading loading-ball loading-sm"></span>
<span className="loading loading-ball loading-md"></span>
<span className="loading loading-ball loading-lg"></span>

    </div>
  );
}
