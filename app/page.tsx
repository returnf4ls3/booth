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
        Array.from({ length: 40 }, (_, i) => ({
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
    <div className="min-h-screen w-full bg-gradient-custom from-blue-400 via-purple-500 to-pink-500 flex flex-wrap gap-4 justify-center items-center p-4">
      {buttons.length > 0 &&
        Array.from({ length: 4 }).map((_, rowIndex) => (
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
                    ? "bg-gray-400 text-red-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                {button.usedInSchema ? "X" : `${button.id}`}
              </button>
            ))}
          </div>
        ))}
    </div>
  );
}
