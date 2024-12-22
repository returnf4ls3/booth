import { NextResponse } from "next/server";
import prisma from "@/app/libs/prismadb";

export async function GET(req: Request) {
    try {
      const url = new URL(req.url);
      const numberParam = url.searchParams.get("number");
  
      if (!numberParam) {
        const data = await prisma.person.findMany();
  
        if (!data || data.length === 0) {
          return NextResponse.json({ success: false, error: "No data found" }, { status: 404 });
        }
  
        return NextResponse.json({ success: true, data }, { status: 200 });
      }
  
      const number = parseInt(numberParam, 10);
      if (isNaN(number)) {
        return NextResponse.json({ success: false, error: "Invalid number parameter" }, { status: 400 });
      }
  
      const data = await prisma.person.findUnique({
        where: { number },
      });
  
      if (!data) {
        return NextResponse.json({ success: false, error: "Person not found" }, { status: 404 }
        );
      }
  
      return NextResponse.json({ success: true, data }, { status: 200 });
    } catch (error) {
      console.error("Error fetching data:", error);
      return NextResponse.json({ success: false, error: "Failed to get data" }, { status: 500 });
    }
  }

export async function POST(req: Request) {
    try {
        const body = await req.json();

        if (!body || Object.keys(body).length === 0) {
          return NextResponse.json(
                { success: false, error: "Request body is empty" },
                { status: 400 }
            );
        }

        const { name, number, description, imageUrl } = body;

        if (!name || number == null) {
            return NextResponse.json(
                { success: false, error: "Name and number are required" },
                { status: 400 }
            );
        }

        const defaultQuestionText = "이 사람의 이름은?";

        const person = await prisma.person.create({
            data: {
                name,
                number,
                description: description || null,
                imageUrl: imageUrl || null,
                questions: {
                    create: [
                        {
                            text: defaultQuestionText,
                            number: number,
                            isUsed: false,
                        },
                    ],
                },
            },
        });

        return NextResponse.json({ success: true, data: person }, { status: 201 });
    } catch (error) {
        console.log(error);
        return NextResponse.json({ success: false, error: "Failed to add person" }, { status: 500 });
    }
}