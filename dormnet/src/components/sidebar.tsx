'use client'
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { usePathname, useRouter } from "next/navigation"
import {
    Folder,
    CheckCircle2,
    Users,
    Settings,
    LogOut,
    Home,
    Server,
} from "lucide-react"
import { LogoFullLink } from "@/components/ui/shared"

export function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = () => {

        router.push("/login")
    }

    const navItems = [
        {
            name: "Dashboard",
            href: "/dashboard",
            icon: <Home className="h-4 w-4" />,
        },
        {
            name: "Projects",
            href: "/projects",
            icon: <Folder className="h-4 w-4" />,
        },
        {
            name: "Tasks",
            href: "/tasks",
            icon: <CheckCircle2 className="h-4 w-4" />,
        },
        {
            name: "Team",
            href: "/team",
            icon: <Users className="h-4 w-4" />,
        },
        {
            name: "Settings",
            href: "/settings",
            icon: <Settings className="h-4 w-4" />,
        },
        {
            name: "Admin Panel",
            href: "/admin",
            icon: <Server className="h-4 w-4" />,
        },
    ]

    return (
        <div className="hidden border-r bg-muted/40 md:block">
            <div className="flex h-full max-h-screen flex-col gap-2">
                <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                    <LogoFullLink/>
                </div>
                <div className="flex-1">
                    <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                        {navItems.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${
                                    pathname === item.href ? "bg-muted text-primary" : "text-muted-foreground"
                                }`}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        ))}
                    </nav>
                </div>
                <div className="mt-auto p-4">
                    <Button
                        size="sm"
                        className="w-full"
                        onClick={handleLogout}
                        variant="ghost"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>
        </div>
    )
}