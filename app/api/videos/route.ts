import { PrismaClient } from "@prisma/client";
import {  NextResponse } from "next/server";


const prisma= new PrismaClient()
export async function GET() {
   try {
    const videos = await prisma.videos.findMany({
        orderBy:{createdAt:"desc"}
    })

    return NextResponse.json(videos)
   } catch (error) {
    return NextResponse.json({error:error},{status:500})
   }finally{
    await prisma.$disconnect()
   }
}