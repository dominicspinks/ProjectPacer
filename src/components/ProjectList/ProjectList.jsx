import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProjectListItem from '../ProjectListItem/ProjectListItem';

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
		<>
			<div className='flex justify-between items-center mb-4'>
				<select
					name='projectStatus'
					onChange={handleProjectStatusChange}
					className='pr-10'>
					<option value='active'>Active</option>
					<option value='archived'>Archived</option>
				</select>
				<div className='flex gap-4 items-center justify-between'>
					<label htmlFor='projectName'>Project Name</label>
					<input
						type='text'
						id='projectName'
						onChange={handleProjectNameChange}
						placeholder='search'
						value={filterProjectName}
					/>
				</div>
				<div className='flex gap-2 items-center'>
					<label htmlFor='toggleOwner'>
						Show only projects I own
					</label>{' '}
					<input
						type='checkbox'
						id='toggleOwner'
						onChange={handleToggleOwner}
					/>
				</div>
			</div>
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Team</th>
						<th>
							<button
								className='bg-blue-500 text-sm  hover:bg-blue-700 text-white font-bold py-1 px-2 rounded'
								onClick={() => setShowModal(true)}>
								New Project
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
			{filteredProjects?.length === 0 && (
				<p className='italic'>No projects found</p>
			)}
		</>
	);
}
