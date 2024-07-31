import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// APIs
import * as TaskAPI from '../../utilities/task-api';

// Components
import SpinnerIcon from '../../components/SpinnerIcon/SpinnerIcon';

export default function TrackPage({ projectNames }) {
    const { user } = useAuth();

    const [selectedProjectId, setSelectedProjectId] = useState('');
    const [taskList, setTaskList] = useState([]);
    const [taskSelected, setTaskSelected] = useState('');
    const [activeTask, setActiveTask] = useState(null);
    const [sessionTime, setSessionTime] = useState('00:00:00');
    const [accumulatedTime, setAccumulatedTime] = useState('00:00:00');

    const formatDuration = (seconds) => {
        if (!seconds || seconds <= 0) return '00:00:00';
        const hours = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const minutes = String(Math.floor((seconds % 3600) / 60)).padStart(
            2,
            '0'
        );
        const secs = String(seconds % 60).padStart(2, '0');
        console.log(seconds, `${hours}:${minutes}:${secs}`);
        return `${hours}:${minutes}:${secs}`;
    };

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
    }, [activeTask]);

    // Set the start date of the current week (monday)
    const weekStartDate = new Date();
    weekStartDate.setDate(
        weekStartDate.getDate() -
            (weekStartDate.getDay() === 0 ? 6 : weekStartDate.getDay() - 1)
    );

    async function handleSelectProject(e) {
        setSelectedProjectId(e.target.value);
        if (e.target.value === '') return;

        // Get task list for the selected project
        const { data, error } = await TaskAPI.getTaskList(e.target.value);

        if (error) {
            console.error(error);
            return;
        }
        setTaskList(data);

        // Get accumulated time for the selected project
        await getAccumulatedTime();
    }

    async function getAccumulatedTime() {
        console.log(selectedProjectId);
        const { data, error } = await TaskAPI.getAccumulatedTime(
            selectedProjectId
        );

        if (error) {
            console.error(error);
            return;
        }
        setAccumulatedTime(formatDuration(data));
    }

    function handleSelectTask(e) {
        setTaskSelected(e.target.value);
        if (e.target.value === '') {
            setTaskList([]);
            return;
        }

        // Clear active task
        setActiveTask(null);
        setSessionTime('00:00:00');
    }

    async function handleStartButton() {
        console.log('press start');

        // Check for active timers to prevent changing task without stopping timer first
        console.log(activeTask, taskSelected);
        if (activeTask?.duration === null || taskSelected === '') return;
        console.log('create new timer');
        await startTaskTimer();
    }

    async function handleStopButton() {
        console.log('press stop');
        // Check for active timer
        if (!activeTask || activeTask?.duration) return;

        // Set stop time
        await stopTaskTimer();

        // Get the new accumulated time for the selected project
        await getAccumulatedTime();
    }

    function handleGenerateReportButton() {
        console.log('press generate report');
    }

    async function startTaskTimer() {
        // Create new entry in task_time table
        const { data, error } = await TaskAPI.addTaskTime(
            taskSelected,
            user.id
        );

        if (error) {
            console.error(error);
            return;
        }
        console.log(data.created_at);
        setActiveTask(data);
    }

    async function stopTaskTimer() {
        // Update stopped_at field in task_time table
        const { data, error } = await TaskAPI.updateTaskStopTime(activeTask.id);
        if (error) {
            console.error(error);
            return;
        }
        console.log(data);
        setActiveTask(data);
    }

    return (
        <div className='block p-6  border  rounded-lg shadow bg-gray-800 border-gray-700'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight mb-4'>
                Time Tracker
            </h5>
            <div className='grid grid-cols-2 gap-4'>
                <div className='col-span-2 w-full'>
                    <label htmlFor='project'>Active Project</label>
                    <select
                        className={`pr-8 w-full ${
                            selectedProjectId === '' ? 'italic' : 'not-italic'
                        }`}
                        id='project'
                        onChange={handleSelectProject}>
                        <option className='italic' value=''>
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
                        className={`pr-8 w-full ${
                            taskSelected === '' || taskList.length === 0
                                ? 'italic'
                                : 'not-italic'
                        }`}
                        id='task'
                        onChange={handleSelectTask}>
                        <option className='italic' value=''>
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
                <div className='border border-gray-700 rounded p-2'>
                    <p>Current Week</p>
                    <p>{weekStartDate.toLocaleDateString('en-AU')}</p>
                </div>
                <div>
                    <button
                        className={`w-full h-full bg-green-500 text-white rounded border border-gray-700 hover:bg-green-700 ${
                            activeTask?.duration === null ? 'disabled' : ''
                        }`}
                        disabled={activeTask?.duration === null}
                        onClick={handleStartButton}>
                        Start
                    </button>
                </div>
                <div className='border border-gray-700 rounded p-2'>
                    <p>Working Task Start Time</p>
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
                <div>
                    <button
                        className={`w-full h-full bg-red-500 text-white rounded border border-gray-700 hover:bg-red-700 ${
                            activeTask?.duration === null
                                ? ''
                                : 'disabled:cursor-not-allowed disabled'
                        }`}
                        disabled={!activeTask || activeTask.duration !== null}
                        onClick={handleStopButton}>
                        Stop
                    </button>
                </div>
                <div className='border border-gray-700 rounded p-2'>
                    <p>Session Time</p>
                    <p>{sessionTime}</p>
                </div>

                <div>
                    <button
                        className={`w-full h-full bg-blue-500 text-white rounded border border-gray-700 hover:bg-blue-700 ${
                            activeTask?.StopTime ? 'cursor-not-allowed' : ''
                        }`}
                        disabled
                        onClick={handleGenerateReportButton}>
                        Generate Report
                    </button>
                </div>
                <div className='border border-gray-700 rounded p-2'>
                    <p>Accumulated Hours</p>
                    <p>{accumulatedTime}</p>
                </div>
            </div>
        </div>
    );
}
