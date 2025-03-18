import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProjectListItem from './ProjectListItem';

export default function ProjectList({
    projects,
    reloadProjects,
    setShowModal,
}) {
    const [filterProjectStatus, setFilterProjectStatus] = useState('active');
    const [filterOwner, setFilterOwner] = useState(false);
    const [filterProjectName, setFilterProjectName] = useState('');
    const [filteredProjects, setFilteredProjects] = useState([...projects]);
    const { user } = useAuth();

    // Filter values to be removed from the useEffect and called directly from the change handler
    useEffect(() => {
        // This will update the filtered list and reapply the filters if the 'projects' state or any filters are updated
        filterList();
    }, [projects, filterProjectName, filterProjectStatus, filterOwner]);

    function filterList() {
        // Filter the list of projects based on the selected search filters
        const filteredList = [];

        for (let i = 0; i < projects.length; i++) {
            const project = projects[i];

            // If filter applied and the user is not an owner, skip the project
            if (
                filterOwner &&
                project.project_member.find((member) => {
                    return (
                        member.role_type.role_type === 'owner' &&
                        member.user_id === user.id
                    );
                }) === undefined
            )
                continue;

            // If filter applied and the project is not archived, skip the project
            if (project.is_archived !== (filterProjectStatus === 'archived'))
                continue;

            // If filter is not empty, and the project name doesn't match, skip the project
            if (
                filterProjectName.length > 0 &&
                !project.name
                    .toLowerCase()
                    .startsWith(filterProjectName.toLowerCase())
            )
                continue;

            // Add the project to the filtered list
            filteredList.push(project);
        }

        setFilteredProjects([...filteredList]);
    }

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
            {/* Filter Controls - Stack on mobile, row on larger screens */}
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

            {/* Project Table with horizontal scroll on small screens */}
            <div className="overflow-x-auto">
                <table className="min-w-full table-auto">
                    <thead className="bg-gray-700">
                        <tr>
                            <th className="px-4 py-2 text-left">Name</th>
                            <th className="px-4 py-2 text-left">Team</th>
                            <th className="px-1 py-2 text-right">
                                <button
                                    className='bg-blue-500 text-sm hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
                                    onClick={() => setShowModal(true)}>
                                    New
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
