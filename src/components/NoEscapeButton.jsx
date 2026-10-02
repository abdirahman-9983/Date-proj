// src/components/NoEscapeButton.jsx
import { useEffect, useRef, useCallback } from 'react';
import { useNoButtonEscape } from '../hooks/useNoButtonEscape';

export default function NoEscapeButton({ yesBtnRef }) {
  const noBtnRef = useRef(null);
  const {
    noPos,
    escapeMessage,
    showEscapeMsg,
    handleMouseMove,
    handlePointerDown,
    initPosition,
  } = useNoButtonEscape();

  // Initialize position after mount
  useEffect(() => {
    const timer = setTimeout(() => {
      initPosition(yesBtnRef);
    }, 300);
    return () => clearTimeout(timer);
  }, [initPosition, yesBtnRef]);

  // Global mouse move listener
  const onMouseMove = useCallback(
    (e) => {
      handleMouseMove(e, noBtnRef, yesBtnRef);
    },
    [handleMouseMove, yesBtnRef]
  );

  useEffect(() => {
    window.addEventListener('mousemove', onMouseMove);
    return () => window.removeEventListener('mousemove', onMouseMove);
  }, [onMouseMove]);

  if (noPos.x === null) return null;

  const msgX = Math.min(noPos.x + 10, window.innerWidth - 200);
  const msgY = noPos.y - 50;

  return (
    <>
      {/* NO Button */}
      <button
        ref={noBtnRef}
        className="no-btn"
        style={{
          left: noPos.x,
          top: noPos.y,
          width: 130,
          height: 52,
          fontSize: '15px',
          fontWeight: 500,
          userSelect: 'none',
          WebkitUserSelect: 'none',
          touchAction: 'none',
        }}
        onPointerDown={(e) => handlePointerDown(e, yesBtnRef)}
        onMouseEnter={(e) => {
          const yesRect = yesBtnRef?.current?.getBoundingClientRect() || null;
          handlePointerDown(e, yesBtnRef);
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
        }}
        tabIndex={-1}
        aria-label="No button (it escapes!)"
        id="no-escape-btn"
        type="button"
      >
        🙈 No
      </button>

      {/* Escape Message Toast */}
      {showEscapeMsg && (
        <div
          className="escape-toast"
          style={{
            left: Math.max(10, Math.min(msgX, window.innerWidth - 180)),
            top: Math.max(10, msgY),
          }}
          aria-live="polite"
        >
          <div
            className="glass-card px-4 py-2 text-sm font-semibold"
            style={{ color: 'rgba(251,113,133,0.95)', whiteSpace: 'nowrap' }}
          >
            {escapeMessage}
          </div>
        </div>
      )}
    </>
  );
}
