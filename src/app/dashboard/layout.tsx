// app/dashboard/layout.tsx
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen">
                <SidebarProvider>
                    <AppSidebar />
                    <main className="container p-4">
                        <SidebarTrigger />
                        {children}
                    </main>
                </SidebarProvider>
            </div>
        </ProtectedRoute>
    );
}
