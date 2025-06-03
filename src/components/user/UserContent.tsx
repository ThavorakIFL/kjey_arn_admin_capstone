"use client";

import { useUserData } from "@/hooks/useUserData";
import { useRouter } from "next/navigation";
import ErrorMessage from "../ErrorMessage";
import LoadingSpinner from "../LoadingSpinner";
import { Avatar, AvatarImage } from "@/components/ui/avatar";

export default function UserContent() {
    const router = useRouter();

    const { data: data, loading, error } = useUserData();
    console.log(data);
    if (loading) {
        return <LoadingSpinner />;
    }
    if (error) return <ErrorMessage message={error} />;
    if (!data) {
        return <div>No User Found</div>;
    }
    return (
        <div className="max-w-4xl ">
            {data.length > 0 && (
                <div>
                    {data.map((user, index) => {
                        return (
                            <div
                                onClick={() => {
                                    router.push(`/dashboard/users/${user.id}`);
                                }}
                                key={index}
                                className="mb-4 p-4 border rounded shadow flex"
                            >
                                <Avatar className="mr-4">
                                    <AvatarImage
                                        src={
                                            process.env
                                                .NEXT_PUBLIC_IMAGE_PATH! +
                                            user.picture
                                        }
                                    />
                                </Avatar>
                                <div>
                                    <h2 className="text-xl font-semibold">
                                        {user.name}
                                    </h2>
                                    <p>Email: {user.email}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
