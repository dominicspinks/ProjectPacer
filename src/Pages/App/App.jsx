import { useCallback, useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import ChatContainer from '../../components/ChatContainer/ChatContainer';

// APIs
import * as ProjectAPI from '../../utilities/project-api';

// Pages
import AuthPage from '../AuthPage/AuthPage';
import NavBar from '../NavBar/NavBar';
import ProjectsPage from '../ProjectsPage/ProjectsPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import EditProfilePage from '../EditProfilePage/EditProfilePage';
import ProjectDetailsPage from '../ProjectDetailsPage/ProjectDetailsPage';
import TrackPage from '../TrackPage/TrackPage';

export default function App() {
    const { user } = useAuth();
    const [projectNames, setProjectNames] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Get the project names and IDs from the database that the current user belongs to
    const getProjectNames = useCallback(async () => {
        if (!user) return;

        setIsLoading(true);
        try {
            const { projectNames } = await ProjectAPI.getProjectNames(user.id);
            setProjectNames(projectNames);
            return projectNames;
        } catch (error) {
            console.error('Error fetching projects:', error);
            return [];
        } finally {
            setIsLoading(false);
        }
    }, [user]);

    // Update project Names after the user signs in
    useEffect(() => {
        if (!user) return;
        getProjectNames();
    }, [user, getProjectNames]);

    // Function to pass to components to regenerate the project list after a change
    function reloadProjects() {
        return getProjectNames();
    }

    return (
        <>
            {user && <NavBar setProjectNames={setProjectNames} />}
            <main className='flex flex-col items-center'>
                <Routes>
                    <Route
                        path='/'
                        element={<Navigate to='/projects' replace />}
                    />
                    <Route
                        path='/projects/:projectId'
                        element={
                            <ProtectedRoute>
                                <ProjectDetailsPage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/projects'
                        element={
                            <ProtectedRoute>
                                <ProjectsPage
                                    projectNames={projectNames}
                                    reloadProjects={reloadProjects}
                                />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/track'
                        element={
                            <ProtectedRoute>
                                <TrackPage projectNames={projectNames} />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/profile/edit'
                        element={
                            <ProtectedRoute>
                                <EditProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path='/profile'
                        element={
                            <ProtectedRoute>
                                <ProfilePage reloadProjects={reloadProjects} />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='/auth' element={<AuthPage />} />
                </Routes>
            </main>
            {user && projectNames && (
                <ChatContainer projectNames={projectNames} />
            )}
        </>
    );
}
