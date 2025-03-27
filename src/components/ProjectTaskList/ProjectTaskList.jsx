import { useState } from 'react';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import ProjectTaskListItem from './ProjectTaskListItem';

// Icons
import { XMarkIcon } from '@heroicons/react/24/outline';
import AddTaskModal from '../Modals/AddTaskModal';
import { PlusIcon } from '@heroicons/react/24/solid';

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
                            <th className="px-2 py-1 text-left align-middle h-10 w-[40%]">Name</th>
                            <th className="px-2 py-1 text-left align-middle h-10 w-[50%]">Description</th>
                            <th className="py-1 text-center align-middle h-10 w-[10%] px-0">
                                {['owner', 'manager'].includes(projectRole) && (
                                    <button
                                        className='bg-blue-500 text-sm hover:bg-blue-700 text-white font-bold rounded inline-flex items-center justify-center p-1'
                                        onClick={() => setShowModal(true)}>
                                        <PlusIcon className='w-5 h-5 text-white hover:text-gray-300' />
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

            <AddTaskModal
                visible={showModal}
                handleCloseModal={handleCloseModal}
                handleAddTask={handleAddTask}
                handleNameChange={handleNameChange}
                fieldName={fieldName}
                handleDescriptionChange={handleDescriptionChange}
                fieldDescription={fieldDescription}
            />
        </>
    );
}
