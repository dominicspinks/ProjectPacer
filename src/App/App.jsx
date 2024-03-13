import { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';

// Styles
import './App.css';

console.log(import.meta.env.VITE_SUPABASE_URL);
const supabase = createClient(
	import.meta.env.VITE_SUPABASE_URL,
	import.meta.env.VITE_SUPABASE_ANON
);

function App() {
	const [projects, setProjects] = useState([]);

	useEffect(() => {
		getProjects();
	}, []);

	async function getProjects() {
		const { data } = await supabase.from('project').select();
		setProjects(data);
		console.log(data);
	}

	return (
		<>
			<h1>Project Tracker</h1>
			{projects.map((project) => (
				<div key={project.id}>{project.name}</div>
			))}
		</>
	);
}

export default App;
