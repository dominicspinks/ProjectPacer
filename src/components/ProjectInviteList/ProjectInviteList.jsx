import { useAuth } from '../../contexts/AuthProvider';
import ProjectInviteListItem from './ProjectInviteListItem';

export default function ProjectInvitesList({ reloadProjects }) {
    const { userProjectInvites } = useAuth();

    return (
        <div className='mt-10'>
            <h2 className='italic border-b-2 text-left pl-2 mb-2'>
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
                                reloadProjects={reloadProjects}
                            />
                        ))}
                    </tbody>
                </table>
            ) : (
                <p className='text-left p-2'>No pending invites</p>
            )}
        </div>
    );
}
