import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import {
    LayoutDashboard,
    List,
    LogOut,
} from 'lucide-react';
import Button from './Button';
import logo from '../assets/ecologo.jpeg'

const navItems = [
    { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, end: true },
    { label: 'Businesses', path: '/businesses', icon: List }
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <aside className="flex flex-col h-screen w-60 bg-green-800 text-white flex-shrink-0 shadow-2xl ">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-2 px-4 py-4 border-b border-green-700">
                <img src={logo} className='h-16 w-16' alt="logo" />
                <span className="font-bold text-lg ">EcoConnect Admin Panel</span>
            </Link  >

            {/* Nav links */}
            <nav className="flex-1 py-4 space-y-1 px-2">
                {navItems.map(({ label, path, icon: Icon, end }) => (
                    <NavLink
                        key={path}
                        to={path}
                        end={end}
                        className={({ isActive }) => `
                            flex items-center gap-3 p-3 rounded-lg text-sm font-medium
                            transition-colors duration-150
                            ${isActive
                                ? 'bg-green-600 text-white'
                                : 'text-green-200 hover:bg-green-700 hover:text-white'
                            }
                        `}
                    >
                        <Icon size={18} className="flex-shrink-0" />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/*Footer:  User info and sign out */}
            <div className="border-t border-green-700 px-2 py-3 space-y-2">
                <div className="px-3 py-2 bg-green-700 rounded-lg">
                    <p className="text-sm font-semibold truncate">{user?.name || 'Admin'}</p>
                    <p className="text-xs text-green-300 truncate">{user?.email}</p>
                </div>

                <Button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2.5 bg-transparent
                               text-red-300 hover:bg-red-500 hover:text-white"
                >
                    <LogOut size={18} className="flex-shrink-0" />
                    <span>Sign out</span>
                </Button>
            </div>
        </aside>
    );
}