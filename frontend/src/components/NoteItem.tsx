import '../styles/global.css';

interface NoteItemProps{
  id: string;
  title: string;
  createdAt: string;
  onClick: (id: string) => void;
}

// NoteItemProps 타입으로 props를 받을 거라고 알려주는 거야!
function NoteItem({ id, title, createdAt, onClick }: NoteItemProps) {
  const handleItemClick = () => {
    console.log(`노트 아이템 클릭됨! ID: ${id}`);
    onClick(id);
  };

  const dateObj = new Date(createdAt); // 문자열 날짜를 자바스크립트 Date 객체로 변환
  // toLocaleString()을 사용해서 한국 시간, 원하는 형식으로 포맷!
  const formattedDate = dateObj.toLocaleString('ko-KR', {
    year: 'numeric', // 연도 (숫자 4자리)
    month: 'numeric', // 월 (숫자)
    day: 'numeric', // 일 (숫자)
    hour: '2-digit', // 시간 (2자리)
    minute: '2-digit', // 분 (2자리)
    // second: '2-digit', // 초도 넣고 싶으면 추가!
    // timeZoneName: 'short', // 시간대 이름 (예: KST)
    timeZone: 'Asia/Seoul', // ★★★ 이게 중요! 한국 시간대로! ★★★ [[8]](https://techbukket.com/blog/javascript-date)
    hour12: true // 오후/오전 표시 (true로 하면 12시간제)
  });
  // 결과 예시: "2025. 5. 11. 오후 10:20" 처럼 나올 거야!


  return (
    <div className='note-item' onClick={handleItemClick}>
      <h3 className="note-title">{title}</h3>
      <p>{formattedDate}</p>
    </div>
  );
}

export default NoteItem;


