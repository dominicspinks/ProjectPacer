import { useEffect } from 'react';
import { Link } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProjectInviteList from '../../components/ProjectInviteList/ProjectInviteList';
import UserDefaultTaskList from '../../components/UserDefaultTaskList/UserDefaultTaskList';

export default function ProfilePage({ reloadProjects }) {
    const { user, userDetails, getProjectInvites } = useAuth();

    // get project invites for the user
    useEffect(() => {
        if (!user) return;
        getProjectInvites();
    }, [user]);

    return (
        <div className='block p-6 border rounded-lg shadow bg-gray-800 border-gray-700 w-full'>
            <h5 className='mb-2 text-2xl font-bold tracking-tight mb-4'>
                My Profile
            </h5>
            <div className='flex justify-between'>
                <div>
                    <div className='flex gap-4 flex-start'>
                        <div className='w-24 font-bold text-left'>Name:</div>
                        <div className='value'>
                            {userDetails?.full_name ||
                            userDetails?.full_name === ''
                                ? userDetails.full_name
                                : '--'}
                        </div>
                    </div>
                    <div className='flex gap-4 flex-start'>
                        <div className='w-24 font-bold text-left'>Email:</div>
                        <div className='value'>
                            {!user ? '--' : user.user_metadata.email}
                        </div>
                    </div>
                    <div className='flex gap-4 flex-start'>
                        <div className='w-24 font-bold text-left'>
                            Department:
                        </div>
                        <div className='value'>
                            {userDetails?.department ||
                            userDetails?.department === ''
                                ? userDetails.department
                                : '--'}
                        </div>
                    </div>
                </div>
                <Link
                    to='/profile/edit'
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded h-10'>
                    Edit Details
                </Link>
            </div>
            <ProjectInviteList reloadProjects={reloadProjects} />
            <UserDefaultTaskList />
        </div>
    );
}
