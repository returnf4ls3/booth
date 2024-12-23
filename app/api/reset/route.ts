import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(req: Request) {
    try {
        const updatedQuestion = await prisma.question.updateMany({
            data: {
                isUsed: false
            },
        });
    
        return NextResponse.json({ success: true, data: updatedQuestion }, { status: 201 })
    } catch (error) {
        console.error("Error fetcing data: ", error);
        return NextResponse.json({ success: false, error: "Failed to change data" }, { status: 500 });
    }
}