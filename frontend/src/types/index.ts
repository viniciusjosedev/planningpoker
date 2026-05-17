export interface Player {
  id: string;
  name: string;
  isSpectator: boolean;
  vote: number | null;
}

export interface Room {
  id: string;
  players: Player[];
  revealed: boolean;
  average: number | null;
}

export interface SocketEvents {
  // Client -> Server
  createRoom: (name: string, isSpectator: boolean) => void;
  joinRoom: (roomId: string, name: string, isSpectator: boolean) => void;
  vote: (value: number) => void;
  revealVotes: () => void;
  resetVotes: () => void;
  leaveRoom: () => void;

  // Server -> Client
  roomCreated: (roomId: string) => void;
  roomJoined: (room: Room) => void;
  roomUpdated: (room: Room) => void;
  votesRevealed: (room: Room) => void;
  votesReset: (room: Room) => void;
  playerLeft: (room: Room) => void;
  error: (message: string) => void;
}

// Fibonacci sequence for planning poker cards
export const FIBONACCI_CARDS = [1, 2, 3, 5, 8, 13, 21, 34, 53] as const;
export type CardValue = typeof FIBONACCI_CARDS[number];
