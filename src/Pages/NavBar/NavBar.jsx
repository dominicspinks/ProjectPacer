import { NavLink } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthProvider';

export default function NavBar({ supabase }) {
	const { user } = useAuth();
	const { signOut } = useAuth();

	function handleLogout() {
		signOut();
	}

	return (
		<nav>
			{!user ? (
				<NavLink to='/auth'>Login</NavLink>
			) : (
				<>
					<NavLink to='/projects'>Projects</NavLink>
					<NavLink to='/profile'>Profile</NavLink>
					<button onClick={handleLogout}>Logout</button>
				</>
			)}
		</nav>
	);
}
