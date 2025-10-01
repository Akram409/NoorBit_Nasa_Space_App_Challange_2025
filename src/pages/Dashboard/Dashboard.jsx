import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  UserCog,
  Settings,
  LogOut,
  Cloud,
  BarChart3,
  Scale,
  Brain,
  BookOpen,
  PenTool,
  Users,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";
import KPIPage from "./KPI/KPI";
import UrbanBalancePage from "./UrbanBalance/UrbanBalancePage";
import StorytellingPage from "./StoryTelling/StorytellingPage";
import BlogPage from "./Blog/BlogPage";
import { AIChatPage } from "./AIChat/AIChatPage";

// "vercel-build": "npm install --legacy-peer-deps && next build",
export default function Dashboard() {
  const [open, setOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(true);
  const [activePage, setActivePage] = useState("kpi");

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  const links = [
    // TODO: Add back Dashboard and Weather pages
    // {
    //   label: "Dashboard",
    //   path: "dashboard",
    //   icon: (
    //     <LayoutDashboard className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    // {
    //   label: "Weather",
    //   path: "weather",
    //   icon: (
    //     <Cloud className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    {
      label: "KPI",
      path: "kpi",
      icon: (
        <BarChart3 className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Urban Balance",
      path: "urban-balance",
      icon: (
        <Scale className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "AI Insights",
      path: "ai-insights",
      icon: (
        <Brain className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Storytelling",
      path: "storytelling",
      icon: (
        <BookOpen className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Blog",
      path: "blog",
      icon: (
        <PenTool className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Community",
      path: "community",
      icon: (
        <Users className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
      ),
    },
    // TODO: Add back Profile and Settings pages
    // {
    //   label: "Profile",
    //   path: "profile",
    //   icon: (
    //     <UserCog className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
    // {
    //   label: "Settings",
    //   path: "settings",
    //   icon: (
    //     <Settings className="text-green-500 dark:text-blue-500 h-5 w-5 flex-shrink-0" />
    //   ),
    // },
  ];

  const handleLinkClick = (path) => {
    setActivePage(path);
  };

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
                <div
                  key={idx}
                  onClick={() => handleLinkClick(link.path)}
                  className={cn(
                    "cursor-pointer transition-all duration-200 rounded-md",
                    activePage === link.path &&
                      "bg-green-50 dark:bg-blue-900/20 dark:shadow-sm border-r-2 border-t-2  border-green-500 dark:border-blue-400"
                  )}
                >
                  <SidebarLink link={link} />
                </div>
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
            <div
              onClick={() => handleLinkClick("logout")}
              className="cursor-pointer"
            >
              <SidebarLink
                link={{
                  label: "Logout",
                  href: "#",
                  icon: (
                    <LogOut className="text-red-500 dark:text-red-500 h-5 w-5 flex-shrink-0" />
                  ),
                }}
              />
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <MainPanel activePage={activePage} />
    </div>
  );
}

export const Logo = () => {
  return (
    <a
      href="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-5 bg-green-500 dark:bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
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
      <div className="h-5 w-5 bg-green-500 dark:bg-blue-500 rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </a>
  );
};

// **Page Components**
const DashboardPage = () => (
  <div className="space-y-6 h-full flex flex-col">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Dashboard
    </h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="p-6 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Metric {i + 1}
          </h3>
          <p className="text-2xl font-bold text-green-500 dark:text-blue-500 mt-2">
            1,234
          </p>
        </div>
      ))}
    </div>
    <div className="flex gap-2">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`first-array-${i}`}
          className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
        />
      ))}
    </div>
    <div className="flex gap-2 flex-1 min-h-[200px]">
      {Array.from({ length: 2 }).map((_, i) => (
        <div
          key={`second-array-${i}`}
          className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse"
        />
      ))}
    </div>
  </div>
);

const WeatherPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Weather
    </h1>
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <p className="text-gray-600 dark:text-gray-300">
        Weather information and forecasts will be displayed here.
      </p>
    </div>
  </div>
);

// const UrbanBalancePage = () => (
//   <div className="space-y-6">
//     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//       Urban Balance
//     </h1>
//     <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
//       <p className="text-gray-600 dark:text-gray-300">
//         Urban planning and balance metrics will be displayed here.
//       </p>
//     </div>
//   </div>
// );

// const AIInsightsPage = () => (
//   <div className="space-y-6">
//     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//       AI Insights
//     </h1>
//     <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
//       <p className="text-gray-600 dark:text-gray-300">
//         AI-powered insights and recommendations will be shown here.
//       </p>
//     </div>
//   </div>
// );

// const StorytellingPage = () => (
//   <div className="space-y-6">
//     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
//       Storytelling
//     </h1>
//     <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
//       <p className="text-gray-600 dark:text-gray-300">
//         Data storytelling and narrative visualizations will be displayed here.
//       </p>
//     </div>
//   </div>
// );

// const BlogPage = () => (
//   <div className="space-y-6">
//     <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Blog</h1>
//     <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
//       <p className="text-gray-600 dark:text-gray-300">
//         Blog posts and articles will be shown here.
//       </p>
//     </div>
//   </div>
// );

const CommunityPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Community
    </h1>
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <p className="text-gray-600 dark:text-gray-300">
        Community discussions and interactions will be displayed here.
      </p>
    </div>
  </div>
);

const ProfilePage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Profile
    </h1>
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <p className="text-gray-600 dark:text-gray-300">
        User profile settings and information will be shown here.
      </p>
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
      Settings
    </h1>
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <p className="text-gray-600 dark:text-gray-300">
        Application settings and preferences will be displayed here.
      </p>
    </div>
  </div>
);

const LogoutPage = () => (
  <div className="space-y-6">
    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Logout</h1>
    <div className="bg-white dark:bg-neutral-800 rounded-lg p-6 border border-neutral-200 dark:border-neutral-700">
      <p className="text-gray-600 dark:text-gray-300">
        You have been logged out successfully.
      </p>
    </div>
  </div>
);

const MainPanel = ({ activePage }) => {
  const renderPage = () => {
    switch (activePage) {
      case "dashboard":
        return <DashboardPage />;
      case "weather":
        return <WeatherPage />;
      case "kpi":
        return <KPIPage />;
      case "urban-balance":
        return <UrbanBalancePage />;
      case "ai-insights":
        return <AIChatPage />;
      case "storytelling":
        return <StorytellingPage />;
      case "blog":
        return <BlogPage />;
      case "community":
        return <CommunityPage />;
      case "profile":
        return <ProfilePage />;
      case "settings":
        return <SettingsPage />;
      case "logout":
        return <LogoutPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex flex-1">
      <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full overflow-y-auto">
        {renderPage()}
      </div>
    </div>
  );
};
