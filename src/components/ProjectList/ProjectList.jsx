import ProjectListItem from '../ProjectListItem/ProjectListItem';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthProvider';

import './ProjectList.css';

export default function ProjectList({ projects }) {
	const [filterProjectStatus, setFilterProjectStatus] = useState('active');
	const [filterOwner, setFilterOwner] = useState(false);
	const [filterProjectName, setFilterProjectName] = useState('');
	console.log('projects list, projects', projects)
	const [filteredProjects, setFilteredProjects] = useState([...projects]);

	const { user } = useAuth();

	useEffect(() => {
		// This will update the filtered list and reapply the filters if the 'projects' state is ever updated
		filterList()
	}, [projects, filterProjectName, filterProjectStatus, filterOwner])

	function filterList() {
		// Filter the filteredProjects list by the status (is_archived) field
		console.log('run filter', 'owner', filterOwner,'name', filterProjectName,'status',filterProjectStatus)
		const filteredList = [];
		for (let i = 0; i < projects.length; i++) {
			const project = projects[0];
			if (filterOwner && project.project_member.find((member) => member.role_type.role_type === 'owner' && member.user_id === user.id === undefined)) continue;

			if (project.is_archived !== (filterProjectStatus === 'archived')) continue

			if (filterProjectName.length > 0 && !project.name.toLowerCase().startsWith(filterProjectName.toLowerCase())) continue

			filteredList.push(project)
		}


		// owner
		if (filterOwner) {
			filteredList.filter((project) => project.project_member.find((member) => member.role_type.role_type === 'owner' && member.user_id === user.id))
		}
		// status
		filteredList.filter((project) => project.is_archived === (filterProjectStatus === 'archived'))
		// name
		if (filterProjectName.length > 0) {
			filteredList.filter((project) => project.name.startsWith(filterProjectName))
		}
		console.log('filtered list', filteredList)
		setFilteredProjects([...filteredList])
	}

	function handleProjectNameChange(e) {
		setFilterProjectName(e.target.value);
		// filterList()
	}

	function handleProjectStatusChange(e) {
		console.log('status change detected',e.target.value)
		setFilterProjectStatus(e.target.value);
		// filterList()
	}

	function handleToggleOwner(e) {
		console.log(e.target.checked);
		setFilterOwner(e.target.checked);
		// filterList()
	}

	console.log('project list, filtered',filteredProjects)
	return (
		<div className='container'>
			<div className='projectListHeader'>
				<select
					name='projectStatus'
					onChange={handleProjectStatusChange}>
					<option value='active'>Active</option>
					<option value='archived'>Archived</option>
				</select>
				<div className='field-h'>
					<label htmlFor='projectName'>Project Name</label>
					<input
						type='text'
						id='projectName'
						onChange={handleProjectNameChange}
						placeholder='search'
						value={filterProjectName}
					/>
				</div>
				<div>
					<label htmlFor='toggleOwner'>Show only my projects</label>
					<input
						type='checkbox'
						id='toggleOwner'
						onChange={handleToggleOwner}
					/>
				</div>
			</div>
			{filteredProjects.map((project) => (
				<ProjectListItem key={project.id} project={project} />
			))}
		</div>
	);
}
