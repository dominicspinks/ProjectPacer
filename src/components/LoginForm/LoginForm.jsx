import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../../contexts/AuthProvider';

export default function LoginForm({ setSignup }) {
	const emailRef = useRef();
	const passwordRef = useRef();

	const { signIn } = useAuth();
	const navigateTo = useNavigate();

	function handleSwitchAuth(e) {
		e.preventDefault();
		setSignup(true);
	}

	async function handleSubmit(e) {
		e.preventDefault();

		const email = emailRef.current.value;
		const password = passwordRef.current.value;

		const { error } = await signIn({ email, password });

		if (error) console.error(error);
		if (error) {
			alert('error signing in');
		} else {
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
					<label htmlFor='password'>Your Password</label>
					<input
						type='password'
						placeholder='Your password'
						ref={passwordRef}
					/>
				</div>
				<button type='submit'>Sign In</button>
			</form>
			<a onClick={handleSwitchAuth}>Don't have an account? Sign up</a>
		</>
	);
}
