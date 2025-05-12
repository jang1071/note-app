import { useState } from 'react'; // useState Hook을 사용하기 위해 가져와!
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/global.css'; // 전역 스타일 가져오기

const API_BASE_URL = 'http://localhost:5000/api/notes'; 

function NewNotePage() {
  // 노트 제목과 내용을 저장할 상태(state)를 만들고, useState를 사용하여 값이 바뀌었을 때 리액트가 화면을 다시 그림
  const [title, setTitle] = useState(''); 
  const [content, setContent] = useState('');
  const navigate = useNavigate();

  // 저장 버튼을 눌렀을 때 실행될 함수
  const handleSaveNote = async() => {
    
    console.log('제목:', title);
    console.log('내용:', content);

    if(!title || !content) {
      alert('제목과 내용을 모두 입력해주세요!');
      return
    }

    try{
      // axios를 사용해서 백엔드 API로 POST 요청 보내기!
      const response = await axios.post(API_BASE_URL, {
        title: title,
        content: content
      });
      // 요청이 성공했을 때! (백엔드에서 201 응답을 보냈을 때)
      console.log('노트 저장 성공:', response.data);
      alert('새 노트가 등록되었습니다!');
      navigate('/');
    } catch(error) {
      // 요청 실패했을 때
      console.error('노트 저장 실패:', error);
      alert('노트 저장에 실패했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <div className="container"> {/* global.css에 정의된 container 스타일 적용! */}
      <h1>새 노트 작성</h1>

      <input
        type="text"
        placeholder="노트 제목"
        value={title} 
        onChange={(e) => setTitle(e.target.value)} 
      />

      {/* 내용 입력 칸 (textarea) */}
      <textarea
        placeholder="노트 내용"
        value={content}
        onChange={(e) => setContent(e.target.value)} // textarea 값이 바뀔 때마다 content 상태 업데이트!
      ></textarea>

      <button className='save-button' onClick={handleSaveNote}>
        저장하기
      </button>
    </div>
  );
}

export default NewNotePage;
