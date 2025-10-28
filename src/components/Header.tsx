import { MapPin } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const Header = () => {
  return (
    <header className="border-b border-border bg-card sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-2 sm:gap-4">
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="bg-foreground text-background p-2 rounded-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-bold leading-none">highway</div>
              <div className="text-xs text-muted-foreground leading-none mt-0.5">delite</div>
            </div>
          </Link>

          <div className="flex-1 max-w-md">
            <Input
              type="search"
              placeholder="Search..."
              className="w-full text-sm"
            />
          </div>

          <Button className="flex-shrink-0 px-4 sm:px-6 text-sm">Search</Button>
        </div>
      </div>
    </header>
  );
};
