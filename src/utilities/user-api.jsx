import { supabaseClient } from '../config/supabase-client';

export async function getUserDetails(userId) {
	const { data } = await supabaseClient
		.from('profile')
		.select('department, full_name')
		.eq('user_id', userId)
		.limit(1);
	return !data ? {} : { ...data[0] };
}

export async function updateUserDetails(data) {
	console.log('updateUserDetails', data);
	if (
		!data ||
		data?.userId === '' ||
		data?.email === '' ||
		data?.full_name === ''
	)
		return { error: 'invalid data' };

	// Clean input
	const profile_data = {
		user_id: data.user_id,
		full_name: data.full_name,
		department: data.department,
		email: data.email,
	};
	console.log('profile_data', profile_data);
	const { error } = await supabaseClient
		.from('profile')
		.upsert(profile_data)
		.select();
	return { error };
}
