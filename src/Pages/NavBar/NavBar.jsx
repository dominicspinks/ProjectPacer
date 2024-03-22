import { NavLink } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthProvider';

export default function NavBar({ setProjectNames }) {
	const { user, signOut } = useAuth();

	function handleLogout() {
		signOut();

		// Clear existing project names
		setProjectNames([]);
	}

	return (
		<nav className='bg-gray-900 border-gray-700'>
			<div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2'>
				<div className='flex items-center space-x-4'>
					<NavLink
						to='/projects'
						className='h-full hover:bg-slate-800 text-align-center px-3 py-2 rounded active:text-blue-500'>
						Projects
					</NavLink>
				</div>
				<div className='flex items-center space-x-4 h-10'>
					<NavLink
						to='/profile'
						className='h-full hover:bg-slate-800 text-align-center px-3 py-2 rounded'>
						Profile
					</NavLink>
					<button
						onClick={handleLogout}
						className='h-full hover:bg-slate-800 text-align-center px-3 py-2 rounded'>
						Logout
					</button>
				</div>
			</div>
		</nav>
	);
}
