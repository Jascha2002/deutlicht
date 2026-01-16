import { Link } from "react-router-dom";
import { Building2, ChevronRight } from "lucide-react";
import { trackCTAClick } from "@/lib/analytics";
const BranchenSelectorButton = () => {
  return <div className="fixed top-28 right-4 z-40 md:right-8">
      <Link to="/leistungen/branchen-loesungen" onClick={() => trackCTAClick("Branchen-Lösungen Button", "floating")} className="group flex items-center gap-2 bg-accent hover:bg-accent/90 text-white pl-4 pr-3 py-2.5 shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/30 transition-all duration-300 hover:scale-105 animate-fade-in rounded-xl">
        <Building2 className="w-4 h-4" />
        <span className="font-medium text-sm whitespace-nowrap">
          Lösungen für Ihre Branche
        </span>
        <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
      </Link>
    </div>;
};
export default BranchenSelectorButton;