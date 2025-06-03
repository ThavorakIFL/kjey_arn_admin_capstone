import UserSearch from "@/components/UserSearch";
export default function SearchPage() {
    return (
        <div className="flex flex-col items-center justify-center h-full">
            <h1 className="text-2xl font-bold mb-4">Search Users</h1>
            <UserSearch
                placeholder="Search for users..."
                className="w-full max-w-md"
            />
        </div>
    );
}
