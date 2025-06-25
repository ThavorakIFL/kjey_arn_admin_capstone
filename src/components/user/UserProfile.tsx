// components/user/UserProfile.tsx
import { User } from "@/app/types/admin";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface UserProfileProps {
    user: User;
}

export default function UserProfile({ user }: UserProfileProps) {
    const isUnsuspended = user.status === 1;

    return (
        <Card className="h-fit">
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-gray-900">
                    User Profile
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Profile Picture */}
                <div className="flex justify-center">
                    <Avatar className="h-24 w-24 ring-4 ring-gray-100">
                        <AvatarImage
                            src={
                                process.env.NEXT_PUBLIC_IMAGE_PATH! +
                                user.picture
                            }
                            alt={user.name}
                            className="object-cover"
                        />
                        <AvatarFallback className="bg-blue-100 text-blue-600 text-2xl font-bold">
                            {user.name?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                    </Avatar>
                </div>

                {/* Name Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="name"
                        className="text-sm font-medium text-gray-700"
                    >
                        Name
                    </Label>
                    <Input
                        id="name"
                        value={user.name}
                        readOnly
                        className="bg-gray-50 border-gray-200"
                    />
                </div>

                {/* Email Field */}
                <div className="space-y-2">
                    <Label
                        htmlFor="email"
                        className="text-sm font-medium text-gray-700"
                    >
                        Gmail
                    </Label>
                    <Input
                        id="email"
                        value={user.email}
                        readOnly
                        className="bg-gray-50 border-gray-200"
                    />
                </div>

                {/* Status */}
                <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">
                        Status
                    </Label>
                    <div className="flex items-center space-x-2">
                        <div
                            className={`h-2 w-2 rounded-full ${
                                isUnsuspended ? "bg-green-500" : "bg-red-500"
                            }`}
                        ></div>
                        <Badge
                            variant="outline"
                            className={`font-medium ${
                                isUnsuspended
                                    ? "text-green-700 border-green-200 bg-green-50"
                                    : "text-red-700 border-red-200 bg-red-50"
                            }`}
                        >
                            {isUnsuspended ? "Unsuspended" : "Suspended"}
                        </Badge>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
