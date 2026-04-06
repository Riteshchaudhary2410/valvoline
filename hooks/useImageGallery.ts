'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

interface UseImageGalleryProps {
  image: string;
  images?: string[];
  productSlug: string;
}

/**
 * Reusable hook for managing image gallery scroll state and navigation
 * Handles smooth scrolling, pointer events, and index management
 */
export function useImageGallery({ image, images, productSlug }: UseImageGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const pointerStateRef = useRef<{
    pointerId: number;
    startX: number;
    startScrollLeft: number;
    moved: boolean;
  } | null>(null);

  // Build gallery array
  const gallery = useMemo(
    () => [image, ...(images || [])].filter(Boolean),
    [image, images]
  );

  const canScroll = gallery.length > 1;

  // Reset on product change
  useEffect(() => {
    setCurrentIndex(0);
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
  }, [productSlug]);

  // Handle scroll event
  const handleScroll = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const width = scroller.clientWidth || 1;
    const nextIndex = Math.round(scroller.scrollLeft / width);

    if (nextIndex !== currentIndex) {
      setCurrentIndex(nextIndex);
    }
  }, [currentIndex]);

  // Navigate to specific index
  const scrollToIndex = useCallback(
    (index: number) => {
      const scroller = scrollerRef.current;
      const nextIndex = Math.max(0, Math.min(index, gallery.length - 1));

      if (!scroller) {
        setCurrentIndex(nextIndex);
        return;
      }

      const width = scroller.clientWidth || 1;
      scroller.scrollTo({ left: nextIndex * width, behavior: 'smooth' });
      setCurrentIndex(nextIndex);
    },
    [gallery.length]
  );

  // Pointer event handlers for touch swipe
  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    if (!canScroll) return;
    pointerStateRef.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startScrollLeft: scrollerRef.current?.scrollLeft ?? 0,
      moved: false,
    };
  }, [canScroll]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    const state = pointerStateRef.current;
    if (!state || state.pointerId !== e.pointerId) return;

    const moved = Math.abs(e.clientX - state.startX) > 5;
    if (moved) state.moved = true;
  }, []);

  const handlePointerUp = useCallback(() => {
    pointerStateRef.current = null;
  }, []);

  return {
    gallery,
    currentIndex,
    canScroll,
    scrollerRef,
    handleScroll,
    scrollToIndex,
    handlePointerDown,
    handlePointerMove,
    handlePointerUp,
  };
}
