import { Admin } from "@/app/types/admin";
import api from "./api";

export const fetchTotalAdmin = async (): Promise<{
    success: boolean;
    message: string;
    data: Admin[];
}> => {
    const response = await api.get("/admin/total-admins");
    return response.data;
};

export const createAdmin = async (data: {
    username: string;
    password: string;
}): Promise<{
    success: boolean;
    message: string;
    data: Admin;
}> => {
    const response = await api.post("/admin/create-admin", data);
    return response.data;
};
