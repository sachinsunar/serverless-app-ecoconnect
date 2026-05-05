import { Navigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ display: 'grid', placeItems: 'center', height: '100vh' }}>
                <p>Checking session...</p>
            </div>
        );
    }

    //  not logged in → send to login
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // logged in but not a superadmin → send back to home
    if (!user.isSuperAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
}