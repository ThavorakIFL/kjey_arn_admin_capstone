// // components/user/UserBorrowActivity.tsx
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import Image from "next/image";
// import { BorrowActivity, BorrowStatus } from "@/app/types/admin";

// // Type for borrow activity

// interface UserBorrowActivityProps {
//     activities: BorrowActivity[];
// }

// const getStatusBadge = (status: number) => {
//     switch (status) {
//         case 1:
//             return (
//                 <Badge className="bg-teal-100 text-teal-800 border-teal-200 hover:bg-teal-100">
//                     Pending Request
//                 </Badge>
//             );
//         case 2:
//             return (
//                 <Badge className="bg-green-100 text-green-800 border-green-200 hover:bg-green-100">
//                     Accepted by Lender
//                 </Badge>
//             );
//         case 4:
//             return (
//                 <Badge className="bg-gray-100 text-gray-800 border-gray-200 hover:bg-gray-100">
//                     Borrowing In Progress
//                 </Badge>
//             );
//         case 7:
//             return (
//                 <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 hover:bg-yellow-100">
//                     Return Confirmation
//                 </Badge>
//             );
//         case 8:
//             return (
//                 <Badge className="bg-red-100 text-red-800 border-red-200 hover:bg-red-100">
//                     Deposit
//                 </Badge>
//             );
//         default:
//             return <Badge variant="outline">Unknown</Badge>;
//     }
// };

// export default function UserBorrowActivity({
//     activities,
// }: UserBorrowActivityProps) {
//     return (
//         <Card className="h-fit">
//             <CardHeader>
//                 <CardTitle className="text-lg font-semibold text-gray-900">
//                     User's Borrow Activity
//                 </CardTitle>
//             </CardHeader>
//             <CardContent>
//                 {activities.length === 0 ? (
//                     <div className="text-center py-8 text-gray-500">
//                         <p>No borrow activity yet</p>
//                     </div>
//                 ) : (
//                     <div className="space-y-4">
//                         {activities.map((activity) => (
//                             <div
//                                 key={activity.id}
//                                 className="flex items-center space-x-4 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
//                             >
//                                 {/* Book Cover */}
//                                 <div className="flex-shrink-0">
//                                     <div className="relative h-16 w-12 rounded-md overflow-hidden bg-gray-200">
//                                         <Image
//                                             src={
//                                                 process.env
//                                                     .NEXT_PUBLIC_IMAGE_PATH! +
//                                                 activity.book.pictures![0]
//                                                     ?.picture
//                                             }
//                                             alt={
//                                                 activity.book.title ||
//                                                 "Book Cover"
//                                             }
//                                             fill
//                                             className="object-cover"
//                                             sizes="48px"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Book Info */}
//                                 <div className="flex-grow min-w-0">
//                                     <h4 className="font-semibold text-gray-900 truncate">
//                                         {activity.book.title}
//                                     </h4>
//                                     <p className="text-sm text-gray-600 truncate">
//                                         Lender: {activity.lender.name}
//                                     </p>
//                                 </div>

//                                 {/* Status Badge */}
//                                 <div className="flex-shrink-0">
//                                     {getStatusBadge(
//                                         activity.borrow_status.borrow_status_id
//                                     )}
//                                 </div>
//                             </div>
//                         ))}
//                     </div>
//                 )}
//             </CardContent>
//         </Card>
//     );
// }
