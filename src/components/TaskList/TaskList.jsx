import { useState } from 'react';

// Components
import UserDefaultTaskListItem from '../TaskListItem/TaskListItem';

// Icons
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function UserDefaultTaskList({
    tasks,
    handleDeleteTask,
    handleSaveTask,
}) {
    const [showModal, setShowModal] = useState(false);
    const [currentTask, setCurrentTask] = useState(null);

    const cleanModal = () => {
        setShowModal(false);
        setCurrentTask(null);
    };

    function handleAddTask() {
        setCurrentTask(null);
        setShowModal(true);
    }

    function handleEditTask(task) {
        setCurrentTask(task);
        setShowModal(true);
    }

    return (
        <div className='mt-10'>
            <h2 className='italic text-left pl-2 border-b-2 mb-4'>
                Default Tasks
            </h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Description</th>
                        <th>
                            <button
                                className='bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
                                onClick={handleAddTask}>
                                Add New Task
                            </button>
                        </th>
                    </tr>
                </thead>
                {tasks.length > 0 ? (
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
                ) : (
                    <p className='text-left p-2'>No tasks available</p>
                )}
            </table>
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
                                                currentTask?.description
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
                                        onClick={() => {
                                            handleSaveTask(currentTask);
                                            setShowModal(false);
                                        }}>
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
