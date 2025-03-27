import { useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../contexts/AuthProvider';
import * as TaskAPI from '../utilities/task-api';
import { safeApiCall } from '../utilities/api-utilities';
import useTimer from '../hooks/useTimer';

export default function TrackPage({ projectNames }) {
    const { user } = useAuth();

    const [selectedProjectId, setSelectedProjectId] = useState(0);
    const [taskList, setTaskList] = useState([]);
    const [taskSelected, setTaskSelected] = useState(0);
    const [activeTask, setActiveTask] = useState(null);
    const [accumulatedTime, setAccumulatedTime] = useState('00:00:00');

    // Use custom timer hook
    const { sessionTime, formatDuration } = useTimer(activeTask);

    // Memoize the selected project
    const selectedProject = useMemo(() => {
        return projectNames.find(p => p.id === +selectedProjectId);
    }, [projectNames, selectedProjectId]);

    // Set the start date of the current week (monday)
    const weekStartDate = useMemo(() => {
        const date = new Date();
        date.setDate(
            date.getDate() -
            (date.getDay() === 0 ? 6 : date.getDay() - 1)
        );
        return date;
    }, []);

    // Load tasks when project changes
    const handleSelectProject = useCallback(async (e) => {
        const newProjectId = +e.target.value;
        setSelectedProjectId(newProjectId);
        setTaskSelected(0);

        if (newProjectId === 0) {
            setTaskList([]);
            return;
        }

        // Get task list for the selected project
        const { data: tasks, success } = await safeApiCall(() =>
            TaskAPI.getTaskList(newProjectId)
        );

        if (success) {
            setTaskList(tasks);
            // Get accumulated time for the selected project
            await getAccumulatedTime(newProjectId);
        }
    }, []);

    const getAccumulatedTime = useCallback(async (projectId = selectedProjectId) => {
        if (projectId === 0) return;

        const { data, success } = await safeApiCall(() =>
            TaskAPI.getAccumulatedTime(projectId)
        );

        if (success) {
            setAccumulatedTime(formatDuration(data));
        }
    }, [selectedProjectId, formatDuration]);

    const handleSelectTask = useCallback((e) => {
        setTaskSelected(+e.target.value);
        if (+e.target.value === 0) {
            return;
        }

        // Clear active task
        setActiveTask(null);
    }, []);

    const handleStartButton = useCallback(async () => {
        // Check for active timers to prevent changing task without stopping timer first
        if (activeTask?.duration === null || taskSelected === 0) return;

        const { data, success } = await safeApiCall(() =>
            TaskAPI.addTaskTime(taskSelected, user.id)
        );

        if (success) {
            setActiveTask(data);
        }
    }, [activeTask, taskSelected, user.id]);

    const handleStopButton = useCallback(async () => {
        // Check for active timer
        if (!activeTask || activeTask?.duration) return;

        const { data, success } = await safeApiCall(() =>
            TaskAPI.updateTaskStopTime(activeTask.id)
        );

        if (success) {
            setActiveTask(data);
            // Get the new accumulated time for the selected project
            await getAccumulatedTime();
        }
    }, [activeTask, getAccumulatedTime]);

    const handleGenerateReportButton = useCallback(async () => {
        const { data, success } = await safeApiCall(() =>
            TaskAPI.getTaskTimeHistory(selectedProjectId)
        );

        if (!success) {
            return;
        }

        if (data.length === 0) {
            alert('This project does not have any task timer history');
            return;
        }

        // Export data to Excel
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(
            workbook,
            worksheet,
            selectedProject?.name || 'Report'
        );

        // Buffer to store the generated Excel file
        const excelBuffer = XLSX.write(workbook, {
            bookType: 'xlsx',
            type: 'array',
        });
        const blob = new Blob([excelBuffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
        });

        saveAs(
            blob,
            `Task History - ${selectedProject?.name || 'Project'}.xlsx`
        );
    }, [selectedProjectId, selectedProject]);

    return (
        <div className='block p-4 m-2 rounded-lg shadow bg-gray-900 w-[95%] md:max-w-xl'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight'>
                Time Tracker
            </h5>
            <div className='flex flex-col gap-4'>
                <div className='w-full'>
                    <label htmlFor='project'>Active Project</label>
                    <select
                        className={`pr-8 w-full ${selectedProjectId === 0 ? 'italic' : 'not-italic'}`}
                        id='project'
                        onChange={handleSelectProject}>
                        <option className='italic' value={0}>
                            Select Project
                        </option>
                        {projectNames.map((project) => (
                            <option
                                className='not-italic'
                                key={project.id}
                                value={project.id}>
                                {project.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='w-full'>
                    <label htmlFor='task'>Task Type</label>
                    <select
                        className={`pr-8 w-full ${taskSelected === 0 || taskList.length === 0
                            ? 'italic'
                            : 'not-italic'
                            }`}
                        id='task'
                        onChange={handleSelectTask}
                        disabled={selectedProjectId === 0}>
                        <option className='italic' value={0}>
                            {taskList.length === 0
                                ? 'No Available Tasks'
                                : 'Select Task'}
                        </option>
                        {taskList.map((task) => (
                            <option
                                className='not-italic'
                                key={task.id}
                                value={task.id}>
                                {task.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='grid grid-cols-3 gap-3'>
                    <button
                        className='bg-green-500 text-white rounded border border-gray-700 hover:bg-green-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={activeTask?.duration === null || taskSelected === 0}
                        onClick={handleStartButton}>
                        Start
                    </button>

                    <button
                        className='bg-red-500 text-white rounded border border-gray-700 hover:bg-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        disabled={!activeTask || activeTask.duration !== null}
                        onClick={handleStopButton}>
                        Stop
                    </button>

                    <button
                        className='bg-blue-500 text-white rounded border border-gray-700 hover:bg-blue-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed'
                        onClick={handleGenerateReportButton}
                        disabled={selectedProjectId === 0}>
                        Generate Report
                    </button>
                </div>

                <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                    <div className='border border-gray-700 rounded p-2'>
                        <p className='text-sm font-medium'>Current Week</p>
                        <p>{weekStartDate.toLocaleDateString('en-AU')}</p>
                    </div>

                    <div className='border border-gray-700 rounded p-2'>
                        <p className='text-sm font-medium'>Working Task Start</p>
                        <p>
                            {activeTask?.created_at
                                ? new Date(
                                    activeTask.created_at
                                ).toLocaleTimeString('en-AU', {
                                    hourCycle: 'h23',
                                }) +
                                ' ' +
                                new Date(
                                    activeTask.created_at
                                ).toLocaleDateString('en-AU')
                                : '--'}
                        </p>
                    </div>

                    <div className='border border-gray-700 rounded p-2'>
                        <p className='text-sm font-medium'>Session Time</p>
                        <p>{sessionTime}</p>
                    </div>

                    <div className='border border-gray-700 rounded p-2'>
                        <p className='text-sm font-medium'>Accumulated Hours</p>
                        <p>{accumulatedTime}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}
