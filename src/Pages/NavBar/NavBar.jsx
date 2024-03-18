import { NavLink } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthProvider';

export default function NavBar({ supabase }) {
	const { user } = useAuth();
	const { signOut } = useAuth();

	function handleLogout() {
		signOut();
	}

	return (
		<nav className='bg-white border-gray-200 dark:bg-slate-900 dark:border-gray-700'>
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4'>
				{!user ? (
					<NavLink to='/auth'>Login</NavLink>
				) : (
					<>
						<div className='flex items-center space-x-4'>
							<NavLink to='/projects'>Projects</NavLink>
						</div>
						<div className='flex items-center space-x-4'>
							<NavLink to='/profile'>Profile</NavLink>
							<button onClick={handleLogout}>Logout</button>
						</div>
					</>
				)}
			</div>
		</nav>
	);
}
