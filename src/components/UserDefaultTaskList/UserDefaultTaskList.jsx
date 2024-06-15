import { useState, useEffect } from 'react';

// API
import * as ProfileAPI from '../../utilities/profile-api';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import UserDefaultTaskListItem from '../UserDefaultTaskListItem/UserDefaultTaskListItem';

// Icons
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function UserDefaultTaskList() {
    const { user } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    useEffect(() => {
        loadTasks();
    }, []);

    const loadTasks = async () => {
        try {
            const data = await ProfileAPI.getUserDefaultTasks(user.id);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    };

    const handleAddTask = () => {
        setCurrentTask(null);
        setShowModal(true);
    };

    const handleEditTask = (task) => {
        setCurrentTask(task);
        setShowModal(true);
    };

    const handleSaveTask = async (task) => {
        try {
            if (task.id) {
                await ProfileAPI.updateUserDefaultTask(task);
            } else {
                await ProfileAPI.addUserDefaultTask(task);
            }
            loadTasks();
        } catch (error) {
            console.error('Error saving task:', error);
        }
        setShowModal(false);
    };

    const handleDeleteTask = async (id) => {
        try {
            await ProfileAPI.deleteUserDefaultTask(id);
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    };

    const cleanModal = () => {
        setShowModal(false);
        setCurrentTask(null);
    };

    return (
        <div className='mt-10'>
            <div className='flex justify-between items-end mb-0'>
                <h2 className='italic text-left pl-2 mb-0'>Default Tasks</h2>
                <button
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-2'
                    onClick={handleAddTask}>
                    Add New Task
                </button>
            </div>
            <div className='border-b-2 mb-4'></div>
            {tasks.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map((task) => (
                            <UserDefaultTaskListItem
                                key={task.id}
                                task={task}
                                handleEditTask={handleEditTask}
                                handleDeleteTask={handleDeleteTask}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className='text-left p-2'>No tasks available</p>
            )}
            {showModal && (
                <>
                    <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none'>
                                <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
                                    <h3 className='text-2xl font-semibold'>
                                        {currentTask
                                            ? 'Edit Task'
                                            : 'Add New Task'}
                                    </h3>
                                    <button
                                        className='ml-auto bg-transparent border-0 outline-none focus:outline-none'
                                        onClick={cleanModal}>
                                        <XMarkIcon className='text-white w-6 h-6 hover:text-slate-300' />
                                    </button>
                                </div>
                                <div className='flex flex-col gap-4 p-6 flex-auto'>
                                    <div className='flex gap-4 items-center justify-between'>
                                        <label
                                            htmlFor='name'
                                            className='font-bold w-40 text-left'>
                                            Name
                                        </label>
                                        <input
                                            type='text'
                                            name='name'
                                            id='name'
                                            onChange={(e) =>
                                                setCurrentTask({
                                                    ...currentTask,
                                                    name: e.target.value,
                                                })
                                            }
                                            value={
                                                currentTask
                                                    ? currentTask.name
                                                    : ''
                                            }
                                            className='w-full bg-gray-800 border border-gray-700 rounded p-2 m-0'
                                        />
                                    </div>
                                    <div className='flex gap-4 items-top justify-between'>
                                        <label
                                            htmlFor='description'
                                            className='pt-2 font-bold w-40 text-left'>
                                            Description
                                        </label>
                                        <textarea
                                            name='description'
                                            id='description'
                                            onChange={(e) =>
                                                setCurrentTask({
                                                    ...currentTask,
                                                    description: e.target.value,
                                                })
                                            }
                                            value={
                                                currentTask
                                                    ? currentTask.description
                                                    : ''
                                            }
                                            className='w-full h-32 bg-gray-800 border border-gray-700 rounded p-2 m-0'
                                        />
                                    </div>
                                </div>
                                <div className='flex gap-2 items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
                                    <button
                                        className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                        type='button'
                                        onClick={cleanModal}>
                                        Close
                                    </button>
                                    <button
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                        type='button'
                                        onClick={() =>
                                            handleSaveTask(currentTask)
                                        }>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
                </>
            )}
        </div>
    );
}
