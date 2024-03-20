// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProjectInviteListItem from '../ProjectInviteListItem/ProjectInviteListItem';

export default function ProjectInvitesList() {
	const { user, userDetails, userProjectInvites, getProjectInvites } =
		useAuth();

	console.log('invites list', userProjectInvites);

	return (
		<>
			<h2 className='font-bold m-2 border-b-2 text-left pl-2'>
				Project Invites
			</h2>
			{userProjectInvites.length > 0 ? (
				<table>
					<thead>
						<tr>
							<th>Project Name</th>
							<th>Role</th>
							<th>Invited By</th>
							<th></th>
						</tr>
					</thead>
					<tbody>
						{userProjectInvites.map((invite) => (
							<ProjectInviteListItem
								key={invite.id}
								invite={invite}
							/>
						))}
					</tbody>
				</table>
			) : (
				<p className='text-left p-2'>No pending invites</p>
			)}
		</>
	);
}
