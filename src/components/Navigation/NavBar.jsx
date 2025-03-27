import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';
import { useState } from 'react';

export default function NavBar({ setProjectNames }) {
    const { signOut } = useAuth();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    function handleLogout() {
        signOut();
        setProjectNames([]);
    }

    function toggleMenu() {
        setIsMenuOpen(!isMenuOpen)
    }

    return (
        <nav className='bg-gray-900 border-gray-700'>
            <div className='max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-2'>
                {/* Logo and brand section */}
                <div className='flex items-center'>
                    <img
                        alt='image'
                        src='/pp-logo-light.svg'
                        className='w-6 m-2'
                    />
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={toggleMenu}
                    type="button"
                    className="inline-flex items-center p-2 ml-3 text-sm text-gray-400 rounded-lg md:hidden hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
                >
                    <span className="sr-only">Open main menu</span>
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        {isMenuOpen ? (
                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path>
                        ) : (
                            <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd"></path>
                        )}
                    </svg>
                </button>

                {/* Navigation links */}
                <div className={`${isMenuOpen ? 'block' : 'hidden'} w-full md:block md:w-auto`}>
                    <ul className="flex flex-col mt-4 md:flex-row md:space-x-4 md:mt-0 md:border-0">
                        <li>
                            <NavLink
                                to='/projects'
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded ${isActive ? 'text-blue-500' : 'text-white'} hover:bg-slate-800`
                                }>
                                Projects
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to='/track'
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded ${isActive ? 'text-blue-500' : 'text-white'} hover:bg-slate-800`
                                }>
                                Time Tracker
                            </NavLink>
                        </li>
                        <li>
                            <NavLink
                                to='/profile'
                                onClick={() => setIsMenuOpen(false)}
                                className={({ isActive }) =>
                                    `block py-2 px-3 rounded ${isActive ? 'text-blue-500' : 'text-white'} hover:bg-slate-800`
                                }>
                                Profile
                            </NavLink>
                        </li>
                        <li>
                            <button
                                onClick={() => {
                                    handleLogout();
                                    setIsMenuOpen(false);
                                }}
                                className='w-full text-left block py-2 px-3 text-white rounded hover:bg-slate-800'>
                                Logout
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}
