"use client";

import {
    Book,
    LayoutDashboard,
    User,
    Activity,
    MapPin,
    BarChart3,
    LogOut,
    UserCheck,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { AdminAuth } from "@/lib/auth";
import Image from "next/image";
import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
} from "@/components/ui/sidebar";
import kjeyarnlogo from "@/assets/kjeyarnlogo.png";

// Menu items.
const items = [
    {
        title: "Dashboard",
        url: "/dashboard",
        icon: LayoutDashboard,
    },
    {
        title: "Users",
        url: "/dashboard/users",
        icon: User,
    },
    {
        title: "Books",
        url: "/dashboard/books",
        icon: Book,
    },
    {
        title: "Borrow Activities",
        url: "/dashboard/borrow-activities",
        icon: Activity,
    },
    {
        title: "Location",
        url: "/dashboard/location",
        icon: MapPin,
    },
    {
        title: "Reports",
        url: "/dashboard/reports",
        icon: BarChart3,
    },
    {
        title: "Admins",
        url: "/dashboard/admins",
        icon: UserCheck,
    },
];

export function AppSidebar() {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        AdminAuth.removeToken();
        router.push("/login");
    };

    return (
        <Sidebar className="bg-slate-800 border-r-0">
            <SidebarHeader className="p-6 bg-slate-800 flex justify-between">
                <Image
                    src={kjeyarnlogo}
                    alt="KjeyArn logo"
                    width={140}
                    height={100}
                />
            </SidebarHeader>

            <SidebarContent className="bg-slate-800">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {items.map((item, index) => {
                                const isActive = pathname === item.url;
                                const isSuperAdmin =
                                    AdminAuth.getIsSuperAdmin()?.toString() ||
                                    "0";
                                // Skip rendering the Admins menu item for non-super admins
                                if (index === 6 && isSuperAdmin !== "1") {
                                    console.log(
                                        "Skipping Admins menu item for non-super admin",
                                        localStorage.getItem(
                                            isSuperAdmin.toString()
                                        )
                                    );
                                    return null;
                                }

                                return (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton
                                            asChild
                                            className={`
                                                h-12 px-4 hover:bg-white text-white
                                                ${
                                                    isActive
                                                        ? "bg-blue-500 hover:bg-blue-600"
                                                        : ""
                                                }
                                            `}
                                        >
                                            <div
                                                className="cursor-pointer flex items-center gap-3"
                                                onClick={() =>
                                                    router.push(item.url)
                                                }
                                            >
                                                <item.icon className="h-5 w-5" />
                                                <span className="text-sm font-medium">
                                                    {item.title}
                                                </span>
                                            </div>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="p-4 bg-slate-800">
                <SidebarMenuButton
                    className="h-12 bg-red-500 hover:bg-red-600 text-white font-medium"
                    onClick={handleLogout}
                >
                    <LogOut className="h-5 w-5" />
                    <span>Logout</span>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    );
}
