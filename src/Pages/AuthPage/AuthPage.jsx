import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseClient } from '../../config/supabase-client';

import LoginForm from '../../components/LoginForm/LoginForm';
import SignupForm from '../../components/SignupForm/SignupForm';

export default function AuthPage() {
	const [session, setSession] = useState();
	const [signup, setSignup] = useState(false);

	useEffect(() => {
		supabaseClient.auth.getSession().then(({ data: { session } }) => {
			setSession(session);
		});

		supabaseClient.auth.onAuthStateChange((_event, session) => {
			setSession(session);
		});
	}, []);

	return (
		<>
			{signup ? (
				<SignupForm setSignup={setSignup} />
			) : (
				<LoginForm setSignup={setSignup} />
			)}
		</>
	);
}
