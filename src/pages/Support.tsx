import { useEffect, useRef, useState } from "react";
import SupportChatsSidebar from "@/features/support/components/SupportChatsSidebar";
import SupportChatArea from "@/features/support/components/SupportChatArea";

const MIN_PERCENT = 20; // sidebar min
const MAX_PERCENT = 70; // sidebar max
const INITIAL = 35;

const Support = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const resizingRef = useRef(false);
  const [sidebarPercent, setSidebarPercent] = useState(INITIAL);

  const clamp = (val: number) =>
    Math.max(MIN_PERCENT, Math.min(val, MAX_PERCENT));

  const startResize = (clientX: number) => {
    resizingRef.current = true;
    document.body.classList.add("select-none", "cursor-col-resize");
    moveResize(clientX);
  };

  const moveResize = (clientX: number) => {
    if (!resizingRef.current || !containerRef.current) return;
    const bounds = containerRef.current.getBoundingClientRect();
    const relativeX = clientX - bounds.left;
    const percent = (relativeX / bounds.width) * 100;
    setSidebarPercent(clamp(percent));
  };

  const stopResize = () => {
    if (!resizingRef.current) return;
    resizingRef.current = false;
    document.body.classList.remove("select-none", "cursor-col-resize");
  };

  useEffect(() => {
    const onMove = (e: MouseEvent) => moveResize(e.clientX);
    const onUp = () => stopResize();
    document.addEventListener("mousemove", onMove);
    document.addEventListener("mouseup", onUp);
    return () => {
      document.removeEventListener("mousemove", onMove);
      document.removeEventListener("mouseup", onUp);
    };
  }, []);

  return (
 
      <div ref={containerRef} className="flex flex-1 overflow-y-auto">
        {/* Sidebar */}

        <SupportChatsSidebar width={`${sidebarPercent}%`} />

        {/* Divider (your element, unchanged visually) */}
        <div
          role="separator"
          aria-orientation="vertical"
          tabIndex={0}
          title="Drag to resize"
          className="
           w-[2px] cursor-col-resize lg:flex hidden h-full relative
          after:absolute after:inset-y-0 after:-left-2 after:-right-2 after:content-['']
          after:rounded-sm 
        "
          onMouseDown={(e) => startResize(e.clientX)}
          onTouchStart={(e) => startResize(e.touches[0].clientX)}
          onKeyDown={(e) => {
            if (e.key === "ArrowLeft") setSidebarPercent((p) => clamp(p - 2));
            if (e.key === "ArrowRight") setSidebarPercent((p) => clamp(p + 2));
            if (e.key === "Home") setSidebarPercent(MIN_PERCENT);
            if (e.key === "End") setSidebarPercent(MAX_PERCENT);
          }}
          onDoubleClick={() => setSidebarPercent(INITIAL)}
        />

        {/* Chat Area */}
        <SupportChatArea />
      </div>

  );
};

export default Support;
