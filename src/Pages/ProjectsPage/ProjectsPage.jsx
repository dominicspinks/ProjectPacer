import { useEffect, useState } from 'react';

export default function ProjectsPage({ projects }) {
	console.log(projects);
	return (
		<>
			<h1>My Projects</h1>
			{projects.map((project) => (
				<div key={project.id}>{project.name}</div>
			))}
		</>
	);
}
