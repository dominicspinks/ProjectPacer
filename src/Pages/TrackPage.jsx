import { useState, useMemo, useCallback } from 'react';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { useAuth } from '../contexts/AuthProvider';
import * as TaskAPI from '../utilities/task-api';
import { safeApiCall } from '../utilities/api-utilities';
import useTimer from '../hooks/useTimer';
import TaskHistoryItem from '../components/TaskList/TaskHistoryItem';
import AddCommentModal from '../components/Modals/AddCommentModal';
import ConfirmModal from '../components/Modals/ConfirmModal';

export default function TrackPage({ projectNames }) {
    const { user } = useAuth();

    const [selectedProjectId, setSelectedProjectId] = useState(0);
    const [taskList, setTaskList] = useState([]);
    const [taskSelected, setTaskSelected] = useState(0);
    const [activeTask, setActiveTask] = useState(null);
    const [accumulatedTime, setAccumulatedTime] = useState('00:00:00');
    const [taskHistory, setTaskHistory] = useState([]);
    const [showCommentModal, setShowCommentModal] = useState(false);
    const [commentField, setCommentField] = useState('');
    const [showDeleteTaskModal, setShowDeleteTaskModal] = useState(false);
    const [taskIdToDelete, setTaskIdToDelete] = useState(null);

    // Use custom timer hook
    const { sessionTime, formatDuration } = useTimer(activeTask);

    // Memoize the selected project
    const selectedProject = useMemo(() => {
        return projectNames.find((p) => p.id === +selectedProjectId);
    }, [projectNames, selectedProjectId]);

    // Set the start date of the current week (monday)
    const weekStartDate = useMemo(() => {
        const date = new Date();
        date.setDate(
            date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1)
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

        if (!success) return;

        setTaskList(tasks);
        // Get accumulated time for the selected project
        await getAccumulatedTime(newProjectId);

        // Get task time history for the selected project
        const { data: taskData, success: historySuccess } = await safeApiCall(
            () => TaskAPI.getTaskTimeHistory(newProjectId)
        );

        if (historySuccess) {
            setTaskHistory([...taskData]);
        }
    }, []);

    const getAccumulatedTime = useCallback(
        async (projectId = selectedProjectId) => {
            if (projectId === 0) return;

            const { data, success } = await safeApiCall(() =>
                TaskAPI.getAccumulatedTime(projectId)
            );

            if (success) {
                setAccumulatedTime(formatDuration(data));
            }
        },
        [selectedProjectId, formatDuration]
    );

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

    function handleStopButton() {
        // Check for active timer
        if (!activeTask || activeTask?.duration) return;

        setShowCommentModal(true);
        setCommentField('');
    }

    function handleCloseCommentModal() {
        setShowCommentModal(false);
        setCommentField('');
    }

    function handleCommentChange(e) {
        setCommentField(e.target.value);
    }

    const saveTaskTimer = useCallback(async () => {
        const { data, success } = await safeApiCall(() =>
            TaskAPI.updateTaskStopTime(activeTask.id, commentField)
        );

        if (success) {
            setActiveTask(data);
            // Get the new accumulated time for the selected project
            await getAccumulatedTime();
            setShowCommentModal(false);
            setCommentField('');
            setTaskHistory([...taskHistory, data]);
        }
    }, [activeTask, getAccumulatedTime, commentField, taskHistory]);

    const handleGenerateReportButton = useCallback(async () => {
        const { data, error } =
            await TaskAPI.getAllProjectsTaskTimeHistoryForWeek();
        if (error) {
            alert(error.message);
            return;
        }
        if (data.length === 0) {
            alert('There is no task history');
            return;
        }

        // Export data to Excel
        const worksheet = XLSX.utils.json_to_sheet(
            TaskAPI.transformDataForExport(data)
        );
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
            `Task History - ${weekStartDate.toISOString().split('T')[0]}.xlsx`
        );
    }, [selectedProjectId, selectedProject]);

    function userOwnsTaskHistory() {
        return !taskHistory.some((task) => task.user_id !== user.id);
    }

    const handleDeleteTaskHistory = useCallback(
        async (taskId) => {
            const { error } = await TaskAPI.deleteTaskHistory(taskId);

            if (!error) {
                setTaskHistory((prev) =>
                    prev.filter((task) => task.id !== taskId)
                );
                setShowDeleteTaskModal(false);
            }
        },
        [activeTask, taskHistory]
    );

    function openConfirmDeleteTaskModal(taskId) {
        setTaskIdToDelete(taskId);
        setShowDeleteTaskModal(true);
    }

    function handleCloseDeleteTaskModal() {
        setShowDeleteTaskModal(false);
        setTaskIdToDelete(null);
    }

    return (
        <div className='flex flex-col items-center justify-center gap-4 w-[95%] md:max-w-4xl'>
            {/* Time Tracker Card */}
            <div className='block p-4 m-2 rounded-lg shadow bg-gray-900 w-full'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight'>
                    Time Tracker
                </h5>
                <div className='flex flex-col gap-4'>
                    <div className='flex flex-col sm:flex-row gap-2 justify-between w-full'>
                        <div className='w-full'>
                            <div className=''>
                                <label htmlFor='project'>Active Project</label>
                                <select
                                    className={`pr-8 w-full ${
                                        selectedProjectId === 0
                                            ? 'italic'
                                            : 'not-italic'
                                    }`}
                                    id='project'
                                    onChange={handleSelectProject}>
                                    <option className='italic' value={0}>
                                        Select Project
                                    </option>
                                    {projectNames
                                        .filter(
                                            (project) => !project.is_archived
                                        )
                                        .map((project) => (
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
                                    className={`pr-8 w-full ${
                                        taskSelected === 0 ||
                                        taskList.length === 0
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
                        </div>

                        <div className='grid grid-rows-1 sm:grid-rows-3 grid-cols-3 sm:grid-cols-1 gap-3 sm:w-48'>
                            <button
                                className='bg-green-500 text-white rounded border border-gray-700 hover:bg-green-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={
                                    activeTask?.duration === null ||
                                    taskSelected === 0
                                }
                                onClick={handleStartButton}>
                                Start
                            </button>

                            <button
                                className='bg-red-500 text-white rounded border border-gray-700 hover:bg-red-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                disabled={
                                    !activeTask || activeTask.duration !== null
                                }
                                onClick={handleStopButton}>
                                Stop
                            </button>

                            <button
                                className='bg-blue-500 text-white rounded border border-gray-700 hover:bg-blue-700 p-2 disabled:opacity-50 disabled:cursor-not-allowed'
                                onClick={handleGenerateReportButton}>
                                Generate Report
                            </button>
                        </div>
                    </div>
                    <div className='grid grid-cols-2 gap-3 md:grid-cols-4'>
                        <div className='border border-gray-700 rounded p-2'>
                            <p className='text-sm font-medium'>Current Week</p>
                            <p>{weekStartDate.toLocaleDateString('en-AU')}</p>
                        </div>

                        <div className='border border-gray-700 rounded p-2'>
                            <p className='text-sm font-medium'>
                                Working Task Start
                            </p>
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
                            <p className='text-sm font-medium'>
                                Accumulated Hours
                            </p>
                            <p>{accumulatedTime}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Task History Card */}
            <div className='block p-4 m-2 rounded-lg shadow bg-gray-900 w-full'>
                <h5 className='mb-2 text-2xl font-bold tracking-tight'>
                    Task History
                </h5>

                <div className='w-full'>
                    {/* Desktop Table */}
                    <div className='hidden md:block overflow-x-auto'>
                        <table className='w-full table-auto'>
                            <thead>
                                <tr className='text-xs'>
                                    <th className='w-auto'>Task</th>
                                    {!userOwnsTaskHistory() && (
                                        <th className='w-auto'>User</th>
                                    )}
                                    <th className='w-20'>Date</th>
                                    <th className='w-12 text-center'>Start</th>
                                    <th className='w-12 text-center'>End</th>
                                    <th className='w-16 text-center'>
                                        Minutes
                                    </th>
                                    <th className='min-w-80'>Comments</th>
                                    <th className='w-12'></th>
                                </tr>
                            </thead>
                            <tbody>
                                {taskHistory
                                    .slice()
                                    .sort(
                                        (a, b) =>
                                            new Date(b.created_at) -
                                            new Date(a.created_at)
                                    )
                                    .map((task) => (
                                        <TaskHistoryItem
                                            key={task.id}
                                            task={task}
                                            showUser={!userOwnsTaskHistory()}
                                            handleDeleteTask={
                                                openConfirmDeleteTaskModal
                                            }
                                            isMobile={false}
                                        />
                                    ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className='block md:hidden space-y-4'>
                        {taskHistory
                            .slice()
                            .sort(
                                (a, b) =>
                                    new Date(b.created_at) -
                                    new Date(a.created_at)
                            )
                            .map((task) => (
                                <TaskHistoryItem
                                    key={task.id}
                                    task={task}
                                    showUser={!userOwnsTaskHistory()}
                                    handleDeleteTask={
                                        openConfirmDeleteTaskModal
                                    }
                                    isMobile={true}
                                />
                            ))}
                    </div>
                </div>
            </div>

            {/* Task Comment Modal */}
            <AddCommentModal
                visible={showCommentModal}
                handleCloseModal={handleCloseCommentModal}
                handleAddComment={saveTaskTimer}
                fieldComment={commentField}
                handleCommentChange={handleCommentChange}
            />

            {/* Task Delete Confirmation Modal */}
            <ConfirmModal
                visible={showDeleteTaskModal}
                handleCancel={handleCloseDeleteTaskModal}
                handleConfirm={handleDeleteTaskHistory}
                message='Are you sure you want to delete this task history?'
                confirmButtonLabel='Delete'
                idToDelete={taskIdToDelete}
            />
        </div>
    );
}
