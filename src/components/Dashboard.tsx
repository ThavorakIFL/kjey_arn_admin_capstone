"use client";
import { useDashboardData } from "@/hooks/useDashboardData";
import ErrorMessage from "./ErrorMessage";
import LoadingSpinner from "./shared/LoadingSpinner";
import { AdminService } from "@/app/services/adminService";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export default function Dashboard() {
    const { data: data, loading, error } = useDashboardData();
    console.log(data);
    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) return <ErrorMessage message={error} />;
    if (!data) {
        return <div>No data available</div>;
    }
    return (
        <div className="max-w-4xl py-12">
            <h1 className="text-3xl font-bold mbb-8">Admin Dashboard</h1>
            <button onClick={() => AdminService.logout()}>Logout</button>
            <div className="grid grid-cols-2 gap-6">
                {[
                    { title: "Total Users", value: data.total_users },
                    { title: "Total Books", value: data.total_books },
                ].map((item, index) => (
                    <Card key={index} className="shadow-lg">
                        <CardHeader>
                            <CardTitle>{item.title}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{item.value}</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}
