import { useEffect, useState } from 'react';
import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabaseClient } from '../../config/supabase-client';
export default function AuthPage() {
	const [session, setSession] = useState();

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
			{!session ? (
				<Auth
					supabaseClient={supabaseClient}
					appearance={{ theme: ThemeSupa }}
					providers={[]}
					redirectTo='http://localhost:5173/projects'
				/>
			) : (
				<div>Welcome {session.user.email}</div>
			)}
		</>
	);
}
