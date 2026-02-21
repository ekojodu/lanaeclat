import { useEffect, useRef } from 'react';

export default function Cursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursor = cursorRef.current;
    const ring = ringRef.current;
    if (!cursor || !ring) return;

    let ringX = 0, ringY = 0;
    let curX = 0, curY = 0;

    const move = (e: MouseEvent) => {
      curX = e.clientX;
      curY = e.clientY;
      cursor.style.left = curX + 'px';
      cursor.style.top = curY + 'px';
    };

    const animate = () => {
      ringX += (curX - ringX) * 0.12;
      ringY += (curY - ringY) * 0.12;
      ring.style.left = ringX + 'px';
      ring.style.top = ringY + 'px';
      requestAnimationFrame(animate);
    };

    const onEnterLink = () => {
      cursor.style.width = '16px';
      cursor.style.height = '16px';
      cursor.style.background = 'var(--gold)';
      ring.style.width = '48px';
      ring.style.height = '48px';
      ring.style.borderColor = 'var(--gold)';
    };

    const onLeaveLink = () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      cursor.style.background = 'var(--rose-mid)';
      ring.style.width = '32px';
      ring.style.height = '32px';
      ring.style.borderColor = 'var(--rose-mid)';
    };

    window.addEventListener('mousemove', move);
    animate();

    const links = document.querySelectorAll('a, button');
    links.forEach(l => {
      l.addEventListener('mouseenter', onEnterLink);
      l.addEventListener('mouseleave', onLeaveLink);
    });

    return () => {
      window.removeEventListener('mousemove', move);
    };
  }, []);

  return (
    <>
      <div ref={cursorRef} className="cursor" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
