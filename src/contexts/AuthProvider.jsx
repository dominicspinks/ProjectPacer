import { useContext, useState, useEffect, createContext } from 'react';
import { supabaseClient } from '../config/supabase-client';
import * as userAPI from '../utilities/user-api';

// create a context for authentication
const AuthContext = createContext({
    session: null,
    user: null,
    userDetails: {},
    userProjectInvites: [],
    getUserDetails: () => { },
    getProjectInvites: () => { },
    signUp: () => { },
    signIn: () => { },
    updateUserData: () => { },
    signOut: () => { },
});

// export the useAuth hook
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState();
    const [userDetails, setUserDetails] = useState({});
    const [userProjectInvites, setUserProjectInvites] = useState([]);
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
            setUser(session?.user);
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

    // Get user details from Profile table
    async function getUserDetails() {
        const userDetails = await userAPI.getUserDetails(user.id);
        setUserDetails({ ...userDetails });
    }

    // Reload user details from Profile and invites tables when user logs in
    useEffect(() => {
        if (!user) return;

        getUserDetails();
        getProjectInvites();
    }, [user]);

    // Get list of invites for a user
    async function getProjectInvites() {
        const { data, error } = await supabaseClient
            .from('project_invite')
            .select(
                'id, email, role_type!inner(id, role_type, priority), project!inner(id,name), profile!inner(user_id,full_name)'
            )
            .eq('email', user.email);

        if (error) {
            console.error(error);
        }
        setUserProjectInvites(data);
    }

    // Sign out user and reset state
    function signOut() {
        supabaseClient.auth.signOut();
        setUser(null);
        setUserDetails({});
        setUserProjectInvites([]);
    }

    const value = {
        session,
        user,
        userDetails,
        userProjectInvites,
        getUserDetails,
        getProjectInvites,
        signUp: (data) => supabaseClient.auth.signUp(data),
        signIn: (data) => supabaseClient.auth.signInWithPassword(data),
        updateUserData: (data) => supabaseClient.auth.updateUser({ data }),
        signOut,
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
