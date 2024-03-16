import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

export default function ProfilePage() {
	const { user, userDetails } = useAuth();
	console.log('user', user, userDetails);
	return (
		<>
			<div className='container'>
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
			</div>
			<Link to='/profile/edit'>Edit Profile</Link>
		</>
	);
}
