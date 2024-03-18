import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProjectList from '../../components/ProjectList/ProjectList';

// APIs
import * as ProjectAPI from '../../utilities/project-api';

export default function ProjectsPage() {
	const [ projects, setProjects] = useState([])
	
	const { user } = useAuth();

	useEffect(() => {
		if (!user) return;
		getProjectDetails();
	}, [user]);
	
	async function getProjectDetails() {
		console.log('user', user, user.id);
		const { projects } = await ProjectAPI.getProjectDetails(user.id);
		setProjects(projects);
	}
	
	console.log('projects page, projects',projects);

	return (
		<>
			<h1>My Projects</h1>
			<ProjectList projects={projects} />
		</>
	);
}
