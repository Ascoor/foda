import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Landing page displayed before user authentication
const Landing = () => {
  // Typewriter effect for the slogan
  const slogan = 'Organize your campaigns effectively.';
  const [typedSlogan, setTypedSlogan] = useState('');

  useEffect(() => {
    let index = 0;
    const timer = setInterval(() => {
      setTypedSlogan(slogan.slice(0, index + 1));
      index += 1;
      if (index === slogan.length) clearInterval(timer);
    }, 50);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background-secondary to-background">
      {/* Animated background orbs */}
      <div className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-primary/30 blur-3xl animate-pulse" />
      <div className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-secondary/30 blur-3xl animate-pulse" />

      {/* Glassy call-to-action panel */}
      <div className="relative z-10 w-full max-w-md rounded-2xl border border-card-border bg-card/60 p-10 text-center backdrop-blur-xl shadow-glass">
        {/* Logo and title */}
        <Rocket className="mx-auto mb-6 h-16 w-16 text-primary" />
        <h1 className="mb-4 text-4xl font-bold">FODA System</h1>

        {/* Animated slogan */}
        <p className="mb-8 h-6 text-lg text-muted-foreground">{typedSlogan}</p>

        {/* Call-to-action buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[140px]">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="min-w-[140px]">
            <a href="#learn-more">Learn More</a>
          </Button>
        </div>
      </div>

      {/* Powered by badge */}
      <span className="absolute bottom-4 right-4 text-xs text-muted-foreground">
        Powered by FODA
      </span>
    </div>
  );
};

export default Landing;
