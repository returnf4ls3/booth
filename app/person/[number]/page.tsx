import PersonClient from "@/app/components/PersonClient";
import axios from "axios";

export default async function Page({ params } : { params: Promise<{ number: number }> }) {
  const { number } = await params;

  const fetchPersonData = async (number: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3000/api/person?number=${number}`);
      return response.data;
    } catch {
      return null;
    }
  };

  const fetchQuestionData = async (number: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3000/api/question?number=${number}`);
      return response.data;
    } catch {
      return null;
    }
  };

  const personData = await fetchPersonData(number);
  const questionData = await fetchQuestionData(number);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  if (!personData?.success || !questionData?.data || personData === null || questionData === null) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-green-600 via-red-500 to-white text-white">
        <h2 className="text-2xl font-bold">인물 정보를 찾을 수 없습니다.</h2> 
        <p>잘못된 번호일 수 있습니다: {number}</p>
      </div>
    );
  }

  const { name, imageUrl } = personData.data;
  const { text } = questionData.data;

  return (
    <PersonClient personData={{ name, number, imageUrl }} questionData={{ text, number }} />
  );
}
