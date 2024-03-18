import { supabaseClient } from '../config/supabase-client';
import { useAuth } from '../contexts/AuthProvider';

export async function getUserDetails(userId) {
	const { data } = await supabaseClient
		.from('profile')
		.select('department, full_name')
		.eq('user_id', userId)
		.limit(1);
	return !data ? {} : { ...data[0] };
}

export async function updateUserDetails(userId, data) {
	const { updateUserData } = useAuth();

	const user_data = {
		user_id: userId,
		full_name: data.fullName,
	};
	const profile_data = {
		user_id: userId,
		department: data.department,
	};

	const { error_user } = await updateUserData(user_data);
	const { error_profile } = await supabaseClient
		.from('profile')
		.upsert(profile_data)
		.select();
	return { error };
}
