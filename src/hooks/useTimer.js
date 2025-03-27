import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook to handle timer functionality for time tracking
 * @param {Object} activeTask - The currently active task object
 * @returns {Object} - Contains sessionTime and formatDuration function
 */
export const useTimer = (activeTask) => {
    const [sessionTime, setSessionTime] = useState('00:00:00');

    const formatDuration = useCallback((seconds) => {
        if (!seconds || seconds <= 0) return '00:00:00';
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${hours}:${minutes}:${secs}`;
    }, []);

    useEffect(() => {
        function calculateTimeDifference() {
            if (!activeTask) {
                setSessionTime('00:00:00');
                return;
            }

            if (activeTask.duration !== null) {
                setSessionTime(formatDuration(activeTask.duration));
                return;
            }

            const now = new Date();
            const createdTime = new Date(activeTask.created_at);
            const diffInSeconds = Math.floor((now - createdTime) / 1000);

            setSessionTime(formatDuration(diffInSeconds));
        }

        if (activeTask && activeTask.duration === null) {
            const interval = setInterval(calculateTimeDifference, 1000);
            return () => clearInterval(interval);
        } else {
            calculateTimeDifference();
        }
    }, [activeTask, formatDuration]);

    return { sessionTime, formatDuration };
};

export default useTimer;