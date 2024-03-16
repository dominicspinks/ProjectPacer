import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthProvider';

// Verify the user has completed their profile
const CompleteProfile = ({ children }) => {
	const { user } = useAuth();

	if (!user || user.userData !== undefined) {
		// If not logged in, or the user data exists, continue
		return <>{children}</>;
	}
	// user has not completed their profile
	return <Navigate to='/profile/edit' />;
};

export default CompleteProfile;
