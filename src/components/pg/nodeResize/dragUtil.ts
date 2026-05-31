interface DragConfig {
  source: HTMLElement;
  start?: (dx: number, dy: number) => void;
  move?: (dx: number, dy: number) => void;
  end?: (dx: number, dy: number, complete: boolean) => void;
}

export function drag({ source, start, move, end }: DragConfig): () => void {
  let startX = 0;
  let startY = 0;
  let lastDx = 0;
  let lastDy = 0;
  let activePointerId: number | null = null;

  const onPointerDown = (e: PointerEvent) => {
    e.preventDefault();
    startX = e.clientX;
    startY = e.clientY;
    lastDx = 0;
    lastDy = 0;
    activePointerId = e.pointerId;
    source.setPointerCapture(e.pointerId);
    source.addEventListener('pointermove', onPointerMove);
    source.addEventListener('pointerup', onPointerUp);
    source.addEventListener('pointercancel', onPointerCancel);
    document.addEventListener('keydown', onKeyDown);
    start?.(0, 0);
  };

  const onPointerMove = (e: PointerEvent) => {
    lastDx = e.clientX - startX;
    lastDy = e.clientY - startY;
    move?.(lastDx, lastDy);
  };

  const onPointerUp = (e: PointerEvent) => {
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    stopDrag();
    end?.(dx, dy, true);
  };

  const onPointerCancel = () => {
    const dx = lastDx;
    const dy = lastDy;
    stopDrag();
    end?.(dx, dy, false);
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key !== 'Escape') { return; }
    const dx = lastDx;
    const dy = lastDy;
    if (activePointerId !== null) {
      source.releasePointerCapture(activePointerId);
    }
    stopDrag();
    end?.(dx, dy, false);
  };

  const stopDrag = () => {
    activePointerId = null;
    source.removeEventListener('pointermove', onPointerMove);
    source.removeEventListener('pointerup', onPointerUp);
    source.removeEventListener('pointercancel', onPointerCancel);
    document.removeEventListener('keydown', onKeyDown);
  };

  source.addEventListener('pointerdown', onPointerDown);

  return () => {
    source.removeEventListener('pointerdown', onPointerDown);
    stopDrag();
  };
}
