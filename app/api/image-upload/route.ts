import { auth } from '@clerk/nextjs/server';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';


cloudinary.config({ 
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret:process.env.CLOUDINARY_API_SECRET,// Click 'View API Keys' above to copy your API secret
});


interface CloudinaryUploadResult{
    public_id:string;
    [key:string]: string | number | boolean | undefined
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

    try {
        const formData= await request.formData()
        const file = formData.get('file') as File
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
                {folder:"next-cloudinary-uploads",
                    resource_type:"auto"
                },
                (error,result)=>{
                    if(error) reject(error);
                    else resolve(result as CloudinaryUploadResult);
                }
            )
            uploadStream.end(buffer)
        })
            return NextResponse.json({
                publicId:result.public_id
            },{status:200})
    } catch (error) {
        console.log("Image Upload Failed ",error)
        return NextResponse.json({
            error: "Image Upload Failed"
        },{status:500})
    }
}