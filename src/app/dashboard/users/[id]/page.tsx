import UserInformationClient from "./UserInformationClient";

interface UserInformationPageProps {
    params: { id: string };
}

export default async function UserInformationPage({
    params,
}: UserInformationPageProps) {
    const { id } = await params;
    return <UserInformationClient userId={id} />;
}
