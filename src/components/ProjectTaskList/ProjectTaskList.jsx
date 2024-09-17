import { useState } from 'react';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import ProjectTaskListItem from '../ProjectTaskListItem/ProjectTaskListItem';

// Icons
import { XMarkIcon } from '@heroicons/react/24/outline';

export default function ProjectTaskList({
    projectRole,
    project,
    handleReloadProjectDetails,
}) {
    const [showModal, setShowModal] = useState(false);
    const [fieldName, setFieldName] = useState('');
    const [fieldDescription, setFieldDescription] = useState('');

    // Hide modal and clean modal fields
    function cleanModal() {
        setFieldName('');
        setFieldDescription('');
        setShowModal(false);
    }

    function handleNameChange(e) {
        setFieldName(e.target.value);
    }

    function handleDescriptionChange(e) {
        setFieldDescription(e.target.value);
    }

    async function handleAddTask() {
        const { data, error } = await ProjectAPI.addProjectTask(
            project.id,
            fieldName,
            fieldDescription
        );

        cleanModal();
        handleReloadProjectDetails();
    }

    async function handleRemoveTask(taskId) {
        const { error } = await ProjectAPI.removeProjectTask(taskId);

        if (error) {
            console.error(error);
            return;
        }
        handleReloadProjectDetails();
    }

    function handleCloseModal() {
        cleanModal();
    }

    return (
        <>
            {project.project_task && (
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>
                                {['owner', 'manager'].includes(projectRole) && (
                                    <button
                                        className='bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
                                        onClick={() => setShowModal(true)}>
                                        Add Task
                                    </button>
                                )}
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {project?.project_task.map((task) => (
                            <ProjectTaskListItem
                                key={task.id}
                                task={task}
                                projectRole={projectRole}
                                handleRemoveTask={handleRemoveTask}
                            />
                        ))}
                    </tbody>
                </table>
            )}
            {showModal ? (
                <>
                    <div className='justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none'>
                        <div className='relative w-auto my-6 mx-auto max-w-3xl'>
                            {/*content*/}
                            <div className='border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-slate-700 outline-none focus:outline-none'>
                                {/*header*/}
                                <div className='flex items-start justify-between p-5 border-b border-solid border-blueGray-200 rounded-t'>
                                    <h3 className='text-2xl font-semibold'>
                                        Add Task
                                    </h3>
                                    <button
                                        className='ml-auto bg-transparent border-0 outline-none focus:outline-none'
                                        onClick={cleanModal}>
                                        <XMarkIcon className='text-white w-6 h-6 hover:text-slate-300' />
                                    </button>
                                </div>
                                {/*body*/}
                                <div className='flex flex-col gap-4 p-6 flex-auto'>
                                    <div className='flex gap-4 items-center justify-between'>
                                        <label
                                            htmlFor='name'
                                            className='font-bold w-32 text-left'>
                                            Name
                                        </label>
                                        <input
                                            name='name'
                                            id='name'
                                            onChange={handleNameChange}
                                            value={fieldName}
                                            required
                                            className='bg-gray-800 border border-gray-700 rounded p-2 m-0 min-w-60'
                                        />
                                    </div>
                                    <div className='flex gap-4 items-center justify-start'>
                                        <label
                                            htmlFor='description'
                                            className='pt-2 font-bold w-32 text-left'>
                                            Description
                                        </label>
                                        <input
                                            name='description'
                                            id='description'
                                            onChange={handleDescriptionChange}
                                            value={fieldDescription}
                                            className='bg-gray-800 border border-gray-700 rounded p-2 m-0 min-w-60'
                                        />
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className='flex gap-2 items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b'>
                                    <button
                                        className='bg-transparent hover:bg-blue-500 text-blue-700 font-semibold text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded'
                                        type='button'
                                        onClick={handleCloseModal}>
                                        Close
                                    </button>
                                    <button
                                        className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'
                                        type='button'
                                        onClick={handleAddTask}>
                                        Save
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='opacity-25 fixed inset-0 z-40 bg-black'></div>
                </>
            ) : null}
        </>
    );
}
