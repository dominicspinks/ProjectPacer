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
	// Call a procedure in supabase that inserts the line into project and project_member tables (as the owner)
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

// Set a project status to 'archived'
export async function archiveProject(projectId) {
	const { data, error } = await supabaseClient
		.from('project')
		.update({ is_archived: true })
		.eq('id', projectId);
	console.log('archive project', data, error);
	return {
		data: !data || error ? { error: error } : { id: data[0].id },
	};
}

// Set a project status to 'active'
export async function unarchiveProject(projectId) {
	const { data, error } = await supabaseClient
		.from('project')
		.update({ is_archived: false })
		.eq('id', projectId);
	console.log('unarchive project', data, error);
	return {
		data: !data || error ? { error: error } : { id: data[0].id },
	};
}

// Delete a project
export async function deleteProject(projectId) {
	const { data, error } = await supabaseClient
		.from('project')
		.delete()
		.eq('id', projectId);
	console.log('delete project', data, error);
	return {
		data: !data || error ? { error: error } : { message: 'success' },
	};
}
