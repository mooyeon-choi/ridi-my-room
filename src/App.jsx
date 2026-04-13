import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useParams } from 'react-router-dom';
import Home from './components/Home';
import MyRoom from './components/MyRoom';
import VisitorRoom from './components/VisitorRoom';
import MobileMyRoom from './components/MobileMyRoom';
import MobileVisitorRoom from './components/MobileVisitorRoom';
import MobileLayout from './components/MobileLayout';

function RedirectVisitorRoom() {
  const { userId } = useParams();
  return <Navigate to={`/web/${userId}/room`} replace />;
}

function KeyedVisitorRoom() {
  const { userId } = useParams();
  return <VisitorRoom key={userId} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 */}
        <Route path="/" element={<Home />} />

        {/* PC용 (세로모드, 상단 배경 + 하단 인터페이스) */}
        <Route path="/web/my-room" element={<MyRoom />} />
        <Route path="/web/:userId/room" element={<KeyedVisitorRoom />} />

        {/* 모바일용 (가로모드 강제, 전체화면 배경 + 하단 대사만) */}
        <Route path="/app/my-room" element={<MobileLayout><MobileMyRoom /></MobileLayout>} />
        <Route path="/app/:userId/room" element={<MobileLayout><MobileVisitorRoom /></MobileLayout>} />

        {/* 기존 경로 호환 → /web/으로 리다이렉트 */}
        <Route path="/my-room" element={<Navigate to="/web/my-room" replace />} />
        <Route path="/:userId/room" element={<RedirectVisitorRoom />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
