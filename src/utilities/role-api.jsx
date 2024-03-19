import { supabaseClient } from '../config/supabase-client';

// Get list of available roles
export async function getRoles() {
	const { data, error } = await supabaseClient
		.from('role_type')
		.select('id, role_type');
	if (error) {
		console.error(error);
		return { error: error };
	}
	return { roles: data };
}
