import { Location } from "@/app/types/admin";
import api from "./api";

interface LocationsApiParams {
    search?: string;
    paginate?: boolean; // Add this
    page?: number;
    per_page?: number;
}

interface LocationsApiResponse {
    success: boolean;
    message: string;
    data: {
        pagination: {
            total: number;
            per_page: number;
            current_page: number;
            last_page: number;
        };
        locations: Location[];
    };
}

// For admin page (with pagination)
export const fetchLocations = async (params: LocationsApiParams) => {
    const response = await api.get("/admin/locations", {
        params: { ...params, paginate: "true" }, // Force pagination
    });
    return response.data;
};

export const createLocation = async (data: { location: string }) => {
    const response = await api.post("/admin/locations", data);
    return response.data;
};

// Update location
export const updateLocation = async (
    id: number,
    data: { location: string }
) => {
    const response = await api.put(`/admin/locations/${id}`, data);
    return response.data;
};

// Delete location
export const deleteLocation = async (id: number) => {
    const response = await api.delete(`/admin/locations/${id}`);
    return response.data;
};
