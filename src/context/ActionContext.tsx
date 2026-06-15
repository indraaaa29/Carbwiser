import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from 'react';
import type { CommittedAction } from '../types';

const STORAGE_KEY = 'carbwiser_actions';

function loadActionsFromStorage(): CommittedAction[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

function saveActionsToStorage(actions: CommittedAction[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(actions));
}

interface ActionContextValue {
  actions: CommittedAction[];
  commitAction: (action: Omit<CommittedAction, 'committedAt' | 'status'>) => void;
  removeAction: (id: string) => void;
  markActionCompleted: (id: string) => void;
}

const ActionContext = createContext<ActionContextValue | null>(null);

export function ActionProvider({ children }: { children: ReactNode }) {
  const [actions, setActions] = useState<CommittedAction[]>(() => loadActionsFromStorage());

  // Save to local storage whenever actions change
  useEffect(() => {
    saveActionsToStorage(actions);
  }, [actions]);

  const commitAction = useCallback((actionData: Omit<CommittedAction, 'committedAt' | 'status'>) => {
    setActions((prev) => {
      // Avoid duplicates
      if (prev.some(a => a.id === actionData.id)) return prev;
      
      const newAction: CommittedAction = {
        ...actionData,
        committedAt: Date.now(),
        status: 'committed',
      };
      return [...prev, newAction];
    });
  }, []);

  const removeAction = useCallback((id: string) => {
    setActions((prev) => prev.filter(a => a.id !== id));
  }, []);

  const markActionCompleted = useCallback((id: string) => {
    setActions((prev) => prev.map(a => 
      a.id === id ? { ...a, status: 'completed', completedAt: Date.now() } : a
    ));
  }, []);

  return (
    <ActionContext.Provider value={{ actions, commitAction, removeAction, markActionCompleted }}>
      {children}
    </ActionContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useActions(): ActionContextValue {
  const ctx = useContext(ActionContext);
  if (!ctx) throw new Error('useActions must be used within an ActionProvider');
  return ctx;
}
