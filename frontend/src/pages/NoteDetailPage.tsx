// src/pages/NoteDetailPage.tsx

import { useEffect, useState } from 'react';
// useNavigate, useParams Hook 가져와!
import { useParams, useNavigate } from 'react-router-dom';
// axios 라이브러리와 에러 타입 가져와! (any 에러 해결!)
import axios, { AxiosError } from 'axios';
import '../styles/global.css'; // 전역 스타일 가져와!
// 날짜 포맷팅 함수 가져와! (utils 폴더에 만들었던!)
import { formatKoreanDateTime } from '../utils/formatDate';

// 백엔드에서 받아올 노트 데이터의 모양을 정의하는 인터페이스
interface Note {
  _id: string; // MongoDB에서 오는 _id
  title: string; // 노트 제목
  content: string; // 노트 내용
  createdAt?: string; // 선택 사항 (있을 수도 없을 수도)
  updatedAt?: string; // 선택 사항
  // 필요한 다른 속성들이 있다면 여기에 더 추가해주면 돼!
}

// 백엔드 API 기본 URL (토니 백엔드 서버 주소에 맞게 수정해줘!)
const API_BASE_URL = 'http://localhost:5000/api/notes'; // ★★★ 토니 환경에 맞게 수정! ★★★


function NoteDetailPage() {
  // URL 파라미터에서 :id 값을 가져와! string 타입으로 알려주자!
  const { id } = useParams<{ id: string }>();

  // 가져온 노트 데이터를 저장할 상태 (Note 객체 또는 null)
  const [note, setNote] = useState<Note | null>(null);

  // 데이터를 가져오는 중인지 상태 (로딩 스피너 등에 사용)
  const [loading, setLoading] = useState(true);

  // 데이터를 가져오다가 에러가 났는지 상태 (에러 메시지 표시 등에 사용)
  const [error, setError] = useState<string | null>(null);

  // 페이지 이동 함수 가져와! (useNavigate Hook!)
  const navigate = useNavigate();
  
  const handleEditClick = () => {
    console.log(`[DetailPage] 수정 버튼 클릭! 노트 ID: ${id}`);
    // ★★★ 노트 수정 페이지 경로로 이동! ID 값을 주소에 포함시켜서! ★★★
    navigate(`/edit/${id}`); // <-- 이 함수가 페이지 이동을 해줄 거야!
  };

  // ★★★ 삭제 버튼 클릭 시 실행될 함수! ★★★
  const handleDeleteClick = async () => { // 삭제 요청은 비동기 작업이니 async 함수로 만들어야 해!
      console.log(`[DetailPage] 삭제 버튼 클릭! 노트 ID: ${id}`);

      // ★★★ 사용자에게 정말 삭제할 건지 물어보는 확인창 띄우기! ★★★
      // window.confirm() 함수는 사용자가 '확인' 누르면 true, '취소' 누르면 false를 반환해.
      if (window.confirm('정말 이 노트를 삭제하시겠습니까?')) {
          // 사용자가 '확인'을 눌렀을 때만 삭제 진행!
          console.log(`[DetailPage] 사용자 삭제 확인 (ID: ${id})`);

          // ★★★ 백엔드 삭제 API 호출하는 비동기 함수를 여기 정의하거나 바로 호출할 수 있어! ★★★
          // 여기서는 바로 호출해 보자!

          // 삭제할 노트의 ID가 유효한지 다시 한번 체크!
          if (!id) {
               alert('삭제할 노트 정보를 찾을 수 없습니다.');
               navigate('/'); // ID가 없으면 홈으로 이동!
               return; // 함수 여기서 끝내기!
          }

          try {
             // ★★★ axios를 사용해서 백엔드 API로 DELETE 요청 보내기! ★★★
             // 주소는 API_BASE_URL + '/' + ID (예: http://localhost:5000/api/notes/60f7b3b3f3f3f3f3f3f3f3f3)
             const response = await axios.delete(`${API_BASE_URL}/${id}`);

             // 요청이 성공했을 때! (백엔드에서 보통 삭제 성공 메시지 등을 응답으로 보냄!)
             console.log('[DetailPage] 노트 삭제 성공:', response.data);
             alert('노트가 성공적으로 삭제되었습니다!'); // 성공 메시지 알림창!

             // ★★★ 삭제 성공했으니 노트 목록 페이지(/)로 이동! ★★★
             navigate('/'); // 홈으로 이동!

          } catch (error: unknown) { // 에러 타입은 unknown으로! (AxiosError 에러 해결!)
             // 요청 실패했을 때
             console.error('[DetailPage] 노트 삭제 실패:', error);

             if (error instanceof AxiosError) { // 에러가 Axios 에러인지 확인!
                 console.error('[DetailPage] Axios 에러 상세:', error.response?.status, error.response?.data);
                 const errorMessage = error.response?.data?.message || '노트 삭제에 실패했습니다.';
                 // setError(errorMessage); // 삭제 실패 시에는 에러 메시지를 화면에 보여주기보다 알림창이 나을 수 있어.
                 alert(errorMessage); // 알림창으로 보여주기!
             } else if (error instanceof Error) {
                  alert(`오류 발생: ${error.message}`);
             } else {
                  alert('알 수 없는 오류가 발생했습니다.');
             }
              // 실패했을 때는 페이지 이동하지 않고 상세 페이지에 그대로 남아있게 할 수 있어!
          }

      } else {
          // 사용자가 '취소'를 눌렀을 때!
          console.log('[DetailPage] 사용자 삭제 취소');
          // 아무것도 안 하고 함수 종료!
      }
  };

  // useEffect Hook! 컴포넌트가 처음 나타났을 때 또는 id가 바뀔 때 실행!
  useEffect(() => {
    // 특정 ID를 가진 노트 데이터를 백엔드에서 가져오는 비동기 함수 정의!
    const fetchNote = async () => {
      console.log(`[DetailPage] 데이터 가져오는 중... (ID: ${id})`);
      try {
        setLoading(true); // 데이터 가져오기 시작! 로딩 상태 true!
        setError(null); // 혹시 이전 에러가 있다면 초기화!

        // axios를 사용해서 백엔드 API로 GET 요청 보내기! 특정 ID를 주소에 붙여서 보내!
        const response = await axios.get(`${API_BASE_URL}/${id}`);

        // 요청 성공했을 때! (받아온 데이터는 response.data 에 있어!)
        console.log(`[DetailPage] 노트 (ID: ${id}) 데이터 가져오기 성공:`, response.data);
        setNote(response.data); // 가져온 데이터로 note 상태 업데이트!

      } catch (error: unknown) { // ★★★ 여기 에러 타입을 unknown으로 명시! (any 에러 해결!) ★★★
        // 요청 실패했을 때
        console.error(`[DetailPage] 노트 (ID: ${id}) 데이터 가져오기 실패:`, error);

        // 에러 객체가 AxiosError 타입인지 확인!
        if (axios.isAxiosError(error)) { // <-- 여기에서 axios.isAxiosError 함수를 사용!
          console.error('[DetailPage] Axios 에러 상세:', error.response?.status, error.response?.data);

          // 만약 404 에러라면 (노트를 찾을 수 없다면)
          if (error.response && error.response.status === 404) {
             alert('요청하신 노트를 찾을 수 없습니다.');
             navigate('/'); // 홈으로 이동!
             setError('노트를 찾을 수 없습니다.'); // 에러 메시지 상태 업데이트
          } else if (error.message) {
             // 다른 에러라면 에러 메시지를 보여주거나...
             setError(`노트 데이터를 불러오는데 실패했습니다: ${error.message}`); // 에러 메시지 상태 업데이트
             alert('노트 데이터를 불러오는데 실패했습니다. 다시 시도해주세요.');
          } else {
             setError('알 수 없는 오류가 발생했습니다.');
             alert('알 수 없는 오류가 발생했습니다.');
          }
        } else if (error instanceof AxiosError) { // 일반적인 자바스크립트 Error 객체인 경우
             setError(`오류 발생: ${error.message}`);
             alert(`오류 발생: ${error.message}`);
        } else { // 그 외 알 수 없는 에러 타입인 경우
             setError('알 수 없는 오류가 발생했습니다.');
             alert('알 수 없는 오류가 발생했습니다.');
        }
        setNote(null); // 실패했으니 노트 데이터는 null로!

      } finally {
        // 성공하든 실패하든 데이터 가져오는 작업이 끝났으니 로딩 상태 false!
        setLoading(false);
      }
    };

    // URL 파라미터 id 값이 유효할 때만 데이터 가져오는 함수 실행!
    if (id) {
      fetchNote();
    } else {
        setError('노트 ID가 제공되지 않았습니다.');
        setLoading(false);
    }

    // 의존성 배열! id 값이 바뀔 때마다 useEffect가 다시 실행되도록 id를 넣어줘!
  }, [id, navigate]); // navigate는 의존성 배열에 넣는 것이 권장돼!


  // ★★★ 로딩 중일 때 보여줄 화면 ★★★
  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px' }}>
        <p>데이터 가져오는 중...</p>
      </div>
    );
  }

  // ★★★ 에러가 났을 때 보여줄 화면 ★★★
  if (error) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>
        <p>{error}</p>
        {/* 목록으로 돌아가기 버튼 - add-button 클래스 사용 */}
        <button className="add-button" onClick={() => navigate('/')} style={{ marginTop: '20px' }}>목록으로 돌아가기</button>
      </div>
    );
  }

  // ★★★ 노트 데이터가 성공적으로 로드되었을 때 보여줄 화면 ★★★
  // note 상태가 null이 아닐 때!
  return (
    <div className="container">
      {/* note 데이터가 있을 때만 내용을 보여줘! */}
      {note ? (
        <>
          {/* ★★★ 상세 정보 컨테이너에 CSS 클래스 적용! (global.css에 스타일 정의) ★★★ */}
          <div className="note-detail-table">

            {/* ★★★ 상세 페이지 제목 (노트 제목) - h2 태그! ★★★ */}
            <h2>{note.title}</h2>

            {/* ★★★ 표 내용 전체를 감싸는 div (optional) ★★★ */}
            {/* global.css에 .note-detail-table .table-content 스타일 정의 */}
            <div className="table-content">

              {/* ★★★ 내용 (content) 항목 ★★★ */}
              {/* global.css에 .note-detail-table .detail-item 스타일 정의 */}
              <div className="detail-item">
                <h3>내용</h3>
                <p> {/* global.css에 .note-detail-table .detail-item p 스타일 정의 */}
                     {note.content}
                </p>
              </div>

              {/* ★★★ 작성 날짜 (createdAt) 항목 ★★★ */}
              {/* global.css에 .note-detail-table .detail-item 스타일 정의 */}
              <div className="detail-item">
                <h3>작성일</h3>
                <p className="date-text"> {/* ★★★ 날짜 p 태그에 date-text 클래스 적용! ★★★ */}
                    {formatKoreanDateTime(note.createdAt)} {/* ★★★ 날짜 포맷팅 함수 사용! ★★★ */}
                </p>
              </div>

              {/* ★★★ 수정 날짜 (updatedAt) 항목 ★★★ */}
              {/* global.css에 .note-detail-table .detail-item 스타일 정의 */}
              {/* 마지막 항목은 border-bottom이 사라지도록 global.css에서 :last-child로 처리했어! */}
              <div className="detail-item">
                <h3>수정일</h3>
                <p className="date-text"> {/* ★★★ 날짜 p 태그에 date-text 클래스 적용! ★★★ */}
                    {formatKoreanDateTime(note.updatedAt)} {/* ★★★ 날짜 포맷팅 함수 사용! ★★★ */}
                </p>
              </div>

            </div> {/* // 표 내용 전체 감싸는 div 끝 */}
          </div> {/* // 상세 정보 표 컨테이너 끝 */}


          {/* ★★★ 버튼 영역에 CSS 클래스 적용! (global.css에 스타일 정의) ★★★ */}
          <div className="note-detail-buttons">
              {/* '목록으로' 버튼 - add-button 클래스 사용. global.css에서 버튼 사이 마진 처리 */}
              <button className="add-button" onClick={() => navigate('/')}>목록으로</button>

              {/* 수정 버튼 - add-button과 edit-button 클래스 함께 사용! */}
              <button className="add-button edit-button" onClick={handleEditClick}>수정</button> 

              {/* 삭제 버튼 - add-button과 delete-button 클래스 함께 사용! */}
              <button className="add-button delete-button" onClick={handleDeleteClick}>삭제</button> 

          </div>
        </>
      ) : (
           // note가 null일 경우 (데이터는 못 가져왔는데 에러도 아닐 때? 거의 없겠지만!)
           <p style={{ textAlign: 'center', marginTop: '50px' }}>노트 데이터를 불러올 수 없습니다.</p>
      )}
    </div>
  );
}

export default NoteDetailPage;
