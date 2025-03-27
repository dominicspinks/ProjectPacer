import { useMemo } from 'react';

// Components
import MenuButton from '../Buttons/MenuButton';

export default function ProjectMembersListItem({
    member,
    projectRole,
    handleRemoveMember,
    handleRemoveInvite = () => { },
    isInvited = false,
}) {
    const menuItems = useMemo(() => {
        const items = [];

        // Only add Remove option if user has right permissions and target is not an owner
        if (
            ['owner', 'manager'].includes(projectRole) &&
            member.role_type.role_type !== 'owner'
        ) {
            items.push({
                name: 'Remove',
                onClick: handleRemoveButton,
            });
        }

        return items;
    }, [projectRole, member.role_type.role_type]);

    // Handle remove action based on member type (invited or active)
    function handleRemoveButton() {
        if (!isInvited) {
            handleRemoveMember(member.user_id);
        } else {
            handleRemoveInvite(member.id);
        }
    }

    return (
        <tr className="text-sm md:text-base">
            <td className={`${isInvited ? 'italic' : ''}`}>
                {!isInvited ? member.profile.full_name : member.email}
            </td>
            <td className='capitalize'>
                {member.role_type.role_type}
                {isInvited && <span className='italic'> [invited]</span>}
            </td>
            <td className="px-1 py-2 text-center w-[10%]">
                {menuItems.length > 0 && (
                    <MenuButton menuItems={menuItems} />
                )}
            </td>
        </tr>
    );
}
