import { useEffect, useState } from 'react';

// Components
import ProjectList from '../../components/ProjectList/ProjectList';

export default function ProjectsPage({ projects }) {
	console.log(projects);
	return (
		<>
			<h1>My Projects</h1>
			<ProjectList projects={projects} />
		</>
	);
}
