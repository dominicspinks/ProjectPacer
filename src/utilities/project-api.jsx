import { supabaseClient } from '../config/supabase-client';

export async function getProjects(user_id) {
	const { data, error } = await supabaseClient
		.from('project')
		.select(
			`id,name,description,is_archived,project_member!inner(user_id, role_type!inner(role_type))`
		)
		.eq('project_member.user_id', user_id);
	console.log('lookup data', data, error);
	return { projects: !data || error ? [] : data };
}
