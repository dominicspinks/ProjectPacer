import { useContext, useState, useEffect, createContext } from 'react';
import { supabaseClient } from '../config/supabase-client';

import * as userAPI from '../utilities/user-api';

// create a context for authentication
const AuthContext = createContext({
	session: null,
	user: null,
	signOut: () => {},
});

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState();
	const [userDetails, setUserDetails] = useState({});
	const [session, setSession] = useState();
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const setData = async () => {
			const {
				data: { session },
				error,
			} = await supabaseClient.auth.getSession();
			if (error) throw error;
			setSession(session);

			// Get full profile for user

			setUser(user);
			setLoading(false);
		};

		const { data: listener } = supabaseClient.auth.onAuthStateChange(
			(_event, session) => {
				setSession(session);
				setUser(session?.user);
				setLoading(false);
			}
		);

		setData();

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, []);

	async function getUserDetails() {
		const userDetails = await userAPI.getUserDetails(user.id);
		console.log(userDetails);
		setUserDetails({ ...userDetails });
	}
	useEffect(() => {
		if (!user) return;

		getUserDetails();
	}, [user]);

	const value = {
		session,
		user,
		userDetails,
		getUserDetails,
		signUp: (data) => supabaseClient.auth.signUp(data),
		signIn: (data) => supabaseClient.auth.signInWithPassword(data),
		updateUserData: (data) => supabaseClient.auth.updateUser({ data }),
		// updateMetaData: (data) =>
		// supabaseClient.auth.updateUser({ data: data }),
		signOut: () => supabaseClient.auth.signOut(),
	};

	// use a provider to pass down the value
	return (
		<AuthContext.Provider value={value}>
			{!loading && children}
		</AuthContext.Provider>
	);
};

// export the useAuth hook
export const useAuth = () => {
	return useContext(AuthContext);
};
