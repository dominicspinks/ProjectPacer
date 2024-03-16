import { useEffect, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

// Components
import ProtectedRoute from '../../components/ProtectedRoute/ProtectedRoute';
import CompletedProfile from '../../components/CompleteProfile/CompleteProfile';

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
	const [projects, setProjects] = useState([]);

	const { user } = useAuth();

	// temporary
	useEffect(() => {
		getProjects();
	}, []);

	async function getProjects() {
		console.log('user', user, user.id);
		const { projects } = await ProjectAPI.getProjects(user.id);
		setProjects(projects);
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
								<CompletedProfile>
									<ProjectsPage projects={projects} />
								</CompletedProfile>
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
								<CompletedProfile>
									<ProfilePage />
								</CompletedProfile>
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
