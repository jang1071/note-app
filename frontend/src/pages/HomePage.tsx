import {useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import NoteItem from '../components/NoteItem';
import '../styles/global.css'


interface Note {
  _id: string; // MongoDB에서 오는 _id (보통 문자열로 받아와져!)
  title: string; // 노트 제목 (문자열)
  content: string; // 노트 내용 (문자열)
  createdAt?: string; // 선택 사항: 생성 날짜가 있다면 추가! (문자열 또는 Date 타입일 수 있어)
  updatedAt?: string; // 선택 사항: 수정 날짜가 있다면 추가! (문자열 또는 Date 타입일 수 있어)
  // 필요한 다른 속성들이 있다면 여기에 더 추가해주면 돼!
}

const API_BASE_URL = 'http://localhost:5000/api/notes';

function HomePage() {
    const [notes, setNotes] = useState<Note[]>([]);
    const navigate = useNavigate();

    const handleCreateNewNote = () => {
        navigate('/new');
    };
    
    const handleNoteItemClick = (id: string) => {
    console.log(`HomePage에서 노트 아이템 클릭 감지! 이동할 노트 ID: ${id}`);
        // ★★★ useNavigate Hook을 사용해서 상세 페이지 경로로 이동! ★★★
        navigate(`/notes/${id}`); // <-- 페이지 이동! id 값은 NoteItem에서 받아온 것 사용!
    };


    // ★★★ useEffect Hook 사용! ★★★
    // 컴포넌트가 처음 화면에 나타났을 때(마운트되었을 때) 딱 한 번 실행될 코드를 여기 넣을 거야!
      useEffect(() => {
    // 백엔드에서 노트 목록을 가져오는 비동기 함수를 useEffect 안에서 정의해!
    const fetchNotes = async () => {
      try {
        // axios를 사용해서 백엔드 API로 GET 요청 보내기!
        const response = await axios.get(API_BASE_URL);

        console.log('노트 목록 가져오기 성공:', response.data);
        // 가져온 데이터로 notes 상태 업데이트! -> 리액트가 화면을 다시 그려줘!
        setNotes(response.data);
      } catch (error) {
        // 요청 실패했을 때
        console.error('노트 목록 가져오기 실패:', error);
        alert('노트 목록을 불러오는데 실패했습니다. 다시 시도해주세요.');
        // 에러 발생 시에는 노트 목록을 빈 배열로 유지하거나 다른 처리를 할 수 있어.
        // setNotes([]); // 에러 났을 때 목록 비우기
      }
    };

    // useEffect 안에서 정의한 fetchNotes 함수를 바로 호출해서 실행해줘!
    fetchNotes();

  }, []); // ★★★ 중요한 부분! 빈 배열([ ])을 두 번째 인자로 넣어주면! ★★★
          // 이 useEffect는 컴포넌트가 '처음 마운트될 때' 딱 한 번만 실행돼!
          // 만약 이 빈 배열이 없으면, notes 상태가 업데이트될 때마다 (setNotes 호출될 때마다)
          // useEffect가 계속 실행돼서 무한 루프에 빠질 수 있어! 😱

    return (
    <div className="container">
      <h1>나의 노트 목록</h1>

      <button className="add-button" onClick={handleCreateNewNote}>
        + 새 노트 작성
      </button>

      {/* ★★★ 노트 목록 데이터 (notes 상태) 가 비어있는지 확인! ★★★ */}
      {notes.length === 0 ? (
        // ★★★ notes 배열이 비어있으면 이 메시지를 보여줘! ★★★
        <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '1.2rem', color: '#555' }}>
          아직 작성된 노트가 없습니다.<br/>새 노트를 작성해보세요!
        </p>
      ) : (
        // ★★★ notes 배열에 데이터가 있으면 map 함수로 NoteItem 목록을 만들어 보여줘! ★★★
        // map 함수는 이제 mockNotes 대신 notes 상태를 사용할 거야!
        notes.map(note => (
          // MongoDB에서 가져온 노트 데이터는 보통 _id 필드를 가지고 있어!
          // key 값으로 note._id를 사용하면 돼!
          <NoteItem 
            key={note._id}
            id={note._id} 
            title={note.title} 
            createdAt={note.createdAt || ''} 
            onClick={handleNoteItemClick}
            />
          // 나중에 내용 미리보기 같은 것도 보여주고 싶으면 여기 NoteItem에 props로 넘겨주면 돼!
          // <NoteItem key={note._id} title={note.title} contentPreview={note.content.substring(0, 100) + '...'} />
        ))
      )}

    </div>
  );
}

export default HomePage;
