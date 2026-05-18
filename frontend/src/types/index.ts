export interface Player {
  id: string;
  name: string;
  isSpectator: boolean;
  vote: number | null;
}

export interface Room {
  id: string;
  name: string;
  ownerId: string;
  players: Player[];
  revealed: boolean;
  average: number | null;
}

// WebSocket message types
export type WSMessageType =
  | 'createRoom'
  | 'joinRoom'
  | 'vote'
  | 'revealVotes'
  | 'resetVotes'
  | 'leaveRoom'
  | 'createdRoom'
  | 'roomJoined'
  | 'roomUpdated'
  | 'votesRevealed'
  | 'votesReset'
  | 'playerLeft'
  | 'error';

export interface WSMessage {
  type: WSMessageType;
  payload?: any;
}

// Fibonacci sequence for planning poker cards
export const FIBONACCI_CARDS = [0, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89] as const;
export type CardValue = typeof FIBONACCI_CARDS[number];
