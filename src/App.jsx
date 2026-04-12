import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MyRoom from './components/MyRoom';
import VisitorRoom from './components/VisitorRoom';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* 홈 - 로그인 후 내 서재로 리다이렉트 */}
        <Route path="/" element={<Home />} />

        {/* 내 서재 */}
        <Route path="/my-room" element={<MyRoom />} />

        {/* 다른 사람 서재 방문 */}
        <Route path="/:userId/room" element={<VisitorRoom />} />

        {/* 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
