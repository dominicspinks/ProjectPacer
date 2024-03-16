export default function ProjectDetailsPage({ project }) {
	return (
		<>
			<h1>{project.name}</h1>
			<p>{project.description}</p>
		</>
	);
}
