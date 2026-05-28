---
name: component-logic-separation
description: "Separate UI rendering from business logic in React components. Use when: creating new pages, refactoring existing components, adding state or handlers to a component, reviewing component structure. Follows the hook pattern where logic lives in a custom hook and the component only renders HTML."
---

# Component Logic Separation

## Principle

**Logic goes in hooks. Rendering goes in components.**

A React component should not contain significant business logic. Instead, extract all state, handlers, and derived values into a custom hook with the same base name + `Hook` suffix.

## Pattern

```
src/pages/LoginPage.tsx      → UI only, calls the hook
src/hooks/useLoginPage.ts    → state, handlers, effects, derived values
```

## Rules

1. **Always extract when logic is non-trivial**
   - More than 1 `useState`
   - Any `useEffect`
   - Form handlers, validation, API calls
   - Derived/computed values

2. **Keep logic in the component only when trivial**
   - Single `useState` with simple setter
   - No handlers or effects
   - No derived values

3. **Hook naming convention**
   - Page `LoginPage.tsx` → hook `useLoginPage.ts`
   - Component `UserCard.tsx` → hook `useUserCard.ts`
   - Always prefix with `use`

4. **Hook return contract**
   - Return an object with all values the component needs
   - Group related values logically
   - Keep internal helpers private to the hook

## Example

### Hook (`useLoginPage.ts`)

```typescript
import { useState } from "react";

export function useLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    handleSubmit,
  };
}
```

### Component (`LoginPage.tsx`)

```tsx
import { Link } from "react-router-dom";
import { useLoginPage } from "@/hooks/useLoginPage";

export function LoginPage() {
  const { email, setEmail, password, setPassword, handleSubmit } =
    useLoginPage();

  return (
    <form onSubmit={handleSubmit}>
      <input value={email} onChange={(e) => setEmail(e.target.value)} />
      <input value={password} onChange={(e) => setPassword(e.target.value)} />
      <button type="submit">Entrar</button>
    </form>
  );
}
```

## Anti-patterns

- **Fat components**: 50+ lines of logic mixed with JSX
- **Generic hook names**: `useHook`, `useLogic` — always match the component
- **Returning JSX from hooks**: hooks never return React elements
- **Multiple responsibilities**: one hook per component/page
