import { supabaseClient } from '../config/supabase-client';

export async function getUserDetails(userId) {
	const { data } = await supabaseClient
		.from('user_details')
		.select('first_name, last_name, department, title')
		.eq('user_id', userId)
		.limit(1);
	console.log('user api', data[0]);
	return { userData: !data ? {} : data[0] };
}
