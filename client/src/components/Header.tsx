import { Link } from 'react-router-dom'
import Button from './Button'
import { useAuth } from '../auth/AuthContext'
import { LayoutDashboard, User } from 'lucide-react';
import logo from '../assets/ecologo.jpeg'

const Header = () => {
    const { user } = useAuth();

    return (
        <div className="flex items-center justify-between px-10 py-4 sticky top-0 bg-white  shadow-md">
            <h1 className="text-2xl font-semibold flex gap-2 items-center">
                <img src={logo} className='h-20 w-20' alt="logo" />
                Coventry <span className="text-green-700">EcoConnect</span>
            </h1>
            <nav>
                <ul className="flex items-center gap-6 cursor-pointer ">
                    <Link to="/"><li className='hover:text-green-600'>Home</li></Link>
                    <Link to="/listings"><li className='hover:text-green-600'>Listings</li></Link>

                    {user ? (
                        <>
                            {!user.isSuperAdmin ?
                                <Link to="/profile">
                                    <li>
                                        <User size={30} className='bg-green-700 hover:bg-green-900 text-white rounded-full p-1' />
                                    </li>
                                </Link>
                                :
                                <Link to="/dashboard"><li className='flex font-semibold items-center gap-2 bg-green-700 text-white p-2 rounded-lg'><LayoutDashboard size={20} className='text-white' strokeWidth={3} />Dashboard</li></Link>}
                        </>
                    ) : (
                        <Link to="/login"><Button>Login</Button></Link>
                    )}
                </ul>
            </nav>
        </div>
    )
}

export default Header