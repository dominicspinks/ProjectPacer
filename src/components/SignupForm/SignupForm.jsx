import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthProvider';

// API
import * as UserAPI from '../../utilities/user-api';

// Icons
import {
	EnvelopeIcon,
	UserIcon,
	EyeSlashIcon,
	EyeIcon,
	KeyIcon,
} from '@heroicons/react/24/solid';

export default function SignupForm({ setSignup }) {
	const { signUp } = useAuth();

	const [showPassword, setShowPassword] = useState(false);
	const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

	const [fieldName, setFieldName] = useState('');
	const [fieldEmail, setFieldEmail] = useState('');
	const [fieldPassword, setFieldPassword] = useState('');
	const [fieldPasswordConfirm, setFieldPasswordConfirm] = useState('');
	const [passwordsMatch, setPasswordsMatch] = useState(true);

	const navigateTo = useNavigate();
	function handleSwitchAuth(e) {
		e.preventDefault();
		setSignup(false);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		if (fieldPassword !== fieldPasswordConfirm) {
			setPasswordsMatch(false);
			return;
		}
		setPasswordsMatch(true);
		console.log(fieldEmail, fieldPassword, fieldName);
		const { data: data_signup, error: error_signup } = await signUp({
			email: fieldEmail,
			password: fieldPassword,
		});

		if (error_signup) {
			console.error(error_signup);
			alert('error signing up');
			return;
		}

		// Add additional user details to db
		const { error: error_update } = await UserAPI.updateUserDetails({
			user_id: data_signup.user.id,
			full_name: fieldName,
			email: fieldEmail,
		});

		if (error_update) {
			console.error(error_update);
			alert(
				'An error occurred while saving your details. Please complete your profile manually'
			);
			navigateTo('/profile/edit');
			return;
		}

		// Redirect to home
		navigateTo('/');
	}

	function handleNameChange(e) {
		setFieldName(e.target.value);
	}

	function handleEmailChange(e) {
		setFieldEmail(e.target.value);
	}

	function handlePasswordChange(e) {
		setFieldPassword(e.target.value);
		setPasswordsMatch(true);
	}

	function handleConfirmFieldChange(e) {
		setFieldPasswordConfirm(e.target.value);
		setPasswordsMatch(true);
	}

	return (
		<>
			<h2 className='text-2xl'>Sign Up</h2>
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
					<UserIcon className='input- w-6 h-6' />
					<input
						id='fullName'
						name='fullName'
						type='text'
						placeholder='Enter your full name'
						value={fieldName}
						onChange={handleNameChange}
						required
						className='input w-full'
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
				<div className='flex gap-2 flex-start items-center'>
					<KeyIcon className='w-6 h-6' />
					<input
						type={`${showPasswordConfirm ? 'text' : 'password'}`}
						placeholder='Repeat password'
						value={fieldPasswordConfirm}
						onChange={handleConfirmFieldChange}
						required
						className='w-full'
					/>
					{showPasswordConfirm ? (
						<EyeIcon
							className='w-6 h-6 m-1 cursor-pointer'
							onClick={() =>
								setShowPasswordConfirm(!showPasswordConfirm)
							}
						/>
					) : (
						<EyeSlashIcon
							className='w-6 h-6 m-1 cursor-pointer'
							onClick={() =>
								setShowPasswordConfirm(!showPasswordConfirm)
							}
						/>
					)}
				</div>
				<p>{passwordsMatch ? '' : 'Passwords do not match'}</p>
				<button
					type='submit'
					className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full'
					disabled={!passwordsMatch}>
					Sign Up
				</button>
			</form>
			<a
				onClick={handleSwitchAuth}
				className='hover:cursor-pointer hover:underline'>
				Already have an account?{' '}
				<span className='underline'>Sign in</span>
			</a>
		</>
	);
}
