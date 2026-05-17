import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';
import { PokerRoomPage } from '@/pages/PokerRoomPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/:roomId" element={<PokerRoomPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
