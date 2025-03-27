import { useRef } from 'react';
import { useAuth } from '../../contexts/AuthProvider';
import * as ProjectAPI from '../../utilities/project-api';
import MenuButton from '../Buttons/MenuButton';

export default function ProjectInviteListItem({ invite, reloadProjects }) {
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
        // Add user to project
        const { error: error_insert_member } =
            await ProjectAPI.insertProjectMember(
                invite.project.id,
                user.id,
                invite.role_type.id
            );

        if (error_insert_member) {
            console.error(error_insert_member);
            return;
        }

        // Remove invite
        const { error: error_remove_invite } =
            await ProjectAPI.removeProjectInvite(invite.id);

        if (error_remove_invite) {
            console.error(error_remove_invite);
            return;
        }

        getProjectInvites(); // Refresh list of user's invites
        reloadProjects(); // Refresh list of user's projects
    }

    async function handleDeclineButton() {
        const { error } = await ProjectAPI.removeProjectInvite(invite.id);
        if (error) {
            console.error(error);
            return;
        }
        getProjectInvites(); // Refresh list of user's invites
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
