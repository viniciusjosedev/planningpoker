// Gera um UUID v4 simples
export function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// Recupera ou cria um userId no localStorage
export function getUserId(): string {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = generateUserId();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

// Salva/recupera o nome do usuário
export function setUserName(name: string): void {
  localStorage.setItem('userName', name);
}

export function getUserName(): string | null {
  return localStorage.getItem('userName');
}
