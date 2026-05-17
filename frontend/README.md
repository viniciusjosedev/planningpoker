# Planning Poker - Frontend

Aplicação frontend de Planning Poker construída com React + Vite + TypeScript.

## Tecnologias

- **React 18** - Biblioteca UI
- **Vite** - Build tool e dev server
- **TypeScript** - Tipagem estática
- **Tailwind CSS** - Estilização
- **shadcn/ui** - Componentes UI
- **Socket.IO Client** - Comunicação WebSocket
- **React Confetti** - Animação de confetes
- **React Router** - Roteamento

## Funcionalidades

- ✅ Criar sala de poker
- ✅ Entrar em sala via link
- ✅ Modo espectador (spectator)
- ✅ Cards com animação de flip 3D
- ✅ Revelar votos
- ✅ Resetar votos
- ✅ Animação de confetes quando todos votam igual
- ✅ Tema dark mode (preto e branco)

## Estrutura de Rotas

- `/` - Página inicial para criar sala
- `/:roomId` - Sala de poker (join ou jogo)

## Cards Fibonacci

Os cards seguem a sequência de Fibonacci: 1, 2, 3, 5, 8, 13, 21, 34, 53

## Configuração

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do frontend:

```env
VITE_SOCKET_URL=http://localhost:3000
```

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

### Build

```bash
npm run build
```

## Integração com Backend (Go)

O frontend espera os seguintes eventos do Socket.IO:

### Client -> Server

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `createRoom` | `(name: string, isSpectator: boolean)` | Criar nova sala |
| `joinRoom` | `(roomId: string, name: string, isSpectator: boolean)` | Entrar em sala |
| `vote` | `(value: number)` | Votar com um card |
| `revealVotes` | `-` | Revelar todos os votos |
| `resetVotes` | `-` | Resetar votos |
| `leaveRoom` | `-` | Sair da sala |

### Server -> Client

| Evento | Payload | Descrição |
|--------|---------|-----------|
| `roomCreated` | `(roomId: string)` | Sala criada com sucesso |
| `roomJoined` | `(room: Room)` | Entrou na sala |
| `roomUpdated` | `(room: Room)` | Sala atualizada |
| `votesRevealed` | `(room: Room)` | Votos revelados |
| `votesReset` | `(room: Room)` | Votos resetados |
| `playerLeft` | `(room: Room)` | Jogador saiu |
| `error` | `(message: string)` | Erro |

### Tipos

```typescript
interface Player {
  id: string;
  name: string;
  isSpectator: boolean;
  vote: number | null;
}

interface Room {
  id: string;
  players: Player[];
  revealed: boolean;
  average: number | null;
}
```
