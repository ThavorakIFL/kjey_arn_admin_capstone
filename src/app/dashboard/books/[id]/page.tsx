import BookInformationClient from "./BookInformationClient";

interface BookInformationPageProps {
    params: { id: string };
}

export default async function BookInformationPage({
    params,
}: BookInformationPageProps) {
    const { id } = await params;
    return <BookInformationClient bookId={id} />;
}
