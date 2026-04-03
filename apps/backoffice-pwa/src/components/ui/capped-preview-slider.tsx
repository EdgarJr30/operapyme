import {
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";

import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CappedPreviewSliderProps<T> {
  ariaLabel: string;
  emptyState?: ReactNode;
  getItemKey: (item: T, index: number) => string;
  items: T[];
  maxItems?: number;
  nextLabel: string;
  previousLabel: string;
  renderItem: (item: T, index: number) => ReactNode;
}

export function CappedPreviewSlider<T>({
  ariaLabel,
  emptyState = null,
  getItemKey,
  items,
  maxItems = 6,
  nextLabel,
  previousLabel,
  renderItem
}: CappedPreviewSliderProps<T>) {
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(getVisibleCount);
  const cappedItems = useMemo(() => items.slice(0, maxItems), [items, maxItems]);
  const maxIndex = Math.max(0, cappedItems.length - visibleCount);
  const showControls = cappedItems.length > visibleCount;

  useEffect(() => {
    const handleResize = () => {
      setVisibleCount(getVisibleCount());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    setCurrentIndex((index) => Math.min(index, maxIndex));
  }, [maxIndex]);

  const syncCurrentIndex = useCallback(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    const children = Array.from(viewport.children) as HTMLElement[];

    if (!children.length) {
      setCurrentIndex(0);
      return;
    }

    let nextIndex = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    children.forEach((child, index) => {
      const distance = Math.abs(child.offsetLeft - viewport.scrollLeft);

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nextIndex = index;
      }
    });

    setCurrentIndex(Math.min(nextIndex, maxIndex));
  }, [maxIndex]);

  useEffect(() => {
    const viewport = viewportRef.current;

    if (!viewport) {
      return;
    }

    syncCurrentIndex();

    viewport.addEventListener("scroll", syncCurrentIndex, { passive: true });

    return () => {
      viewport.removeEventListener("scroll", syncCurrentIndex);
    };
  }, [syncCurrentIndex]);

  const scrollToIndex = useCallback((index: number) => {
    const viewport = viewportRef.current;
    const targetChild = viewport?.children.item(index);

    if (!(targetChild instanceof HTMLElement) || !viewport) {
      return;
    }

    viewport.scrollTo({
      left: targetChild.offsetLeft,
      behavior: "smooth"
    });
  }, []);

  const itemStyle = useMemo(
    () => ({
      flexBasis: `calc((100% - ${(visibleCount - 1) * 1}rem) / ${visibleCount})`
    }),
    [visibleCount]
  );

  if (!cappedItems.length) {
    return emptyState;
  }

  return (
    <div className="space-y-4">
      {showControls ? (
        <div className="flex justify-end gap-2">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-10 px-0"
            aria-label={previousLabel}
            disabled={currentIndex <= 0}
            onClick={() => {
              scrollToIndex(Math.max(0, currentIndex - 1));
            }}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="min-w-10 px-0"
            aria-label={nextLabel}
            disabled={currentIndex >= maxIndex}
            onClick={() => {
              scrollToIndex(Math.min(maxIndex, currentIndex + 1));
            }}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      ) : null}

      <div
        ref={viewportRef}
        aria-label={ariaLabel}
        className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {cappedItems.map((item, index) => (
          <div
            key={getItemKey(item, index)}
            className="shrink-0 snap-start"
            style={itemStyle}
          >
            <div className="h-full">{renderItem(item, index)}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getVisibleCount() {
  if (typeof window === "undefined") {
    return 1;
  }

  if (window.innerWidth >= 1280) {
    return 3;
  }

  if (window.innerWidth >= 768) {
    return 2;
  }

  return 1;
}
