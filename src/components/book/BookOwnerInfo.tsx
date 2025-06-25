// components/book/BookOwnerInfo.tsx
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { User } from "@/app/types/admin";

interface BookOwnerInfoProps {
    owner: User;
    className?: string;
}

export default function BookOwnerInfo({
    owner,
    className = "",
}: BookOwnerInfoProps) {
    return (
        <div className={`${className}`}>
            <h3 className="text-sm font-medium text-gray-700 mb-2">Owner</h3>
            <div className="flex items-center space-x-3">
                <Avatar className="h-10 w-10 ring-2 ring-gray-100">
                    <AvatarImage
                        src={
                            owner.picture
                                ? process.env.NEXT_PUBLIC_IMAGE_PATH +
                                  owner.picture
                                : undefined
                        }
                        alt={owner.name || "Owner"}
                    />
                    <AvatarFallback className="bg-blue-100 text-blue-600 font-medium">
                        {owner.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <p className="font-medium text-gray-900">
                        {owner.name || "Unknown User"}
                    </p>
                    <p className="text-sm text-gray-500">Book Owner</p>
                </div>
            </div>
        </div>
    );
}
