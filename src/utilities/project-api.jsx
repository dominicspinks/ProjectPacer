import { supabaseClient } from '../config/supabase-client';

// Get full details from the database for all projects that the user owns
export async function getProjectDetails(projectIdList) {
	if (projectIdList.length === 0) return [];

	const { data, error } = await supabaseClient
		.from('project')
		.select(
			`id,name,description,is_archived,project_member!inner(user_id, role_type!inner(role_type, priority), profile!inner(full_name))`
		)
		.in('project_member.project_id', projectIdList);
	console.log('lookup data', data, error);
	return { projects: !data || error ? [] : data };
}

// Get the project names and IDs from the database that the current user owns
export async function getProjectNames(user_id) {
	if (!user_id) return [];

	const { data, error } = await supabaseClient
		.from('project')
		.select(`id,name,project_member!inner(user_id)`)
		.eq('project_member.user_id', user_id);
	console.log('lookup data', data, error);
	return { projectNames: !data || error ? [] : data };
}

// Add new project to database
export async function addProject(userId, projectName, projectDescription) {
	const { data, error } = await supabaseClient.rpc('add_new_project', {
		name: projectName,
		description: projectDescription,
		user_id: userId,
	});

	console.log('add project', data, error);
	return {
		data: !data || error ? { error: error } : { id: data[0].id },
	};
}
