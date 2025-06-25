import React, { useState, useEffect } from "react";
import { X, MapPin, Save } from "lucide-react";
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
interface Location {
    id: number;
    location: string;
    created_at: string;
    updated_at: string;
}

interface LocationModalProps {
    location: Location | null; // null for add, Location for edit
    onSubmit: (data: { location: string }) => void;
    onClose: () => void;
}

export default function LocationModal({
    location,
    onSubmit,
    onClose,
}: LocationModalProps) {
    const [locationName, setLocationName] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const isEdit = location !== null;

    useEffect(() => {
        if (location) {
            setLocationName(location.location);
        } else {
            setLocationName("");
        }
        setError("");
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!locationName.trim()) {
            setError("Location name is required");
            return;
        }

        if (locationName.trim().length < 2) {
            setError("Location name must be at least 2 characters long");
            return;
        }

        setLoading(true);
        setError("");

        try {
            await onSubmit({ location: locationName.trim() });
        } catch (err: any) {
            setError(err.message || "Failed to save location");
        } finally {
            setLoading(false);
        }
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !loading && locationName.trim()) {
            handleSubmit(e as any);
        }
    };

    return (
        <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-200">
                    <div className="flex items-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                            <MapPin className="h-5 w-5 text-blue-600" />
                        </div>
                        <h2 className="text-lg font-semibold text-gray-900">
                            {isEdit ? "Edit Location" : "Add New Location"}
                        </h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X className="h-6 w-6" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="mb-4">
                        <label
                            htmlFor="location-name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                        >
                            Location Name
                        </label>
                        <input
                            id="location-name"
                            type="text"
                            value={locationName}
                            onChange={(e) => setLocationName(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter location name (e.g., Third Floor, Library Entrance)"
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            disabled={loading}
                            autoFocus
                        />
                        {error && (
                            <p className="mt-2 text-sm text-red-600">{error}</p>
                        )}
                    </div>

                    <div className="bg-blue-50 rounded-lg p-4">
                        <div className="flex">
                            <div className="flex-shrink-0">
                                <MapPin className="h-5 w-5 text-blue-400" />
                            </div>
                            <div className="ml-3">
                                <h3 className="text-sm font-medium text-blue-800">
                                    Location Guidelines
                                </h3>
                                <div className="mt-2 text-sm text-blue-700">
                                    <ul className="list-disc list-inside space-y-1">
                                        <li>
                                            Use clear, recognizable location
                                            names
                                        </li>
                                        <li>
                                            Include floor or building
                                            information if applicable
                                        </li>
                                        <li>
                                            Keep names concise but descriptive
                                        </li>
                                        <li>
                                            Examples: "Third Floor", "Main
                                            Lobby", "Library Entrance"
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50 rounded-b-lg">
                    <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading || !locationName.trim()}
                        className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                {isEdit ? "Updating..." : "Creating..."}
                            </>
                        ) : (
                            <>
                                <Save className="h-4 w-4 mr-2" />
                                {isEdit ? "Update Location" : "Create Location"}
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
