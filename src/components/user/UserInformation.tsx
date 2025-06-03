"use client";

import { User } from "@/app/types/admin";

interface UserInformationProps {
    data: User;
}

export default function UserInformation({ data }: UserInformationProps) {
    return (
        <div>
            <h1>User Name: {data.name}</h1>
        </div>
    );
}
