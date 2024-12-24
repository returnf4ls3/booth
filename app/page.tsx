'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface ButtonData {
  id: number;
  usedInSchema: boolean;
}

export default function Home() {
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const router = useRouter();

  const fetchButtonData = async () => {
    try {
      const response = await axios.get("/api/question");
      const questionData = response.data.data;

      setButtons(
        Array.from({ length: 60 }, (_, i) => ({
          id: i + 1,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          usedInSchema: questionData.some((q: any) => q.number === i + 1 && q.isUsed),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch button data", error);
    }
  };

  useEffect(() => {
    fetchButtonData();
  }, []);

  const handleButtonClick = (id: number) => {
    setButtons((prevButtons) =>
      prevButtons.map((button) =>
        button.id === id
          ? { ...button, usedInSchema: true }
          : button
      )
    );
    router.push(`/person/${id}`);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-600 via-red-500 to-white flex flex-wrap gap-4 justify-center items-center p-4">
      <h1 className="w-full text-center text-4xl font-bold text-white mb-8">
        🎄 Merry Christmas! 🎅
      </h1>
      {buttons.length > 0 &&
        Array.from({ length: 6 }).map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="flex gap-4 justify-center w-full"
          >
            {buttons.slice(rowIndex * 10, (rowIndex + 1) * 10).map((button) => (
              <button
                key={button.id}
                onClick={() => handleButtonClick(button.id)}
                disabled={button.usedInSchema}
                className={`w-20 h-20 text-lg rounded-md font-semibold shadow-lg transition ${
                  button.usedInSchema
                    ? "bg-white text-gray-400 cursor-not-allowed border-2 border-gray-300"
                    : "bg-red-600 text-white hover:bg-green-700"
                }`}
              >
                {button.usedInSchema ? "❌" : `🎁 ${button.id}`}
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}
