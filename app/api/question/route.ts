import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const numberParam = url.searchParams.get("number");

        if (!numberParam) {
        const data = await prisma.question.findMany();

        if (!data || data.length === 0) {
            return NextResponse.json({ success: false, error: "No data found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
        }

        const number = parseInt(numberParam, 10);
        if (isNaN(number)) {
            return NextResponse.json({ success: false, error: "Invalid number parameter" }, { status: 400 });
        }

        const data = await prisma.question.findUnique({
            where: { number },
        });

        if (!data) {
            return NextResponse.json({ success: false, error: "Person not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
        console.error("Error fetching data:", error);
        return NextResponse.json({ success: false, error: "Failed to get data" }, { status: 500 });
    }
};

export async function PATCH(req: Request) {
    try {
        const url = new URL(req.url);
        const numberParam = url.searchParams.get("number");
  
        if (!numberParam) {
        return NextResponse.json({ success: false, error: "Number parameter is required" }, { status: 400 });
        }

        const number = parseInt(numberParam, 10);
        if (isNaN(number)) {
        return NextResponse.json({ success: false, error: "Invalid number parameter" }, { status: 400 });
        }

        const { isUsed } = await req.json();
            if (typeof isUsed !== "boolean") {
                return NextResponse.json({ success: false, error: "Invalid isUsed value" }, { status: 400 });
        }

        const updatedQuestion = await prisma.question.update({
            where: { number },
            data: { isUsed },
        });

        return NextResponse.json({ success: true, data: updatedQuestion }, { status: 200 });
    } catch (error) {
        console.error("Error updating question:", error);
        return NextResponse.json({ success: false, error: "Failed to update question" }, { status: 500 });
    }
  }