// src/hooks/useNoButtonEscape.js
import { useState, useCallback, useRef } from 'react';
import { escapeMessages } from '../data/questions';

const BUTTON_W = 130;
const BUTTON_H = 52;
const MARGIN = 20;
const THRESHOLD = 130;

export function useNoButtonEscape() {
  const [noPos, setNoPos] = useState({ x: null, y: null });
  const [escapeMessage, setEscapeMessage] = useState('');
  const [showEscapeMsg, setShowEscapeMsg] = useState(false);
  const lastMsgRef = useRef('');
  const msgTimerRef = useRef(null);
  const isMovingRef = useRef(false);

  const getSafePosition = useCallback((yesRect) => {
    const maxX = window.innerWidth - BUTTON_W - MARGIN;
    const maxY = window.innerHeight - BUTTON_H - MARGIN;

    let attempts = 0;
    let x, y;

    do {
      x = Math.random() * (maxX - MARGIN) + MARGIN;
      y = Math.random() * (maxY - MARGIN) + MARGIN;
      attempts++;

      // Avoid overlapping YES button if its rect is known
      if (yesRect) {
        const overlapX = x < yesRect.right + 20 && x + BUTTON_W > yesRect.left - 20;
        const overlapY = y < yesRect.bottom + 20 && y + BUTTON_H > yesRect.top - 20;
        if (overlapX && overlapY && attempts < 20) continue;
      }
      break;
    } while (attempts < 30);

    return { x, y };
  }, []);

  const showMessage = useCallback(() => {
    // Pick a different message than last time
    let available = escapeMessages.filter(m => m !== lastMsgRef.current);
    const msg = available[Math.floor(Math.random() * available.length)];
    lastMsgRef.current = msg;

    setEscapeMessage(msg);
    setShowEscapeMsg(true);

    if (msgTimerRef.current) clearTimeout(msgTimerRef.current);
    msgTimerRef.current = setTimeout(() => {
      setShowEscapeMsg(false);
    }, 2000);
  }, []);

  const moveNoButton = useCallback((yesRect) => {
    if (isMovingRef.current) return;
    isMovingRef.current = true;

    const pos = getSafePosition(yesRect);
    setNoPos(pos);
    showMessage();

    setTimeout(() => {
      isMovingRef.current = false;
    }, 250);
  }, [getSafePosition, showMessage]);

  // Mouse proximity detection
  const handleMouseMove = useCallback((e, noBtnRef, yesBtnRef) => {
    if (!noBtnRef.current || noPos.x === null) return;

    const noRect = noBtnRef.current.getBoundingClientRect();
    const noCenterX = noRect.left + noRect.width / 2;
    const noCenterY = noRect.top + noRect.height / 2;

    const dx = e.clientX - noCenterX;
    const dy = e.clientY - noCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < THRESHOLD) {
      const yesRect = yesBtnRef?.current?.getBoundingClientRect() || null;
      moveNoButton(yesRect);
    }
  }, [noPos.x, moveNoButton]);

  const handlePointerDown = useCallback((e, yesBtnRef) => {
    e.preventDefault();
    e.stopPropagation();
    const yesRect = yesBtnRef?.current?.getBoundingClientRect() || null;
    moveNoButton(yesRect);
  }, [moveNoButton]);

  const initPosition = useCallback((yesBtnRef) => {
    const yesRect = yesBtnRef?.current?.getBoundingClientRect() || null;
    const pos = getSafePosition(yesRect);
    setNoPos(pos);
  }, [getSafePosition]);

  return {
    noPos,
    escapeMessage,
    showEscapeMsg,
    handleMouseMove,
    handlePointerDown,
    initPosition,
    moveNoButton,
  };
}
