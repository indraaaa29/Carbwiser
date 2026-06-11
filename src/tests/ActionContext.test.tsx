import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { ActionProvider, useActions } from '../context/ActionContext';
import React from 'react';

describe('ActionContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('provides empty actions initially', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ActionProvider>{children}</ActionProvider>
    );

    const { result } = renderHook(() => useActions(), { wrapper });
    
    expect(result.current.actions).toEqual([]);
  });

  it('can commit, complete, and remove an action', () => {
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <ActionProvider>{children}</ActionProvider>
    );

    const { result } = renderHook(() => useActions(), { wrapper });

    // Commit Action
    act(() => {
      result.current.commitAction({
        id: 'test-1',
        title: 'Test Action',
        category: 'mobility',
        estimatedReduction: 100,
        difficulty: 'easy'
      });
    });

    expect(result.current.actions.length).toBe(1);
    expect(result.current.actions[0].id).toBe('test-1');
    expect(result.current.actions[0].status).toBe('committed');

    // Mark Completed
    act(() => {
      result.current.markActionCompleted('test-1');
    });

    expect(result.current.actions[0].status).toBe('completed');
    expect(result.current.actions[0].completedAt).toBeDefined();

    // Remove Action
    act(() => {
      result.current.removeAction('test-1');
    });

    expect(result.current.actions.length).toBe(0);
  });
});
