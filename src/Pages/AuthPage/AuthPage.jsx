import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Components
import LoginForm from '../../components/LoginForm/LoginForm';
import SignupForm from '../../components/SignupForm/SignupForm';

export default function AuthPage() {
	const { user } = useAuth();
	const navigateTo = useNavigate();
	const [signup, setSignup] = useState(false);

	// If the user is already logged in, redirect to home
	useEffect(() => {
		if (user) {
			navigateTo('/');
		}
	}, []);

	return (
		<>
			<img alt='image' src='/pp-logo-light.svg' className='w-16 m-10' />
			<h1 className='text-4xl mb-10'>ProjectPacer</h1>
			<div className='bg-black p-10 border-none rounded-lg shadow-2xl flex flex-col items-center gap-6'>
				{signup ? (
					<SignupForm setSignup={setSignup} />
				) : (
					<LoginForm setSignup={setSignup} />
				)}
			</div>
		</>
	);
}
