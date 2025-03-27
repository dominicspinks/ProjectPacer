import { useState, useMemo } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import ProjectListItem from './ProjectListItem';
import { PlusIcon } from '@heroicons/react/24/outline';

export default function ProjectList({
    projects,
    reloadProjects,
    setShowModal,
}) {
    const [filterProjectStatus, setFilterProjectStatus] = useState('active');
    const [filterOwner, setFilterOwner] = useState(false);
    const [filterProjectName, setFilterProjectName] = useState('');
    const { user } = useAuth();

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            // Check owner filter
            if (filterOwner) {
                const isOwner = project.project_member.some(
                    member => member.role_type.role_type === 'owner' && member.user_id === user.id
                );
                if (!isOwner) return false;
            }

            // Check project status filter
            if (project.is_archived !== (filterProjectStatus === 'archived')) return false;

            // Check project name filter
            if (
                filterProjectName.length > 0 &&
                !project.name.toLowerCase().startsWith(filterProjectName.toLowerCase())
            ) return false;

            return true;
        });
    }, [projects, filterProjectName, filterProjectStatus, filterOwner, user.id]);

    function handleProjectNameChange(e) {
        setFilterProjectName(e.target.value);
    }

    function handleProjectStatusChange(e) {
        setFilterProjectStatus(e.target.value);
    }

    function handleToggleOwner(e) {
        setFilterOwner(e.target.checked);
    }

    return (
        <div className="w-full overflow-x-auto">
            <div className='flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-4'>
                <select
                    name='projectStatus'
                    onChange={handleProjectStatusChange}
                    className='px-3 py-2 bg-gray-700 rounded w-full md:w-auto'>
                    <option value='active'>Active</option>
                    <option value='archived'>Archived</option>
                </select>

                <div className='flex flex-col sm:flex-row gap-2 sm:items-center w-full md:w-auto'>
                    <label htmlFor='projectName' className="whitespace-nowrap">Project Name</label>
                    <input
                        type='text'
                        id='projectName'
                        onChange={handleProjectNameChange}
                        placeholder='search'
                        value={filterProjectName}
                        className='px-3 py-2 bg-gray-700 rounded w-full'
                    />
                </div>

                <div className='flex items-center gap-2'>
                    <label htmlFor='toggleOwner' className="whitespace-nowrap text-sm">
                        Show only projects I own
                    </label>
                    <input
                        type='checkbox'
                        id='toggleOwner'
                        onChange={handleToggleOwner}
                        className="h-4 w-4"
                    />
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-2 py-1 text-left align-middle h-10 w-[60%]">Name</th>
                            <th className="px-2 py-1 text-left align-middle h-10 w-[30%]">Team</th>
                            <th className="py-1 text-center align-middle h-10 w-[10%] px-0">
                                <button
                                    className='bg-blue-500 text-sm hover:bg-blue-700 text-white font-bold rounded inline-flex items-center justify-center p-1'
                                    onClick={() => setShowModal(true)}>
                                    <PlusIcon className='w-5 h-5 text-white hover:text-gray-300' />
                                </button>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProjects.map((project) => (
                            <ProjectListItem
                                key={project.id}
                                project={project}
                                reloadProjects={reloadProjects}
                            />
                        ))}
                    </tbody>
                </table>
            </div>

            {filteredProjects?.length === 0 && (
                <p className='italic text-center mt-4'>No projects found</p>
            )}
        </div>
    );
}
