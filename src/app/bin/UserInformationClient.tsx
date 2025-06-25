"use client";

import {
    fetchUserBorrowDataById,
    fetchUserBookById,
    useUserById,
} from "@/hooks/useUserData";
import UserInformation from "@/components/user/UserInformation";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import ErrorMessage from "@/components/ErrorMessage";

interface UserInformationClientProps {
    userId: string;
}

export default function UserInformationClient({
    userId,
}: UserInformationClientProps) {
    const { data: user, loading, error } = useUserById(userId);
    const { data: userBooks } = fetchUserBookById(userId);
    const { data: userBorrowDatas } = fetchUserBorrowDataById(userId);
    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) return <ErrorMessage message={error} />;
    if (!user) {
        return <div>No data available</div>;
    }

    return (
        <UserInformation
            userBorrowDatas={userBorrowDatas || undefined}
            userBooks={userBooks || undefined}
            data={user}
        />
    );
}
