import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@prisma/client';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';


const prisma = new PrismaClient()

cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET,// Click 'View API Keys' above to copy your API secret
});


interface CloudinaryUploadResult{
    public_id:string;
    duration?:number;
    bytes:number;
    [key:string]: string | number | boolean | undefined;
}

export async function POST(request:NextRequest)
{

    const {userId}=await auth()

    if(!userId)
    {
        return NextResponse.json({
            error: "User not found"
        },{status:404})
    }
    // checking if credentials are not present

    if(!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET)
    {
        return NextResponse.json({
            error: "Credentials are missing"
        },{status:500})
    }
    try {
        const formData= await request.formData()
        const file = formData.get('file') as File
        const title = formData.get('title') as string
        const description=formData.get('description') as string
        const originalSize = formData.get('originalSize') as string
        if(!file)
        {
            return NextResponse.json({
                error:"File not found"
            },{status:404})
        }

        const bytes=await file.arrayBuffer()
        const buffer= Buffer.from(bytes)

        const result = await new Promise<CloudinaryUploadResult>((resolve,reject)=>{
            const uploadStream = cloudinary.uploader.upload_stream(
                {folder:"video-uploads",
                    resource_type:"video",
                    transformation:[
                        {quality:"auto", fetch_format:"mp4"}
                    ]
                },
                (error,result)=>{
                    if(error){ 
                        console.log(error)
                        reject(error)}
                    else resolve(result as CloudinaryUploadResult);
                }
            )
            uploadStream.end(buffer)

        
            })
            const video=  await prisma.videos.create({
                data:{
                    title,
                    description,
                    publicId:result.public_id,
                    originalSize: originalSize,
                    compressedSize:String(result.bytes),
                    duration:result.duration || 0
                }
        })

        return NextResponse.json(video)
            
    } catch (error) {
        console.log("Video Upload Failed ",error)
        return NextResponse.json({
            error: "Video Upload Failed"
        },{status:500})
    }finally{
        await prisma.$disconnect()
    }
}