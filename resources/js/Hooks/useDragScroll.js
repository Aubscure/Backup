import { useRef, useCallback, useEffect } from 'react';

export default function useDragScroll() {
    const scrollRef  = useRef(null);
    const isDragging = useRef(false);
    const startX     = useRef(0);
    const scrollLeft = useRef(0);
    const velocity   = useRef(0);
    const lastX      = useRef(0);
    const rafId      = useRef(null);
    const moved      = useRef(false);

    const onMouseDown = useCallback((e) => {
        const el = scrollRef.current;
        if (!el) return;
        isDragging.current  = true;
        moved.current       = false;
        startX.current      = e.pageX - el.offsetLeft;
        scrollLeft.current  = el.scrollLeft;
        lastX.current       = e.pageX;
        velocity.current    = 0;
        if (rafId.current) cancelAnimationFrame(rafId.current);
        el.style.cursor     = 'grabbing';
        el.style.userSelect = 'none';
    }, []);

    const onMouseMove = useCallback((e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const el = scrollRef.current;
        if (!el) return;
        const x    = e.pageX - el.offsetLeft;
        const walk = x - startX.current;
        if (Math.abs(walk) > 3) moved.current = true;
        velocity.current = e.pageX - lastX.current;
        lastX.current    = e.pageX;
        el.scrollLeft    = scrollLeft.current - walk;
    }, []);

    const applyMomentum = useCallback(() => {
        const el = scrollRef.current;
        if (!el) return;
        velocity.current *= 0.92;
        if (Math.abs(velocity.current) > 0.5) {
            el.scrollLeft -= velocity.current;
            rafId.current  = requestAnimationFrame(applyMomentum);
        }
    }, []);

    const stopDrag = useCallback(() => {
        if (!isDragging.current) return;
        isDragging.current = false;
        const el = scrollRef.current;
        if (!el) return;
        el.style.cursor     = 'grab';
        el.style.userSelect = '';
        rafId.current = requestAnimationFrame(applyMomentum);
    }, [applyMomentum]);

    const onClick = useCallback((e) => {
        if (moved.current) e.stopPropagation();
    }, []);

    const onTouchStart = useCallback((e) => {
        const el = scrollRef.current;
        if (!el) return;
        isDragging.current = true;
        moved.current      = false;
        startX.current     = e.touches[0].pageX - el.offsetLeft;
        scrollLeft.current = el.scrollLeft;
        lastX.current      = e.touches[0].pageX;
        velocity.current   = 0;
        if (rafId.current) cancelAnimationFrame(rafId.current);
    }, []);

    const onTouchMove = useCallback((e) => {
        if (!isDragging.current) return;
        const el = scrollRef.current;
        if (!el) return;
        const x    = e.touches[0].pageX - el.offsetLeft;
        const walk = x - startX.current;
        if (Math.abs(walk) > 3) moved.current = true;
        velocity.current = e.touches[0].pageX - lastX.current;
        lastX.current    = e.touches[0].pageX;
        el.scrollLeft    = scrollLeft.current - walk;
    }, []);

    useEffect(() => () => {
        if (rafId.current) cancelAnimationFrame(rafId.current);
    }, []);

    return {
        scrollRef,
        dragHandlers: {
            onMouseDown,
            onMouseMove,
            onMouseUp:    stopDrag,
            onMouseLeave: stopDrag,
            onClick,
            onTouchStart,
            onTouchMove,
            onTouchEnd:   stopDrag,
        },
    };
}
