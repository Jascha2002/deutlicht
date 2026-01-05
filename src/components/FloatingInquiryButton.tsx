import { useState } from "react";
import { FileText, X } from "lucide-react";
import { cn } from "@/lib/utils";
import InquiryFormDialog from "./InquiryFormDialog";

const FloatingInquiryButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed top-24 right-6 z-40">
      <InquiryFormDialog
        trigger={
          <button
            className={cn(
              "flex items-center gap-2 bg-primary text-primary-foreground",
              "rounded-full shadow-lg hover:shadow-xl",
              "transition-all duration-300 ease-out",
              "hover:scale-105 active:scale-95",
              "focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2",
              isHovered ? "px-5 py-3" : "p-4"
            )}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            aria-label="Anfrage stellen"
          >
            <FileText className="w-5 h-5 flex-shrink-0" />
            <span
              className={cn(
                "font-medium whitespace-nowrap overflow-hidden transition-all duration-300",
                isHovered ? "max-w-32 opacity-100" : "max-w-0 opacity-0"
              )}
            >
              Anfrage
            </span>
          </button>
        }
      />
    </div>
  );
};

export default FloatingInquiryButton;
