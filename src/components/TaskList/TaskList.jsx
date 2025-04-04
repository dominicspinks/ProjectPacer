import { useState } from 'react';
import UserDefaultTaskListItem from './TaskListItem';
import NewTaskModal from '../Modals/NewTaskModal';

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
                                New Task
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
                    <tbody>
                        <tr>
                            <td colSpan="3" className="text-left p-2 italic">No tasks available</td>
                        </tr>
                    </tbody>
                )}
            </table>

            <NewTaskModal visible={showModal} handleCloseModal={cleanModal} handleSaveTask={handleSaveTask} currentTask={currentTask} setCurrentTask={setCurrentTask} setShowModal={setShowModal} />
        </div>
    );
}
