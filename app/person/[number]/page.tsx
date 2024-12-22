import PersonClient from "@/app/components/PersonClient";
import axios from "axios";

export default async function Page({ params }: { params: { number: number } }) {
  const { number } = await params;

  const fetchPersonData = async (number: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3000/api/person?number=${number}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const fetchQuestionData = async (number: number) => {
    try {
      const response = await axios.get(`http://127.0.0.1:3000/api/question?number=${number}`);
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const personData = await fetchPersonData(number);
  const questionData = await fetchQuestionData(number);

  if (!personData?.success || !questionData?.data) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-red-500">
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
