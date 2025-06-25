import React, { useState } from "react";
import {
    MoreHorizontal,
    Edit,
    Trash2,
    MapPin,
    Calendar,
    Delete,
    Trash,
} from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Location } from "@/app/types/admin";

interface LocationTableProps {
    locations: Location[];
    onEdit: (location: Location) => void;
    onDelete: (locationId: number) => void;
}

export default function LocationTable({
    locations,
    onEdit,
    onDelete,
}: LocationTableProps) {
    const [openDropdown, setOpenDropdown] = useState<number | null>(null);

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
        });
    };

    const handleEdit = (e: React.MouseEvent, location: Location) => {
        e.stopPropagation();
        onEdit(location);
        setOpenDropdown(null);
    };

    const handleDelete = (e: React.MouseEvent, locationId: number) => {
        e.stopPropagation();
        onDelete(locationId);
        setOpenDropdown(null);
    };

    if (locations.length === 0) {
        return (
            <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                    <MapPin className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No locations found
                </h3>
                <p className="text-gray-500">
                    Create your first location to get started.
                </p>
            </div>
        );
    }

    return (
        <div className="">
            {/* Desktop Table */}
            <div className="hidden md:block">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Location
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Created At
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {locations.map((location) => (
                            <tr
                                key={location.id}
                                className="hover:bg-gray-50 transition-colors"
                            >
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-blue-600" />
                                            </div>
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">
                                                {location.location}
                                            </div>
                                            <div className="text-sm text-gray-500">
                                                ID: {location.id}
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <Calendar className="w-4 h-4 text-gray-400 mr-2" />
                                        <div className="text-sm text-gray-900">
                                            {formatDate(location.created_at)}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <div className="flex items-center justify-end space-x-2">
                                        <button
                                            onClick={(e) =>
                                                handleEdit(e, location)
                                            }
                                            className="cursor-pointer text-blue-600 hover:text-blue-900 p-1 rounded-md hover:bg-blue-50 transition-colors"
                                            title="Edit Location"
                                        >
                                            <Edit className="w-4 h-4" />
                                        </button>

                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <button className="cursor-pointer rounded-md p-1 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                                                    <Trash2 className="w-4 h-4 " />
                                                </button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Delete Location
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Are you sure you want to
                                                        delete "
                                                        {location.location}"?
                                                        This action cannot be
                                                        undone and may affect
                                                        active borrow
                                                        activities.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>
                                                        Cancel
                                                    </AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={(e) =>
                                                            handleDelete(
                                                                e,
                                                                location.id
                                                            )
                                                        }
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Delete Location
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-gray-200">
                {locations.map((location) => (
                    <div
                        key={location.id}
                        className="p-4 hover:bg-gray-50 transition-colors"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="flex-shrink-0">
                                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <MapPin className="h-6 w-6 text-blue-600" />
                                    </div>
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm font-medium text-gray-900">
                                        {location.location}
                                    </div>
                                    <div className="flex items-center mt-1">
                                        <Calendar className="w-3 h-3 text-gray-400 mr-1" />
                                        <span className="text-xs text-gray-500">
                                            Created{" "}
                                            {formatDate(location.created_at)}
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-400 mt-1">
                                        ID: {location.id}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center space-x-2">
                                <button
                                    onClick={(e) => handleEdit(e, location)}
                                    className="text-blue-600 hover:text-blue-900 p-2 rounded-md hover:bg-blue-50 transition-colors cursor-pointer"
                                >
                                    <Edit className="w-4 h-4" />
                                </button>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <button className="rounded-md p-1 text-left text-sm text-red-600 hover:bg-red-50 flex items-center">
                                            <Trash2 className="w-4 h-4 " />
                                        </button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Delete Location
                                            </AlertDialogTitle>
                                            <AlertDialogDescription>
                                                Are you sure you want to delete
                                                "{location.location}"? This
                                                action cannot be undone and may
                                                affect active borrow activities.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>
                                                Cancel
                                            </AlertDialogCancel>
                                            <AlertDialogAction
                                                onClick={(e) =>
                                                    handleDelete(e, location.id)
                                                }
                                                className="bg-red-600 hover:bg-red-700"
                                            >
                                                Delete Location
                                            </AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
