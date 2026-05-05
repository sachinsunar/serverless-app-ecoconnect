import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Button from '../components/Button';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { login, user } = useAuth();
    const navigate = useNavigate();

    if (user) {
        navigate('/');
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const redirectTo = await login(email, password);
            navigate(redirectTo);
        } catch (err: any) {
            if (err.name === 'UserNotConfirmedException') {
                setError('Please verify your email before signing in.');
            } else if (err.name === 'NotAuthorizedException') {
                setError('Invalid email or password.');
            } else {
                setError(err.message || 'Something went wrong.');
            }
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="min-h-[calc(100vh-13.8vh)] bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-md">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-800">Welcome to EcoConnect</h1>
                </div>

                {error && (
                    <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg mb-5">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm text-gray-600 mb-1">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="enter your email"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-sm text-gray-600 mb-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="enter your password"
                            required
                            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-green-600"
                        />
                    </div>

                    <div>
                        <Button
                            type="submit"
                            disabled={loading}
                            className='w-full'
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </Button>
                    </div>

                    <div className="mt-5 text-center text-sm text-gray-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-green-700 hover:underline">Register</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}