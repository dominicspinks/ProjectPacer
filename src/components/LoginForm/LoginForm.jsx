import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Contexts
import { useAuth } from '../../contexts/AuthProvider';

// Icons
import {
	EnvelopeIcon,
	EyeSlashIcon,
	EyeIcon,
	KeyIcon,
} from '@heroicons/react/24/solid';

export default function LoginForm({ setSignup }) {
	const { signIn } = useAuth();
	const navigateTo = useNavigate();

	const [fieldEmail, setFieldEmail] = useState('');
	const [fieldPassword, setFieldPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);

	function handleSwitchAuth(e) {
		setSignup(true);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const { error } = await signIn({
			email: fieldEmail,
			password: fieldPassword,
		});

		if (error) console.error(error);
		if (error) {
			alert('error signing in');
		} else {
			// Redirect user to Dashboard
			navigateTo('/');
		}
	}

	function handleEmailChange(e) {
		setFieldEmail(e.target.value);
	}

	function handlePasswordChange(e) {
		setFieldPassword(e.target.value);
	}

	return (
		<>
			<h2 className='text-2xl'>Sign In</h2>
			<form onSubmit={handleSubmit} className='flex flex-col gap-2'>
				<div className='flex gap-2 flex-start items-center'>
					<EnvelopeIcon className='w-6 h-6' />
					<input
						id='email'
						name='email'
						type='email'
						placeholder='Your email address'
						value={fieldEmail}
						onChange={handleEmailChange}
						required
						className='w-full'
					/>
				</div>
				<div className='flex gap-2 flex-start items-center'>
					<KeyIcon className='w-6 h-6' />
					<input
						type={`${showPassword ? 'text' : 'password'}`}
						placeholder='Your password'
						value={fieldPassword}
						onChange={handlePasswordChange}
						required
						className='w-full'
					/>
					{showPassword ? (
						<EyeIcon
							className='w-6 h-6 m-1 cursor-pointer'
							onClick={() => setShowPassword(!showPassword)}
						/>
					) : (
						<EyeSlashIcon
							className='w-6 h-6 m-1 cursor-pointer'
							onClick={() => setShowPassword(!showPassword)}
						/>
					)}
				</div>
				<button
					type='submit'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'>
					Sign In
				</button>
			</form>
			<div
				onClick={handleSwitchAuth}
				className='hover:cursor-pointer hover:underline'>
				Don't have an account?{' '}
				<span className='underline'>Sign up</span>
			</div>
		</>
	);
}
