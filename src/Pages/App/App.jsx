import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';

// APIs
import * as ProjectAPI from '../../utilities/project-api';

// Pages
import AuthPage from '../AuthPage/AuthPage';
import NavBar from '../NavBar/NavBar';
import ProjectsPage from '../ProjectsPage/ProjectsPage';
import ProfilePage from '../ProfilePage/ProfilePage';
import EditProfilePage from '../EditProfilePage/EditProfilePage';

// Styles
import './App.css';

function App() {
    const [projectNames, setProjectNames] = useState([]);

    const { user } = useAuth();

    // temporary
    useEffect(() => {
        if (!user) return;
        getProjectNames();
    }, [user]);

    async function getProjectNames() {
        console.log('user', user, user.id);
        const { projectNames } = await ProjectAPI.getProjectNames(user.id);
        setProjectNames(projectNames);
    }

    return (
        <>
            <NavBar />
            <main>
                <Routes>
                    <Route
                        path='/'
                        element={<Navigate to='/projects' replace />}
                    />
                    <Route
                        path='/projects'
                        element={
                            <ProtectedRoute>
                                <ProjectsPage projectNames={projectNames} />
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
                                <ProfilePage />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='/auth' element={<AuthPage />} />
                </Routes>
            </main>
        </>
    );
}

export default App;
