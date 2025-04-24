
import { useState } from "react";
import { Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useTheme } from "@/components/theme/ThemeProvider";
import { ThemeToggle } from "@/components/theme/ThemeToggle";

export function MobileMenu() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-white hover:text-orange-400 transition-colors duration-300 hover:bg-transparent ml-1"
          aria-label="Menu"
        >
          <Menu size={20} />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px] bg-background/95 backdrop-blur-md border-l border-border">
        <div className="flex flex-col h-full py-6">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-lg font-semibold">Menu</h2>
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleTheme}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          
          <nav className="flex flex-col space-y-4">
            <a 
              href="/" 
              className="px-4 py-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              Home
            </a>
            <a 
              href="/about" 
              className="px-4 py-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              About
            </a>
            <a 
              href="/contact" 
              className="px-4 py-2 rounded-md hover:bg-accent transition-colors"
              onClick={() => setOpen(false)}
            >
              Contact
            </a>
          </nav>
          
          <div className="mt-auto">
            <div className="px-4 py-2 text-sm text-muted-foreground">
              © {new Date().getFullYear()} netieku.es
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
