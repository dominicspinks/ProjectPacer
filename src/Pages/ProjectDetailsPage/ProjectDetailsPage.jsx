import { useParams } from 'react-router-dom';

export default function ProjectDetailsPage() {
	const { id } = useParams();
	console.log('id', id);
	return (
		<>
			<h1>Project Name here</h1>
			<p>project description here</p>
		</>
	);
}
