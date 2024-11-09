'use client'
import VideoCard from '@/app/components/VideoCard'
import { Video } from '@/types'
import axios from 'axios'
import React, { useCallback, useEffect, useState } from 'react'

export default function Home() {
  const [videos,setVideos]=useState<Video[]>([])
  const [error,setError]=useState<string>('')
  const [loading,setLoading]=useState<boolean>(true)
  
  const fetchVideos = useCallback(async()=>{
    try {
      const response = await axios.get('/api/videos')
      if(Array.isArray(response.data))
      {
        const data = response.data
        setVideos(data)
      }
      else
      {
        throw new Error("Failed to get videos")
      }
    } catch (err) {
      console.log(error)
      setError(err as string)
    }finally{
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    fetchVideos()
  },[fetchVideos])

  const handleDownload=(url:string,title:string)=>{
      const link=document.createElement("a")
      link.href=url
      link.setAttribute('download',`${title}.mp4`)
      link.setAttribute('target','_blank')
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
  }

    if(loading)
    {
      return <div className='flex items-center justify-center m-auto w-full h-full'><span className="loading loading-infinity loading-lg"></span></div>
    }
  return (
        <div className='container mx-auto p-4'>
            <h1 className='text-2xl font-bold mb-4'>Videos</h1>
            {videos.length===0?(
              <div className='text-center text-lg text-gray-500'>
                No Videos Available
              </div>
            ):(
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {
                  videos.map((video)=>(
                    <VideoCard
                    key={video.id}
                    video={video}
                    onDownload={handleDownload}
                    />
                  ))
                }
              </div>
            )}
        </div>
  )
}
