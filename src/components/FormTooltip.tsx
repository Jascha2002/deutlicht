import { useState, useRef, useEffect, useCallback, type ReactNode } from 'react';
import { Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormTooltipProps {
  content: string;
  children: ReactNode;
  maxWidth?: number;
}

const FormTooltip = ({ content, children, maxWidth = 280 }: FormTooltipProps) => {
  const [visible, setVisible] = useState(false);
  const [above, setAbove] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const hideTimer = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    const check = () => setIsMobile('ontouchstart' in window || window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close on outside click (mobile)
  useEffect(() => {
    if (!visible || !isMobile) return;
    const handler = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setVisible(false);
      }
    };
    document.addEventListener('click', handler, true);
    return () => document.removeEventListener('click', handler, true);
  }, [visible, isMobile]);

  const updatePosition = useCallback(() => {
    if (!wrapperRef.current) return;
    const rect = wrapperRef.current.getBoundingClientRect();
    setAbove(isMobile ? false : rect.top > 120);
  }, [isMobile]);

  const show = () => {
    clearTimeout(hideTimer.current);
    updatePosition();
    setVisible(true);
  };

  const hide = () => {
    hideTimer.current = setTimeout(() => setVisible(false), 150);
  };

  const toggleMobile = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    updatePosition();
    setVisible((v) => !v);
  };

  const hoverProps = isMobile
    ? {}
    : { onMouseEnter: show, onMouseLeave: hide };

  return (
    <div ref={wrapperRef} className="inline-flex items-center gap-1 relative" {...hoverProps}>
      {children}
      <button
        type="button"
        aria-label="Info"
        className="inline-flex items-center justify-center shrink-0 text-muted-foreground hover:text-primary transition-colors"
        onClick={isMobile ? toggleMobile : undefined}
        onMouseEnter={!isMobile ? show : undefined}
      >
        <Info className="w-4 h-4" />
      </button>

      {visible && (
        <div
          className={cn(
            'absolute z-50 animate-in fade-in-0 duration-150',
            above ? 'bottom-full mb-2' : 'top-full mt-2',
            'left-1/2 -translate-x-1/2'
          )}
          style={{ maxWidth, width: 'max-content' }}
          onMouseEnter={!isMobile ? show : undefined}
          onMouseLeave={!isMobile ? hide : undefined}
        >
          <div
            className="rounded-lg px-3.5 py-2.5 text-[13px] leading-relaxed text-white border-t-2 border-primary"
            style={{
              backgroundColor: '#1A1A1A',
              boxShadow: '0 4px 20px rgba(0,0,0,0.25)',
            }}
          >
            {content}
          </div>
          {/* Arrow */}
          <div
            className={cn(
              'absolute left-1/2 -translate-x-1/2 w-0 h-0',
              above
                ? 'top-full border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px]'
                : 'bottom-full border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]'
            )}
            style={{
              borderTopColor: above ? '#1A1A1A' : undefined,
              borderBottomColor: !above ? '#1A1A1A' : undefined,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default FormTooltip;
