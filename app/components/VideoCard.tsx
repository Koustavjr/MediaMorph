import React,{useEffect,useState,useCallback} from 'react'
import dayjs from 'dayjs'
import relativetime from "dayjs/plugin/relativeTime"
import {filesize} from "filesize"
import { Video } from '@/types'
import { getCldImageUrl, getCldVideoUrl } from 'next-cloudinary'
import { Clock, Download, FileDown, FileUp } from 'lucide-react'


dayjs.extend(relativetime)


interface VideoCardProps{
    video:Video;
    onDownload:(url:string,title:string)=>void
}

const VideoCard:React.FC<VideoCardProps> = ({video,onDownload}) => {
    const [isHovered,setIsHovered]=useState<boolean>(false)
    const [previewError,setPreviewError]=useState<boolean>(false)

    const getThumbnailUrl=useCallback((publicId:string)=>{
        return getCldImageUrl({
            src: publicId,
            width: 400,
            height: 225,
            crop: "fill",
            gravity: "auto",
            format: "jpg",
            quality: "auto",
            assetType: "video"
        })
    },[])

    const getVideoPreviewUrl=useCallback((publicId:string)=>{
        return getCldVideoUrl({
            src:publicId,
            rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
            width:400,
            height:225
        })
    },[])
    
    const getFullVideoUrl=useCallback((publicId:string)=>{
        return getCldVideoUrl({
            src:publicId,
            width:1920,
            height:1080,
        })
    },[])

    const formatSize=useCallback((size:number)=>{
        return filesize(size)
    },[])

    const formatDuration=useCallback((seconds:number)=>{
            const minutes= Math.floor(seconds/60)
            const remainingSeconds=Math.round(seconds%60)
        return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
    },[])

    const compressionPercentage=Math.round(1-Number(video.compressedSize)/Number(video.originalSize))

    useEffect(()=>{
        setPreviewError(false)
    },[])

    const handlePreviewError=()=>{
        setPreviewError(true)
    }
    return (
    <div className='card bg-base-100 shadow-xl hover:shadow:2xl transition-all duration-300'
    onMouseEnter={()=>setIsHovered(true)}
    onMouseLeave={()=>setIsHovered(false)}
    >
        <figure className='aspect-video relative'>
            {isHovered?(
                previewError?(
                    <div
                    className='w-full h-full flex items-center justify-center
                    bg-gray-200
                    '><p className='text-red-500'>Preview Not Available</p></div>
                ):(
                    <video
                    src={getVideoPreviewUrl(video.publicId)}
                    loop
                    autoPlay
                    muted
                    className='w-full h-full object-cover'
                    onError={handlePreviewError}
                    />
                )
            ):(
                <img
                src={getThumbnailUrl(video.publicId)}
                alt={video.title}
                className="w-full h-full object-cover"
              />
            )}

            <div className='absolute bottom-2 right-2 bg-base-200 bg-opacity-70
            px-2 py-1 rounded-lg text-sm flex items-center
            '>
                <Clock size={16} className='mr-2'/>
                {formatDuration(video.duration)}

            </div>
        </figure>

        <div className='card-body p-4'>
            <h2 className='card-title text-lg font-bold'>
            {video.title}
            </h2>
            <p className='text-sm text-base-content opacity-70
            mb-4
            '>{video.description}</p>
            <p className='mb-4 text-sm text-base-content opacity-70'>
            Uploaded {dayjs(video.createdAt).fromNow()}
            </p>
        </div>

        <div className='grid grid-cols-2 gap-4 text-sm'>
            <div className='flex items-center'>
                <FileUp size={18}className='mr-3 ml-2 text-white'/>
                <div>
                    <div className='font-semibold'>Original</div>
                    <div>{formatSize(Number(video.originalSize))}</div>
                </div>
            </div>
            <div className='flex items-center'>
                <FileDown size={18} className='mr-2 text-secondary'/>
                <div className='font-semibold mr-2'>Compressed</div>
                <div>{formatSize(Number(video.compressedSize))}</div>
            </div>
        </div>
            <div className='flex items-center justify-between
            mt-4
            '>
                <div className='text-sm font-semibold ml-2'>
                    Compression:{" "}
                    <span className='text-accent'>{compressionPercentage}%</span>
                </div>
                <button
                className='btn btn-primary btn-sm mr-2 mb-1'
                onClick={()=>{
                    onDownload(getFullVideoUrl(video.publicId),video.title)

                }}
                >
                    <Download size={16}/>
                </button>
                
            </div>


    </div>
  )
}

export default VideoCard