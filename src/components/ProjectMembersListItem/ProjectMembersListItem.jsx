import { useState, useRef } from 'react';

// Components
import MenuButton from '../MenuButton/MenuButton';

export default function ProjectMembersListItem({
	member,
	projectRole,
	handleRemoveMember,
	handleRemoveInvite = () => {},
	isInvited = false,
}) {
	console.log('member list item', member);
	const [loading, setLoading] = useState(true);

	const menuItemsRef = useRef([]);

	// menuList remove button
	if (
		loading &&
		['owner', 'manager'].includes(projectRole) &&
		member.role_type.role_type !== 'owner'
	) {
		menuItemsRef.current.push({
			name: 'Remove',
			onClick: () => {
				handleRemoveButton();
			},
		});
	}

	if (loading) setLoading(false);

	function handleRemoveButton() {
		if (!isInvited) handleRemoveMember(member.user_id);

		if (isInvited) handleRemoveInvite(member.id);
	}

	return (
		<tr>
			<td className={`${isInvited ? 'italic' : ''}`}>
				{!isInvited ? member.profile.full_name : member.email}
			</td>
			<td className='capitalize'>
				{member.role_type.role_type}
				{isInvited && <span className='italic'> [invited]</span>}
			</td>
			<td>
				<MenuButton menuItems={menuItemsRef.current} />
			</td>
		</tr>
	);
}
