// 날짜 문자열을 받아서 보기 좋은 한국 시간 문자열로 포맷팅하는 함수!
export function formatKoreanDateTime(dateString: string | Date | undefined): string {
  // 만약 날짜 문자열이 없으면 빈 문자열 반환!
  if (!dateString) {
    return '';
  }

  try {
    // 날짜 문자열이나 Date 객체를 Date 객체로 변환!
    const dateObj = new Date(dateString);

    // 만약 Date 객체가 유효하지 않으면 (잘못된 날짜 형식 등)
    if (isNaN(dateObj.getTime())) {
       console.error('잘못된 날짜 형식입니다:', dateString);
       return '잘못된 날짜 형식'; // 또는 다른 에러 메시지
    }


    // toLocaleString()을 사용해서 한국 시간, 원하는 형식으로 포맷!
    const formattedDate = dateObj.toLocaleString('ko-KR', {
      year: 'numeric', // 연도 (숫자 4자리)
      month: 'numeric', // 월 (숫자)
      day: 'numeric', // 일 (숫자)
      hour: '2-digit', // 시간 (2자리)
      minute: '2-digit', // 분 (2자리)
      // second: '2-digit', // 초도 넣고 싶으면 추가!
      // timeZoneName: 'short', // 시간대 이름 (예: KST)
      timeZone: 'Asia/Seoul', // ★★★ 이게 중요! 한국 시간대로! ★★★
      hour12: true // 오후/오전 표시 (true로 하면 12시간제)
    });

    return formattedDate; // 포맷팅된 문자열 반환!

  } catch (error) {
     console.error('날짜 포맷팅 에러:', error, '원본 날짜:', dateString);
     return '날짜 포맷팅 오류'; // 에러 발생 시 메시지
  }
}

