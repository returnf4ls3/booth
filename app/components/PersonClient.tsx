'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import axios from "axios";

interface ClientComponentProps {
  personData: {
    name: string;
    number: number;
    imageUrl: string;
  };
  questionData: {
    text: string;
    number: number;
  };
}

const ClientComponent = ({ personData, questionData }: ClientComponentProps) => {
  const [answer, setAnswer] = useState("");
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [count, setCount] = useState(0);
  const router = useRouter();

  const handleSubmit = async () => {
    if (answer === personData.name) {
      setIsCorrect(true);
      try {
        await axios.patch(`/api/question?number=${questionData.number}`, { isUsed: true });
      } catch (error) {
        console.error("Failed to update question status", error);
      }
    } else {
      setIsCorrect(false);
    }
  };

  const handleEnter = async (e: any) => {
    if (e.code === 'Enter') {
      setCount((value) => value + 1);
      if (count >= 1) {
        handleGoBack();
      }
    }
    if (e.code === 'Enter' && count <= 1) {
      if (answer === personData.name) {
        setIsCorrect(true);
        try {
          await axios.patch(`/api/question?number=${questionData.number}`, { isUsed: true });
        } catch (error) {
          console.error("Failed to update question status", error);
        }
      } else {
        setIsCorrect(false);
        try {
          await axios.patch(`/api/question?number=${questionData.number}`, { isUsed: true });
        } catch (error) {
          console.error("Failed to update question status", error);
        }
      }
    }
  }

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-custom from-green-400 via-blue-500 to-purple-600 text-white">
      <h1 className="text-4xl font-bold mb-4">{personData.number}번</h1>
      <Image alt="image" src={personData.imageUrl} width={500} height={500} />
      <p className="text-lg mt-2">{questionData.text}</p>

      <div className="flex flex-col pt-4 items-center justify-center">
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          onKeyDown={(e) => handleEnter(e)}
          className="mt-4 p-2 rounded-md text-black"
          placeholder="정답을 입력하세요"
        />
        <button
          onClick={handleSubmit}
          className="mt-4 p-2 bg-blue-500 rounded-md text-white"
        >
          제출
        </button>
        {isCorrect !== null && (
        <div className="mt-4 text-xl">
          {isCorrect ? (
            <>
              <p className="text-green-500">정답!</p>
              <p>{personData.name}</p>
            </>
          ) : (
            <>
              <p className="text-red-500">오답!</p>
              <p>{personData.name}</p>
            </>
          )}
          </div>
        )}
        <button
          onClick={handleGoBack}
          className="mt-4 p-2 bg-gray-500 rounded-md text-white"
        >
          돌아가기
        </button>
      </div>
    </div>
  );
};

export default ClientComponent;
