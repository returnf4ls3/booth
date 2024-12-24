'use client';

import { useEffect, useRef, useState } from "react";
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
  const correctSoundRef = useRef<HTMLAudioElement | null>(null);
  const incorrectSoundRef = useRef<HTMLAudioElement | null>(null);
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
      try {
        await axios.patch(`/api/question?number=${questionData.number}`, { isUsed: true });
      } catch (error) {
        console.error("Failed to update question status", error);
      }
    }
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleEnter = (e: any) => {
    if (e.code === 'Enter') {
      if (e.nativeEvent.isComposing === false) {
        e.preventDefault();
        setCount((prevCount) => prevCount + 1);
      }
    }
  };

  useEffect(() => {
    const checkAnswer = async () => {
      if (count === 1) {
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
    };

    checkAnswer();

  }, [count, answer, personData.name, questionData.number]);

  useEffect(() => {
    if (count === 2) {
      handleGoBack();
    }
  }, [count]);

  useEffect(() => {
    if (isCorrect === false && incorrectSoundRef.current) {
      incorrectSoundRef.current.play();
    }
  }, [isCorrect]);

  useEffect(() => {
    if (isCorrect === true && correctSoundRef.current) {
      correctSoundRef.current.play();
    }
  }, [isCorrect]);

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-600 via-red-500 to-white text-white">
      <h1 className="text-4xl font-bold mb-4">{personData.number}번</h1>
      <Image className="rounded-xl" alt="image" src={personData.imageUrl} width={500} height={500} />
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
        <div className="mt-4 text-xl flex flex-col text-center items-center">
          {isCorrect ? (
            <>
              <p className="text-green-500">정답!</p>
              <p className="text-black">{personData.name}</p>
              <audio ref={correctSoundRef} autoPlay src="/correct.mp3" />
            </>
          ) : (
            <>
              <p className="text-red-500">오답!</p>
              <audio ref={incorrectSoundRef} autoPlay src="/laugh.mp3" />
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
