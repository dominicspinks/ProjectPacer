import { supabaseClient } from '../config/supabase-client';

// Get existing messages for a user for initialisation
export async function getMessages(projects) {
	if (projects.length === 0) return { error: 'invalid input' };

	const { data, error } = await supabaseClient
		.from('message')
		.select('content, created_at, id, project_id, user_id')
		.in(
			'project_id',
			projects.map((project) => project.id)
		)
		.order('created_at', { ascending: false });

	if (error) {
		console.error(error);
		return { error: error };
	}
	return { data };
}

// Insert new message
export async function sendMessage(userId, projectId, content) {
	const { data, error } = await supabaseClient
		.from('message')
		.insert({ user_id: userId, project_id: projectId, content: content });

	if (error) {
		console.error(error);
		return { error: error };
	}
	return { data };
}
