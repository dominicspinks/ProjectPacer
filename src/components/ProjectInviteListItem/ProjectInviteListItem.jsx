import { useState, useRef } from 'react';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import MenuButton from '../MenuButton/MenuButton';

export default function ProjectInviteListItem({ invite }) {
	console.log('invite list item', invite);
	const [loading, setLoading] = useState(true);

	const { user, getProjectInvites } = useAuth();

	const menuItemsRef = useRef([
		{
			name: 'Accept',
			onClick: () => {
				handleAcceptButton();
			},
		},
		{
			name: 'Decline',
			onClick: () => {
				handleDeclineButton();
			},
		},
	]);

	async function handleAcceptButton() {
		console.log('accept button');
		const { error: error_insert_member } =
			await ProjectAPI.insertProjectMember(
				invite.project.id,
				user.id,
				invite.role_type.id
			);
		console.log('error', error_insert_member);
		if (error_insert_member) {
			console.error(error_insert_member);
			return;
		}
		// Remove invite
		console.log('remove invite');
		const { error: error_remove_invite } =
			await ProjectAPI.removeProjectInvite(invite.id);
		if (error_remove_invite) {
			console.error(error_remove_invite);
			return;
		}
		getProjectInvites();
	}

	async function handleDeclineButton() {
		console.log('decline button');

		const { error } = await ProjectAPI.removeProjectInvite(invite.id);
		if (error) {
			console.error(error);
			return;
		}
		getProjectInvites();
	}

	return (
		<tr>
			<td>{invite.project.name}</td>
			<td className='capitalize'>{invite.role_type.role_type}</td>
			<td>{invite.profile.full_name}</td>
			<td>
				<MenuButton menuItems={menuItemsRef.current} />
			</td>
		</tr>
	);
}
