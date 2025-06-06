"use client";
import Link from "next/link";
import { Button } from "@ui/button";
import { usePathname } from "next/navigation";
import { Calendar, Settings, LogOut, Home, Server } from "lucide-react";
import { LogoFullLink } from "@ui/shared";
import { useEffect, useState } from "react";

interface SessionData {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export function Sidebar() {
  const pathname = usePathname();
  const [session, setSession] = useState<SessionData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const response = await fetch("/api/session", {
          credentials: "include",
        });
        const data = await response.json();
        setSession(data);
      } catch (error) {
        console.error("Failed to fetch session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSession();
  }, []);

  const isAdmin = session?.user?.role === "admin";

  const navItems = [
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <Home className="h-4 w-4" />,
    },
    {
      name: "Calendar",
      href: "/calendar",
      icon: <Calendar className="h-4 w-4" />,
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings className="h-4 w-4" />,
    },
    ...(isAdmin
      ? [
          {
            name: "Admin Panel",
            href: "/admin",
            icon: <Server className="h-4 w-4" />,
          },
        ]
      : []),
  ];

  if (isLoading) {
    return (
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <LogoFullLink />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="hidden border-r bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <LogoFullLink />
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                  pathname === item.href
                    ? "bg-muted text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {item.icon}
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <form action="/api/logout" method="POST">
            <Button
              type="submit"
              size="sm"
              className="w-full pt-4"
              variant="ghost"
            >
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
