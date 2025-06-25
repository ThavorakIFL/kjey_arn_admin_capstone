"use client";

import React, { useState, useEffect } from "react";
import { Search, Plus, MapPin, Download } from "lucide-react";
import {
    fetchLocations as fetchLocationApi,
    createLocation,
    updateLocation,
    deleteLocation,
} from "@/lib/api/location";
// Import your interfaces
interface Location {
    id: number;
    location: string;
    created_at: string;
    updated_at: string;
}

interface PaginationInfo {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
}

// Components (these would be separate files in your project)
import LocationTable from "./components/LocationTable";
import LocationModal from "./components/LocationModal";
import Pagination from "@/components/shared/Pagination";
import LoadingSpinner from "@/components/shared/LoadingSpinner";

export default function LocationsPage() {
    const [locations, setLocations] = useState<Location[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [pagination, setPagination] = useState<PaginationInfo>({
        total: 0,
        per_page: 10,
        current_page: 1,
        last_page: 1,
    });
    const [showModal, setShowModal] = useState(false);
    const [editingLocation, setEditingLocation] = useState<Location | null>(
        null
    );

    useEffect(() => {
        fetchLocations();
    }, [searchQuery, pagination.current_page]);

    const fetchLocations = async () => {
        setLoading(true);
        try {
            const response = await fetchLocationApi({
                search: searchQuery || undefined,
                page: pagination.current_page,
                per_page: pagination.per_page,
                paginate: true,
            });

            if (response.success) {
                setLocations(response.data.locations);
                setPagination(response.data.pagination);
            }
        } catch (error) {
            console.error("Error fetching locations:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSearch = (query: string) => {
        setSearchQuery(query);
        setPagination((prev) => ({ ...prev, current_page: 1 }));
    };

    const handlePageChange = (page: number) => {
        setPagination((prev) => ({ ...prev, current_page: page }));
    };

    const handleAddLocation = () => {
        setEditingLocation(null);
        setShowModal(true);
    };

    const handleEditLocation = (location: Location) => {
        setEditingLocation(location);
        setShowModal(true);
    };

    const handleDeleteLocation = async (locationId: number) => {
        try {
            const response = await deleteLocation(locationId);
            if (response.success) {
                fetchLocations(); // Refresh the list
            }
        } catch (error) {
            console.error("Error deleting location:", error);
            alert(
                "Failed to delete location. It may be in use by active borrow activities."
            );
        }
    };

    const handleModalSubmit = async (locationData: { location: string }) => {
        try {
            let response;
            if (editingLocation) {
                response = await updateLocation(
                    editingLocation.id,
                    locationData
                );
            } else {
                response = await createLocation(locationData);
            }

            if (response.success) {
                setShowModal(false);
                setEditingLocation(null);
                fetchLocations();
            }
        } catch (error) {
            console.error("Error saving location:", error);
            throw error; // Let modal handle the error display
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingLocation(null);
    };

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Location
                        </h1>
                        <p className="text-gray-600 mt-1">
                            Manage pickup and meetup locations for book
                            exchanges
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={handleAddLocation}
                            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Location
                        </button>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <input
                            type="text"
                            placeholder="Search locations..."
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Results Summary */}
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm text-gray-700">
                    Showing{" "}
                    <span className="font-medium">{locations.length}</span> of{" "}
                    <span className="font-medium">{pagination.total}</span>{" "}
                    locations
                </p>
            </div>

            {/* Locations Table */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {loading ? (
                    <LoadingSpinner />
                ) : (
                    <LocationTable
                        locations={locations}
                        onEdit={handleEditLocation}
                        onDelete={handleDeleteLocation}
                    />
                )}
            </div>

            {/* Pagination */}
            {!loading && pagination.last_page > 1 && (
                <div className="mt-6">
                    <Pagination
                        currentPage={pagination.current_page}
                        totalPages={pagination.last_page}
                        onPageChange={handlePageChange}
                    />
                </div>
            )}

            {/* Add/Edit Modal */}
            {showModal && (
                <LocationModal
                    location={editingLocation}
                    onSubmit={handleModalSubmit}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}
