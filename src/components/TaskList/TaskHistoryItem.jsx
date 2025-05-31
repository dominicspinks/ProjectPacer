import { XMarkIcon } from '@heroicons/react/24/outline';

export default function TaskHistoryItem({ task, showUser, handleDeleteTask, isMobile }) {
    function formatDate(date) {
        const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
        return (new Date(date)).toLocaleString('en-AU', options);
    }

    function formatTime(date) {
        const options = { hour: 'numeric', minute: 'numeric', hour12: false };
        return (new Date(date)).toLocaleString('en-AU', options);
    }

    if (isMobile) {
        return (
            <div className="p-4 bg-gray-800 rounded shadow-md text-sm space-y-1">
                <div><strong>Task:</strong> {task.project_task.name}</div>
                {showUser && <div><strong>User:</strong> {task.performed_by}</div>}
                <div><strong>Date:</strong> {formatDate(task.created_at)} {formatTime(task.created_at)} to {formatTime(task.stopped_at)}</div>
                <div><strong>Duration (minutes):</strong> {(task.duration / 60).toFixed(0)}</div>
                <div className="whitespace-pre-wrap break-words"><strong>Comments:</strong> {task.comment}</div>
                <div className="text-right mt-2">
                    <button
                        className="text-red-500"
                        onClick={() => handleDeleteTask(task.id)}
                    >
                        <XMarkIcon className="w-4 h-4 inline" />
                    </button>
                </div>
            </div>
        );
    }

    // Desktop table row version
    return (
        <tr className="text-xs md:text-base p-1">
            <td className="text-xs">{task.project_task.name}</td>
            {showUser && <td className="text-xs">{task.performed_by}</td>}
            <td className="text-xs">{formatDate(task.created_at)}</td>
            <td className="text-xs text-center">{formatTime(task.created_at)}</td>
            <td className="text-xs text-center">{formatTime(task.stopped_at)}</td>
            <td className="text-xs text-center">{(task.duration / 60).toFixed(0)}</td>
            <td className="text-xs whitespace-pre-wrap break-words">{task.comment}</td>
            <td>
                <button
                    className="text-red-500"
                    onClick={() => handleDeleteTask(task.id)}
                >
                    <XMarkIcon className="w-4 h-4" />
                </button>
            </td>
        </tr>
    );
}