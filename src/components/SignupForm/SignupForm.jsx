import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthProvider';
import { supabaseClient } from '../../config/supabase-client';

export default function SignupForm({ setSignup }) {
	const emailRef = useRef();
	const fullNameRef = useRef();
	const passwordRef = useRef();

	const { signUp, updateMetaData } = useAuth();
	const navigateTo = useNavigate();
	function handleSwitchAuth(e) {
		e.preventDefault();
		setSignup(false);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const email = emailRef.current.value;
		const fullName = fullNameRef.current.value;
		const password = passwordRef.current.value;

		const { data: data_signup, error: error_signup } = await signUp({
			email,
			password,
		});

		if (error_signup) {
			console.error(error_signup);
			alert('error signing up');
			return;
		}

		// Add additional user details to db
		const { error: error_update } = await supabaseClient
			.from('profile')
			.insert({
				user_id: data_signup.user.id,
				full_name: fullName,
				email: email,
			});

		if (!error_signup) {
			// Redirect user to Dashboard
			navigateTo('/');
		}
	}

	return (
		<>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor='email'>Email address</label>
					<input
						id='email'
						name='email'
						type='email'
						placeholder='Your email address'
						ref={emailRef}
					/>
				</div>
				<div>
					<label htmlFor='fullName'>Full name</label>
					<input
						className='input'
						id='fullName'
						name='fullName'
						type='text'
						placeholder='Enter your full name'
						ref={fullNameRef}
					/>
				</div>
				<div>
					<label htmlFor='password'>Your Password</label>
					<input
						type='password'
						placeholder='Your password'
						ref={passwordRef}
					/>
				</div>
				<button type='submit'>Sign Up</button>
			</form>
			<a onClick={handleSwitchAuth}>Already have an account? Sign in</a>
		</>
	);
}
