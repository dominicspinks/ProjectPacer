import ProjectListItem from '../ProjectListItem/ProjectListItem';
import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthProvider';

import './ProjectList.css';

export default function ProjectList({ projects, reloadProjects }) {
	const [filterProjectStatus, setFilterProjectStatus] = useState('active');
	const [filterOwner, setFilterOwner] = useState(false);
	const [filterProjectName, setFilterProjectName] = useState('');
	const [filteredProjects, setFilteredProjects] = useState([...projects]);
	console.log('projectlist page - projects', projects);
	const { user } = useAuth();

	useEffect(() => {
		// This will update the filtered list and reapply the filters if the 'projects' state or any filters are updated
		filterList();
	}, [projects, filterProjectName, filterProjectStatus, filterOwner]);

	function filterList() {
		// Filter the list of projects based on the selected search filters
		const filteredList = [];

		for (let i = 0; i < projects.length; i++) {
			const project = projects[i];

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

			if (project.is_archived !== (filterProjectStatus === 'archived'))
				continue;

			if (
				filterProjectName.length > 0 &&
				!project.name
					.toLowerCase()
					.startsWith(filterProjectName.toLowerCase())
			)
				continue;

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
		<div className='container'>
			<div className='projectListFilter'>
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
						<th></th>
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
	);
}
