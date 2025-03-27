import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthProvider';

// Verify the user is logged in
const ProtectedRoute = ({ children }) => {
    const { user } = useAuth();
    if (!user) {
        // user is not authenticated, redirect to login
        return <Navigate to='/auth' />;
    }
    return <>{children}</>;
};

export default ProtectedRoute;
