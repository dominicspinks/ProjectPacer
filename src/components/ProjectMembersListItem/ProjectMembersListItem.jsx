import { useState, useRef } from 'react';

// API
import * as ProjectAPI from '../../utilities/project-api';

// Components
import MenuButton from '../MenuButton/MenuButton';

export default function ProjectMembersListItem({
	member,
	projectRole,
	handleRemoveMember,
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
		handleRemoveMember(member.user_id);
	}

	return (
		<tr className='capitalize'>
			<td>{member.profile.full_name}</td>
			<td>{member.role_type.role_type}</td>
			<td>
				<MenuButton menuItems={menuItemsRef.current} />
			</td>
		</tr>
	);
}
