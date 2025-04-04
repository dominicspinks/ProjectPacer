export default function ErrorBubble({ message, level }) {
    if (level === 'error') {
        return (
            <div className="p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
                <span className="font-medium">Error: </span>{message}
            </div>
        );
    }

    if (level === 'success') {
        return (
            <div className="p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
                <span className="font-medium">Success: </span>{message}
            </div>
        );
    }

    if (level === 'warning') {
        return (
            <div className="p-4 mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300" role="alert">
                <span className="font-medium">Warning: </span>{message}
            </div>
        );
    }

    return (
        <div className="p-4 text-sm text-gray-800 rounded-lg bg-gray-50 dark:bg-gray-800 dark:text-gray-300" role="alert">{message}</div>
    )
}