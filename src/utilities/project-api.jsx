import { supabaseClient } from '../config/supabase-client';

export async function getProjectDetails(user_id) {
	if (!user_id) return [];
	const { data, error } = await supabaseClient
		.from('project')
		.select(
			`id,name,description,is_archived,project_member!inner(user_id, role_type!inner(role_type), profile!inner(full_name))`
		)
		.eq('project_member.user_id', user_id);
	console.log('lookup data', data, error);
	return { projects: !data || error ? [] : data };
}

export async function getProjectNames(user_id) {
	if (!user_id) return [];
	const { data, error } = await supabaseClient
		.from('project')
		.select(
			`id,name`
		)
		.eq('project_member.user_id', user_id)
		.eq('is_archived', false);
	console.log('lookup data', data, error);
	return { projectNames: !data || error ? [] : data };
}
