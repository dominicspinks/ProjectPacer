import { useState } from 'react';

import LoginForm from '../../components/LoginForm/LoginForm';
import SignupForm from '../../components/SignupForm/SignupForm';

export default function AuthPage() {
	const [signup, setSignup] = useState(false);

	return (
		<>
			<h1 className='text-4xl mb-10 mt-10'>ProjectPacer</h1>
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
