import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { LayoutDashboard, UserCog, Settings, LogOut } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const links = [
    {
      label: "Dashboard",
      href: "#",
      icon: (
        <LayoutDashboard className="text-green-500 dark:text-blue-500 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: "Profile",
      href: "#",
      icon: (
        <UserCog className="text-green-500 dark:text-blue-500 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: "Settings",
      href: "#",
      icon: (
        <Settings className="text-green-500 dark:text-blue-500 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: "Logout",
      href: "#",
      icon: (
        <LogOut className="text-green-500 dark:text-blue-500 h-6 w-6 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: "",
                href: "#",
                icon: (
                  <Switch
                    id="dark-mode"
                    checked={isDarkMode}
                    onCheckedChange={setIsDarkMode}
                    aria-label="Toggle dark mode"
                  />
                ),
              }}
            />
            <SidebarLink
              link={{
                label: "Manu Arora",
                href: "#",
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    width={28}
                    height={28}
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <MainPanel />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-green-500 dark:bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold text-black dark:text-white whitespace-pre"
      >
        Noor BIT
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-6 w-6 bg-green-500 dark:bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
  );
};

const MainPanel = () => {
  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
        <div className="flex gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`first-array-${i}`}
              className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
        <div className="flex gap-2 flex-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <div
              key={`second-array-${i}`}
              className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
            />
          ))}
        </div>
      </div>
    </div>
  );
};
