"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
    ArrowLeft,
    MoreHorizontal,
    AlertTriangle,
    BookCheck,
    RefreshCw,
} from "lucide-react";

// Components
import BorrowActivityBookCard from "../components/BorrowActivityBookCard";
import BorrowActivityDetailsCard from "../components/BorrowActivityDetailsCard";
import BorrowActivityParticipants from "../components/BorrowActivityParticipants";
// import BorrowActivityTimeline from "./components/BorrowActivityTimeline";
import LoadingSpinner from "@/components/shared/LoadingSpinner";
import { BorrowActivity } from "@/app/types/admin";
import { fetchBorrowActivityById } from "@/lib/api/boorrowActivities";
import { confirmBookDeposit } from "@/lib/api/report";

export default function BorrowActivityDetailPage() {
    const { id } = useParams();
    const activityId = parseInt(id as string);
    const [activity, setActivity] = useState<BorrowActivity | null>(null);
    const [loading, setLoading] = useState(true);
    const [confirmingDeposit, setConfirmingDeposit] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);

    useEffect(() => {
        fetchActivityData();
    }, []);

    const fetchActivityData = async () => {
        setLoading(true);
        try {
            const response = await fetchBorrowActivityById(
                activityId.toString()
            );
            if (response.success) {
                setActivity(response.data);
            } else {
                console.error(
                    "Failed to fetch activity data:",
                    response.message
                );
                setActivity(null);
            }
        } catch (error) {
            console.error("Error fetching activity data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Refresh function that can be called from anywhere
    const refreshActivityData = async () => {
        setRefreshing(true);
        try {
            const response = await fetchBorrowActivityById(
                activityId.toString()
            );
            if (response.success) {
                setActivity(response.data);
            } else {
                console.error(
                    "Failed to refresh activity data:",
                    response.message
                );
            }
        } catch (error) {
            console.error("Error refreshing activity data:", error);
        } finally {
            setRefreshing(false);
        }
    };

    const handleConfirmBookDeposit = async (activityId: number) => {
        setConfirmingDeposit(true);
        try {
            const response = await confirmBookDeposit(activityId);
            if (response.success) {
                // Refresh the page data after successful confirmation
                await refreshActivityData();
                // You could also show a success message here
                console.log("Book deposit confirmed successfully");
            } else {
                console.error(
                    "Failed to confirm book deposit:",
                    response.message
                );
            }
        } catch (error) {
            console.error("Error confirming book deposit:", error);
        } finally {
            setConfirmingDeposit(false);
        }
    };

    const handleGoBack = () => {
        // Navigate back to borrow activities list
        console.log("Go back to borrow activities list");
        // router.back() or router.push('/admin/borrow-activities')
    };

    const handleActivityAction = (action: string) => {
        console.log("Activity action:", action, activity);
        setOpenDropdown(false);

        // Add refresh option to the dropdown actions
        if (action === "refresh") {
            refreshActivityData();
        }
    };

    const bookDepositConfirmed = () => {
        return activity?.borrow_event_report!.status === 1;
    };

    const activityHaveReport = () => {
        return activity?.borrow_event_report !== null;
    };

    if (loading) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <LoadingSpinner />
            </div>
        );
    }

    if (!activity) {
        return (
            <div className="p-6 bg-gray-50 min-h-screen">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                        Borrow Activity Not Found
                    </h2>
                    <p className="text-gray-600 mb-4">
                        The borrow activity you're looking for doesn't exist.
                    </p>
                    <button
                        onClick={handleGoBack}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Back to Activities
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="mb-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">
                                Borrow Event Detail
                            </h1>
                            <p className="text-gray-600 mt-1">
                                View and manage borrow activity information
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Actions Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setOpenDropdown(!openDropdown)}
                                className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50"
                            >
                                <MoreHorizontal className="w-4 h-4 mr-2" />
                                Actions
                            </button>

                            {openDropdown && (
                                <div className="absolute right-0 mt-1 w-48 bg-white rounded-md shadow-lg border z-10">
                                    <button
                                        onClick={() =>
                                            handleActivityAction("refresh")
                                        }
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center"
                                    >
                                        <RefreshCw className="w-4 h-4 mr-2" />
                                        Refresh Data
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleActivityAction(
                                                "view_messages"
                                            )
                                        }
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                    >
                                        View Messages
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleActivityAction(
                                                "export_details"
                                            )
                                        }
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                    >
                                        Export Details
                                    </button>
                                    <button
                                        onClick={() =>
                                            handleActivityAction(
                                                "contact_users"
                                            )
                                        }
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50"
                                    >
                                        Contact Users
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Book Information */}
                <div className="lg:col-span-1">
                    <BorrowActivityBookCard book={activity.book} />
                </div>

                {/* Middle Column - Activity Details */}
                <div className="lg:col-span-1 space-y-6">
                    <BorrowActivityDetailsCard
                        activity={activity}
                        meetUpDetail={activity.meet_up_detail}
                        returnDetail={activity.return_detail}
                    />
                    {activityHaveReport() && (
                        <div className="bg-white rounded-lg border border-gray-200 p-6 ">
                            <h1 className="text-lg font-semibold text-gray-900 mb-4">
                                Borrow Event Report Summary{" "}
                            </h1>
                            <div className="bg-red-50 border border-red-100 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <AlertTriangle className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                                    <div className="flex-1">
                                        <p className="text-sm font-medium text-red-900 mb-1">
                                            Reported by:
                                            <span className="font-semibold">
                                                {" "}
                                                {
                                                    activity.borrow_event_report
                                                        ?.reporter?.name
                                                }
                                            </span>
                                        </p>

                                        <p className="text-sm text-red-800 leading-relaxed">
                                            {
                                                activity.borrow_event_report
                                                    ?.reason
                                            }
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {!bookDepositConfirmed() && (
                                <button
                                    onClick={() =>
                                        handleConfirmBookDeposit(activity.id)
                                    }
                                    disabled={confirmingDeposit}
                                    className="cursor-pointer w-full inline-flex items-center justify-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <BookCheck
                                        className={`w-4 h-4 mr-2 ${
                                            confirmingDeposit
                                                ? "animate-pulse"
                                                : ""
                                        }`}
                                    />
                                    {confirmingDeposit
                                        ? "Confirming..."
                                        : "Confirm Book Deposit"}
                                </button>
                            )}
                        </div>
                    )}
                </div>
                <div className="lg:col-span-1">
                    <BorrowActivityParticipants
                        borrower={activity.borrower}
                        lender={activity.lender}
                    />
                </div>
            </div>
        </div>
    );
}
