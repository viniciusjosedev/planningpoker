import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { WebSocketProvider } from '@/contexts/WebSocketContext';
import { HomePage } from '@/pages/HomePage';
import { PokerRoomPage } from '@/pages/PokerRoomPage';

function App() {
  return (
    <WebSocketProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/:roomId" element={<PokerRoomPage />} />
        </Routes>
      </BrowserRouter>
    </WebSocketProvider>
  );
}

export default App;
