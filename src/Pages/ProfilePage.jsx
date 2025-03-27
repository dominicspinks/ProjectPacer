import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

// API
import * as ProfileAPI from '../utilities/profile-api';

// Contexts
import { useAuth } from '../contexts/AuthProvider';

// Components
import ProjectInviteList from '../components/ProjectInviteList/ProjectInviteList';
import TaskList from '../components/TaskList/TaskList';

export default function ProfilePage({ reloadProjects }) {
    const { user, userDetails, getProjectInvites } = useAuth();

    const [tasks, setTasks] = useState([]);

    // get project invites and tasks for the user
    useEffect(() => {
        if (!user) return;
        getProjectInvites();
        loadTasks();
    }, [user]);

    async function loadTasks() {
        try {
            const data = await ProfileAPI.getUserDefaultTasks(user.id);
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        }
    }

    async function handleSaveTask(task) {
        try {
            if (task.id) {
                await ProfileAPI.updateUserDefaultTask(task);
            } else {
                await ProfileAPI.addUserDefaultTask(task);
            }
            loadTasks();
        } catch (error) {
            console.error('Error saving task:', error);
        }
    }

    async function handleDeleteTask(id) {
        try {
            await ProfileAPI.deleteUserDefaultTask(id);
            loadTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }

    return (
        <div className='block p-4 m-2 rounded-lg shadow bg-gray-900 w-[95%] md:max-w-xl'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6'>
                <h5 className='text-2xl font-bold tracking-tight mb-3 sm:mb-0'>
                    My Profile
                </h5>
                <Link
                    to='/profile/edit'
                    className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center'>
                    Edit Details
                </Link>
            </div>

            <div className='mb-6'>
                <div className='flex flex-col space-y-3'>
                    <div className='flex flex-col sm:flex-row sm:items-center'>
                        <div className='font-bold text-left w-full sm:w-24 mb-1 sm:mb-0'>Name:</div>
                        <div className='value break-words'>
                            {userDetails?.full_name ||
                                userDetails?.full_name === ''
                                ? userDetails.full_name
                                : '--'}
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:items-center'>
                        <div className='font-bold text-left w-full sm:w-24 mb-1 sm:mb-0'>Email:</div>
                        <div className='value break-words'>
                            {!user ? '--' : user.user_metadata.email}
                        </div>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:items-center'>
                        <div className='font-bold text-left w-full sm:w-24 mb-1 sm:mb-0'>
                            Department:
                        </div>
                        <div className='value break-words'>
                            {userDetails?.department ||
                                userDetails?.department === ''
                                ? userDetails.department
                                : '--'}
                        </div>
                    </div>
                </div>
            </div>

            <ProjectInviteList reloadProjects={reloadProjects} />
            <TaskList
                tasks={tasks}
                handleDeleteTask={handleDeleteTask}
                handleSaveTask={handleSaveTask}
            />
        </div>
    );
}
