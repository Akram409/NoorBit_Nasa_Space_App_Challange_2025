"use client";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Sun, Moon, Facebook, Twitter, Instagram, Linkedin } from "lucide-react";

function FooterSection() {
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <footer className="bg-white dark:bg-black text-black dark:text-white border-t border-black/10 dark:border-white/20 transition-colors duration-300">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
        {/* Project Info */}
        <div className="text-center md:text-left">
          <h2 className="text-xl font-bold">NASA Space Apps 2025</h2>
          <p className="text-sm text-gray-700 dark:text-gray-400">
            Project: Pathways to Healthy Cities and Human Settlements
          </p>
        </div>

        {/* Quick Links */}
        <nav className="flex gap-4 text-sm">
          <a
            href="#hero-section"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </a>
          <a
            href="#features-section"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Features
          </a>
          <a
            href="#contact-section"
            className="hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
          >
            Contact
          </a>
        </nav>

        {/* Social + Dark Mode Toggle */}
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-black dark:text-white border-black/20 dark:border-white/30"
            >
              <Facebook className="h-4 w-4" />
              <span className="sr-only">Facebook</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-black dark:text-white border-black/20 dark:border-white/30"
            >
              <Twitter className="h-4 w-4" />
              <span className="sr-only">Twitter</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-black dark:text-white border-black/20 dark:border-white/30"
            >
              <Instagram className="h-4 w-4" />
              <span className="sr-only">Instagram</span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full text-black dark:text-white border-black/20 dark:border-white/30"
            >
              <Linkedin className="h-4 w-4" />
              <span className="sr-only">LinkedIn</span>
            </Button>
          </div>

          {/* Dark Mode Toggle */}
          <div className="flex items-center gap-1 ml-4">
            <Sun className="h-5 w-5 text-yellow-500 dark:text-yellow-400" aria-hidden="true" />
            <Switch
              id="dark-mode"
              checked={isDarkMode}
              onCheckedChange={setIsDarkMode}
              aria-label="Toggle dark mode"
            />
            <Moon className="h-5 w-5 text-gray-700 dark:text-gray-300" aria-hidden="true" />
          </div>
        </div>
      </div>
    </footer>
  );
}

export { FooterSection };
