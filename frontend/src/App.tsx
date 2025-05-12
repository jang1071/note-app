import HomePage from './pages/HomePage'
// BrowserRouter와 Route, Routes 컴포넌트를 가져와!
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NewNotePage from './pages/NewNotePage';
import NoteDetailPage from './pages/NoteDetailPage';
import EditNotePage from './pages/EditNotePage'; 

function App() {

  return (
    // BrowserRouter로 전체 앱을 감싸줘서 라우팅 기능을 사용하게 해!
    <BrowserRouter>
      {/* Routes는 여러 Route들을 그룹화 해주는 역할이야. */}
      <Routes>
        {/* Route는 특정 경로에 어떤 컴포넌트를 보여줄지 정의해! */}
        {/* path="/"는 우리 앱의 메인 경로(주소창에 아무것도 없을 때)를 의미해. */}
        {/* element={<HomePage />}는 그 경로에서 HomePage 컴포넌트를 보여주겠다는 뜻이야. */}
        <Route path="/" element={<HomePage />} />
        <Route path="/new" element={<NewNotePage />} /> 
        <Route path="/notes/:id" element={<NoteDetailPage />} />
        <Route path="/edit/:id" element={<EditNotePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
