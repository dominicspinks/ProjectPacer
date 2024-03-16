import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { supabaseClient } from '../../config/supabase-client';

// APIs
import * as userAPI from '../../utilities/user-api';

export default function EditProfilePage() {
	const { user, userDetails, updateUserData } = useAuth();
	const [formData, setFormData] = useState({
		fullName: user.user_metadata.full_name,
		department:
			!userDetails || userDetails.department === null
				? ''
				: userDetails.department,
		email: user.user_metadata.email,
	});

	const navigateTo = useNavigate();

	function handleChange(e) {
		const { name, value } = e.target;
		setFormData({ ...formData, [name]: value });
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const user_data = {
			user_id: user.id,
			full_name: formData.fullName,
		};
		const profile_data = {
			department: formData.department,
		};

		const { error: error_user } = await updateUserData(user_data);
		const { error: error_profile } = await supabaseClient
			.from('profile')
			.update(profile_data)
			.eq('user_id', user.id);
		console.log(error_profile, error_user);
		if (!error_user && !error_profile) {
			navigateTo('/profile');
		}
	}

	return (
		<>
			<div className='container'>
				<form>
					<div className='field'>
						<label htmlFor='fullName' className='label'>
							Full Name:
						</label>
						<input
							className='input input-text'
							type='text'
							id='fullName'
							name='fullName'
							required
							value={formData.fullName}
							onChange={handleChange}
						/>
					</div>
					<div className='field'>
						<label htmlFor='email' className='label'>
							Email:
						</label>
						<input
							className='input input-email'
							type='email'
							id='email'
							name='email'
							required
							value={formData.email}
							onChange={handleChange}
							disabled
						/>
					</div>
					<div className='field'>
						<span>
							<label htmlFor='department' className='label'>
								Department:
							</label>
							<input
								className='input input-text'
								type='text'
								id='department'
								name='department'
								required
								value={formData.department}
								onChange={handleChange}
							/>
						</span>
					</div>

					<Link to='/profile'>
						<button className='button button-primary'>
							Cancel
						</button>
					</Link>

					<button
						className='button button-primary'
						onClick={handleSubmit}>
						Submit
					</button>
				</form>
			</div>
		</>
	);
}
