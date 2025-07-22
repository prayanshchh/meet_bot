import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ThemeToggle from '@/components/ui/ThemeToggle';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useNavigate } from 'react-router-dom'; 

interface HeaderProps {
  scrollY: number;
}

export default function Header({ scrollY }: HeaderProps) {
const navigate = useNavigate();

const {user, isLoggedIn, logout} = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const location = useLocation();
  const isLandingPage = location.pathname === "/";


  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 py-8 transition-all duration-300 px-4 sm:px-6 lg:px-8',
        scrollY > 10
          ? 'bg-background/200 backdrop-blur-md shadow-sm'
          : 'bg-transparent'
      )}
    >
      <div className="container mx-auto px-4 md:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse" />
            </div>
            <span className="text-xl font-bold tracking-tighter">MeetBot</span>
          </div>

          {/* Navigation - only on landing page */}
          {isLandingPage && (
            <nav className="hidden md:flex items-center gap-6 md:gap-8 lg:gap-10">
              <a href="#features" className="text-sm font-bold transition-colors hover:text-primary">
                Features
              </a>
              <a href="#how-it-works" className="text-sm font-medium transition-colors hover:text-primary">
                How It Works
              </a>
              <a href="#dashboard" className="text-sm font-medium transition-colors hover:text-primary">
                Dashboard
              </a>
              <a href="#pricing" className="text-sm font-medium transition-colors hover:text-primary">
                Pricing
              </a>
            </nav>
          )}

          {/* Right Side Buttons */}
          <div className="flex items-center gap-4 relative">
            <ThemeToggle />
            {isLandingPage && !isLoggedIn && (
            <>
              <Button
                  onClick={() => navigate('/login')}
                variant="outline"
                className="cursor-pointer hidden md:inline-flex hover:shadow-[0_0_20px_4px] transition-all duration-300 hover:shadow-primary/60"
              >
                Sign In
              </Button>
              <Button className="cursor-pointer hidden md:inline-flex hover:shadow-[0_0_20px_4px] transition-all duration-300 hover:shadow-primary/60">
                Get Started
              </Button>
            </>
            )}

{isLoggedIn && (
  <div className="relative">
    <Button variant="ghost" size="icon" onClick={() => setProfileOpen(!profileOpen)}>
      {/* ✅ Replaced UserCircle icon with Avatar */}
      <Avatar className="h-10 w-10 cursor-pointer">
        <AvatarFallback>
          {
            user?.name
              ?.split(' ')
              .map(part => part[0])
              .join('')
              .toUpperCase()
              .slice(0, 2) || 'U'
          }
        </AvatarFallback>
      </Avatar>
    </Button>

    {profileOpen && (
      <div className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-popover ring-1 ring-black ring-opacity-5 z-50">
        <div className="p-4 border-b">
          <p className="text-xs text-muted-foreground">Logged in as</p>
          <p className="text-sm font-medium truncate">{user?.email}</p>
        </div>
        <div className="p-2 flex flex-col space-y-2">
          <a href="/tutorial" className="text-sm hover:text-primary transition-colors">Tutorial</a>
          <a href="/faq" className="text-sm hover:text-primary transition-colors">FAQs</a>
          <button onClick={logout} className="text-sm text-left hover:text-red-500 transition-colors cursor-pointer">Logout</button>
        </div>
      </div>
    )}
  </div>
)}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu - only on landing page */}
      {menuOpen && isLandingPage && (
        <div className="md:hidden bg-background/95 backdrop-blur-lg border-b">
          <nav className="px-4 py-6 flex flex-col space-y-4 max-w-screen-sm mx-auto">
            <a
              href="#features"
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              How It Works
            </a>
            <a
              href="#dashboard"
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              Dashboard
            </a>
            <a
              href="#pricing"
              className="text-sm font-medium py-2 transition-colors hover:text-primary"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </a>
            <div className="pt-2 flex gap-2">
              <Button variant="outline" className="w-full">Sign In</Button>
              <Button className="w-full">Get Started</Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
