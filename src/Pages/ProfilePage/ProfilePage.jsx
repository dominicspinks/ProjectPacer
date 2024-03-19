import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProjectInviteList from '../../components/ProjectInviteList/ProjectInviteList';

export default function ProfilePage() {
	const { user, userDetails, userProjectInvites, getProjectInvites } =
		useAuth();

	useEffect(() => {
		if (!user) return;
		getProjectInvites();
	}, [user]);

	console.log('invites', userProjectInvites);
	return (
		<>
			<div className='container'>
				<div>
					<div className='field'>
						<div className='label'>Name:</div>
						<div className='value'>
							{!user ? '' : userDetails.full_name}
						</div>
					</div>
					<div className='field'>
						<div className='label'>Email:</div>
						<div className='value'>
							{!user ? '' : user.user_metadata.email}
						</div>
					</div>
					<div className='field'>
						<div className='label'>Department:</div>
						<div className='value'>
							{!userDetails ? '' : userDetails.department}
						</div>
					</div>
					<Link to='/profile/edit'>Edit Details</Link>
				</div>
				<div id='inviteList'>
					<ProjectInviteList />
				</div>
			</div>
		</>
	);
}
