"use client"
import React,{useState} from 'react'
import axios from 'axios'
import { useRouter } from 'next/navigation'

export default function VideoUpload() {
  const [file,setFile]=useState<File | null>(null)
  const [title,setTitle]=useState<string>('')
  const [description,setDescription]=useState<string>('')
  const [isUploading,setIsUploading]=useState<boolean>(false)

  const router = useRouter()
  
  // max file size
  const MAX_FILE_SIZE=60*1024*1024

  const handleSubmit = async(e:React.FormEvent)=>{
    e.preventDefault()
    if(!file) return;
    if(file.size>MAX_FILE_SIZE){

      alert('File Size is too large!')
      return;
    }
    
    const formData = new FormData()
    formData.append('file',file)
    formData.append('title',title)
    formData.append('description',description)
    formData.append('originalSize',file.size.toString())

    setIsUploading(true)

    try {
      const response = await axios.post('/api/video-upload',formData)
      if(response.status!=200)
        return;
      router.push('/')
    } catch (error) {
      console.log('Video upload failed: ',error)
      alert('Video Upload Failed')
      
    }finally{
      setIsUploading(false)
    }
  }

  return (
    <div className='container mx-auto p-4'>
      <h1 className='text-2xl font-bold mb-4'>Upload Video</h1>
      <form onSubmit={handleSubmit} className='space-y-4'>
        <div>
          <label htmlFor="" className='label'>
            <span className='label-text'>Title</span>
          </label>
          <input type="text" 
          value={title}
          onChange={(e)=>setTitle(e.target.value)}
          required
          className='input input-bordered w-full bg-slate-300'
          />
        </div>
        <div>
          <label htmlFor="" className='label'>
            <span className='label-text'>Description</span>
          </label>
          <textarea 
          value={description}
          onChange={(e)=>setDescription(e.target.value)}
          className='textarea textarea-bordered w-full bg-white'
          />
        </div>
        <div>
          <label htmlFor="" className='label'>
            <span className='label-text'>Video File</span>
          </label>
          <input type="file"
          accept='video/*'
          onChange={(e)=>setFile(e.target.files?.[0] || null)}
          className='file-input file-input-bordered w-full bg-blue-200'
          required
          />
        </div>
        <button
        type='submit'
        className='btn  btn-primary bg-white'
        disabled={isUploading}
        >
          {
            isUploading?(<span className="loading loading-dots loading-md bg-green-500"></span>):"Upload Video"
          }

        </button>
      </form>
    </div>
  )
}
