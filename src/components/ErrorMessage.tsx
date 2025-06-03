function ErrorMessage({ message }: { message: string }) {
    return (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Error: {message}
        </div>
    );
}
export default ErrorMessage;
