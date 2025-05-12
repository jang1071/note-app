// src/pages/EditNotePage.tsx

import { useEffect, useState } from 'react';
// useNavigate, useParams Hook 가져옵니다.
import { useParams, useNavigate } from 'react-router-dom';
// axios 라이브러리와 에러 타입 가져옵니다. (AxiosError 에러 해결!)
import axios, { AxiosError } from 'axios'; // AxiosError를 가져옵니다.
import '../styles/global.css'; // 전역 스타일 가져옵니다.
// 날짜 포맷팅 함수는 이 페이지에서 필요하지 않습니다.

// 백엔드에서 받아올 노트 데이터의 모양을 정의하는 인터페이스
// 이 인터페이스는 상태 타입 지정 등에 사용됩니다. ('Note' is defined but never used 에러 해결!)
interface Note {
  _id: string; // MongoDB에서 오는 _id
  title: string; // 노트 제목
  content: string; // 노트 내용
  createdAt?: string; // 선택 사항 (있을 수도 없을 수도)
  updatedAt?: string; // 선택 사항
  // 필요한 다른 속성들이 있다면 여기에 더 추가해주세요.
}

// 백엔드 API 기본 URL (토니 백엔드 서버 주소에 맞게 수정해주세요!)
const API_BASE_URL = 'http://localhost:5000/api/notes'; // ★★★ 토니 환경에 맞게 이 주소를 수정해주세요! ★★★


function EditNotePage() {
  // URL 파라미터에서 :id 값을 가져옵니다. string 타입으로 알려줍니다.
  const { id } = useParams<{ id: string }>();

  // ★★★ 수정할 노트의 기존 제목과 내용을 저장할 상태를 만듭니다. ★★★
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  // ★★★ 데이터를 가져오는 중인지 상태입니다. ★★★
  const [loading, setLoading] = useState(true);

  // ★★★ 데이터를 가져오거나 수정 요청하다가 에러가 났는지 상태입니다. ★★★
  // ★★★ string 또는 null 타입을 사용합니다! (SetStateAction<Note | null> 에러 해결!) ★★★
  const [error, setError] = useState<string | null>(null);

  // 페이지 이동 함수 가져옵니다. (useNavigate Hook!)
  const navigate = useNavigate();

  // useEffect Hook! 컴포넌트가 처음 나타났을 때 또는 id가 바뀔 때 실행됩니다.
  // 이펙트 안에서 수정할 노트의 '기존 데이터'를 백엔드에서 가져옵니다.
  useEffect(() => {
    // 특정 ID를 가진 노트 데이터를 백엔드에서 가져오는 비동기 함수 정의!
    const fetchNote = async () => {
      console.log(`[EditPage] 기존 노트 데이터 가져오는 중... (ID: ${id})`);
      try {
        setLoading(true); // 데이터 가져오기 시작! 로딩 상태 true!
        setError(null); // 혹시 이전 에러가 있다면 초기화!

        // axios를 사용해서 백엔드 API로 GET 요청 보냅니다. 특정 ID를 주소에 붙여서 보냅니다.
        const response = await axios.get(`${API_BASE_URL}/${id}`);

        // 요청 성공했을 때! (받아온 데이터는 response.data 에 있습니다!)
        console.log(`[EditPage] 노트 (ID: ${id}) 데이터 가져오기 성공:`, response.data);

        // ★★★ 받아온 데이터가 Note 인터페이스 모양임을 명시적으로 알려줍니다! ★★★
        // response.data 의 타입을 Note로 단언(assertion)합니다.
        const noteData = response.data as Note; // <-- 이 줄을 추가하고!

        // ★★★ 가져온 기존 데이터(noteData)로 title, content 상태 업데이트합니다. ★★★
        setTitle(noteData.title); // <-- 여기를 noteData.title 로!
        setContent(noteData.content); // <-- 여기를 noteData.content 로!


      } catch (error: unknown) { // 에러 타입을 unknown으로 명시합니다. (any 에러 해결!)
        // ... (catch 블록 나머지 코드 - 이전과 동일) ...
        // 에러 객체가 AxiosError 타입의 인스턴스인지 확인합니다!
        if (error instanceof AxiosError) { // <-- 여기에서 AxiosError 타입을 직접 사용합니다!
             // ... (Axios 에러 처리 코드) ...
        } else if (error instanceof Error) {
             // ... (일반 Error 처리 코드) ...
        } else {
             // ... (알 수 없는 에러 처리 코드) ...
        }

      } finally {
        setLoading(false);
      }
    };

    // URL 파라미터 id 값이 유효할 때만 데이터 가져오는 함수 실행!
    if (id) {
      fetchNote();
    } else {
        // ★★★ setError에는 string 또는 null만 할당 가능합니다! ★★★ (SetStateAction 에러 해결!)
        setError('수정할 노트 ID가 제공되지 않았습니다.');
        setLoading(false);
    }

    // 의존성 배열! id 값이 바뀔 때마다 useEffect가 다시 실행되도록 id를 넣어줍니다.
  }, [id, navigate]); // navigate는 의존성 배열에 넣는 것이 권장됩니다.

  // handleSaveNote 함수는 다음 코드 블록에서 이어집니다.
  // 로딩, 에러 화면, return JSX도 다음 코드 블록에서 이어집니다.
// src/pages/EditNotePage.tsx
// ★★★ 이 부분은 바로 앞의 코드 블록에 이어서 붙여넣어야 합니다! ★★★

  // '저장하기' 버튼을 눌렀을 때 실행될 함수 (이제 백엔드로 수정 요청을 보냅니다!)
  const handleSaveNote = async () => { // 비동기 함수로 만들어야 await를 쓸 수 있습니다!
    console.log('[EditPage] 수정 내용 저장 요청:', { title, content });

    // 제목이나 내용이 비어있으면 저장 안 되도록 간단하게 막습니다!
    if (!title || !content) {
      alert('제목과 내용을 모두 입력해주세요!');
      return; // 함수 여기서 끝냅니다!
    }

    // 수정할 노트의 ID가 유효한지 다시 한번 체크합니다!
    if (!id) {
         alert('수정할 노트 정보를 찾을 수 없습니다.');
         navigate('/'); // ID가 없으면 홈으로 이동합니다!
         return; // 함수 여기서 끝냅니다!
    }

    // ★★★ 저장 요청 시 로딩 상태나 에러 상태를 관리할 수 있습니다. ★★★
    // 예를 들어, 저장 버튼 비활성화, 저장 중 메시지 표시 등을 할 수 있습니다.
    // 지금은 간단하게 알림창과 콘솔 로그로만 처리합니다.

    try {
      // axios를 사용해서 백엔드 API로 PUT 요청 보냅니다!
      // 주소는 API_BASE_URL + '/' + ID (예: http://localhost:5000/api/notes/60f7b3b3f3f3f3f3f3f3f3f3)
      // 요청 본문에는 수정된 제목과 내용을 담아서 보냅니다.
      const response = await axios.put(`${API_BASE_URL}/${id}`, {
        title: title, // 요청 본문에 수정된 제목 데이터 담기
        content: content // 요청 본문에 수정된 내용 데이터 담기
      });

      // 요청이 성공했을 때! (백엔드에서 보통 업데이트된 노트 정보를 응답으로 보냅니다!)
      console.log('[EditPage] 노트 수정 성공:', response.data);
      alert('노트가 성공적으로 수정되었습니다!'); // 성공 메시지 알림창!

      // ★★★ 수정 성공했으니 수정된 노트의 상세 페이지(/notes/ID)로 이동합니다! ★★★
      navigate(`/notes/${id}`);

    } catch (error: unknown) { // ★★★ 에러 타입을 unknown으로 명시합니다! (any 에러 해결!) ★★★
      // 요청 실패했을 때
      console.error('[EditPage] 노트 수정 실패:', error);

      // ★★★ 에러 객체가 AxiosError 타입의 인스턴스인지 확인합니다! ★★★
      if (error instanceof AxiosError) { // <-- 여기에서 AxiosError 타입을 직접 사용합니다! (AxiosError 에러 해결!)
          console.error('[EditPage] Axios 에러 상세:', error.response?.status, error.response?.data);
          // 백엔드에서 보낸 에러 메시지가 있다면 그걸 보여줘도 좋습니다!
          const errorMessage = error.response?.data?.message || '노트 수정에 실패했습니다.';
          // ★★★ setError에는 string 또는 null만 할당 가능합니다! ★★★ (SetStateAction 에러 해결!)
          setError(errorMessage); // 에러 메시지 상태 업데이트!
          alert(errorMessage); // 알림창으로 보여주기!
      } else if (error instanceof Error) { // 일반적인 Error 객체인 경우
           // ★★★ setError에는 string 또는 null만 할당 가능합니다! ★★★ (SetStateAction 에러 해결!)
           setError(`오류 발생: ${error.message}`);
           alert(`오류 발생: ${error.message}`);
      } else { // 그 외 알 수 없는 에러 타입인 경우
           // ★★★ setError에는 string 또는 null만 할당 가능합니다! ★★★ (SetStateAction 에러 해결!)
           setError('알 수 없는 오류가 발생했습니다.');
           alert('알 수 없는 오류가 발생했습니다.');
      }
       // 실패했을 때는 페이지 이동하지 않고 현재 페이지에 그대로 남아있게 할 수 있습니다.
    }
  };

  // ★★★ 로딩 중일 때 보여줄 화면 (기존 데이터 불러올 때) ★★★
  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>기존 노트 데이터 불러오는 중...</p>
      </div>
    );
  }

  // ★★★ 에러가 났을 때 보여줄 화면 (기존 데이터 불러올 때 에러 또는 수정 요청 에러 시) ★★★
  // 에러 상태에 값이 있고, 로딩 중이 아닐 때! (로딩 중일 때는 위에 로딩 화면이 보이도록)
  if (error && !loading) {
      return (
        <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
          <p>{error}</p>
          {/* 목록으로 돌아가기 버튼 - add-button 클래스 사용 */}
          <button className="add-button" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>목록으로 돌아가기</button>
        </div>
      );
    }


  // ★★★ 기존 노트 데이터 로드 성공 후 수정 화면 보여주기 ★★★
  // 로딩도 끝났고, 에러도 없고, title/content 상태에 기존 데이터가 잘 채워졌을 때!
  // (Note 객체 자체를 직접 렌더링하지 않습니다!) (ReactNode 에러 해결!)
  return (
    <div className="container"> {/* global.css에 정의된 container 스타일 적용! */}
      <h1>노트 수정</h1> {/* 페이지 제목 */}

      {/* 제목 입력 칸 - NewNotePage와 동일한 스타일 적용! */}
      <input
        type="text"
        placeholder="노트 제목"
        value={title} // value는 title 상태! (기존 데이터로 채워짐!)
        onChange={(e) => setTitle(e.target.value)} // 입력값이 바뀔 때마다 title 상태 업데이트!
      />

      {/* 내용 입력 칸 (textarea) - NewNotePage와 동일한 스타일 적용! */}
      <textarea
        placeholder="노트 내용"
        value={content} // value는 content 상태! (기존 데이터로 채워짐!)
        onChange={(e) => setContent(e.target.value)} // 입력값이 바뀔 때마다 content 상태 업데이트!
      ></textarea>

      <div className="note-detail-buttons"> {/* ★★★ 이 div를 추가하고 클래스 적용! ★★★ */}
          {/* '수정 내용 저장하기' 버튼 - save-button 클래스 사용! */}
          {/* 이 버튼은 이제 note-detail-buttons Flex 컨테이너의 자식이 돼! */}
          <button className="save-button" onClick={handleSaveNote}>
            수정 하기
          </button>

          {/* '수정 취소' 버튼 - add-button 클래스 사용! */}
          {/* 이 버튼도 note-detail-buttons Flex 컨테이너의 자식이 돼! */}
          <button className="add-button" onClick={() => navigate(`/notes/${id}`)}>수정 취소</button> {/* ★★★ 원래 수정 취소 버튼을 감쌌던 div는 이제 필요 없어! ★★★ */}
      </div> {/* ★★★ 이 div 닫는 태그 추가! ★★★ */}

      {/* 원래 수정 취소 버튼을 감쌌던 div는 이제 필요 없으니 삭제! */}
      {/* <div style={{ marginTop: '20px', textAlign: 'center' }}>
           <button className="add-button" onClick={() => navigate(`/notes/${id}`)}>수정 취소</button>
      </div> */}

    </div>
  );
}

export default EditNotePage;
