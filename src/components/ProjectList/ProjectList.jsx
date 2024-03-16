import ProjectListItem from '../ProjectListItem/ProjectListItem';
import { useState } from 'react';

import './ProjectList.css';

export default function ProjectList({ projects }) {
	const [filterProjectStatus, setFilterProjectStatus] = useState('active');
	const [filterOwner, setFilterOwner] = useState(false);
	const [filterProjectName, setFilterProjectName] = useState('');

	const [filteredProjects, setFilteredProjects] = useState([...projects]);

	function handleProjectNameChange(e) {
		setFilterProjectName(e.target.value);
	}

	function handleProjectStatusChange(e) {
		setFilterProjectStatus(e.target.value);
	}

	function handleToggleOwner(e) {
		console.log(e.target.checked);
		setFilterOwner(e.target.checked);
	}

	return (
		<div className='container'>
			<div className='projectListHeader'>
				<select
					name='projectStatus'
					onChange={handleProjectStatusChange}>
					<option value='active'>Active</option>
					<option value='active'>Archived</option>
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
