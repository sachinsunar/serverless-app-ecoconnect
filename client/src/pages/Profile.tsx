import TitleHeader from "../components/TitleHeader"
import { Mail, User } from "lucide-react"
import Button from "../components/Button"
import { useAuth } from "../auth/AuthContext"
import { useNavigate } from "react-router-dom"

const Profile = () => {

    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) {
        navigate("/login")
    }
    return (
        <div className="min-h-screen bg-[#b6edbc]">
            <TitleHeader title="Profile" className="p-10" />
            <div className='bg-white mx-10 p-8 rounded-lg shadow-lg flex justify-between items-center w-1/2'>
                <div className='flex gap-6 items-center'>
                    <User className="bg-green-900 shadow-lg rounded-full p-2 text-white" size={80} />
                    <div>
                        <h1 className="text-2xl font-bold">{user?.name || "User"}</h1>
                        <p className="text-gray-600 flex gap-2 text-green-900 items-center"> <Mail size={16} />{user?.email || "Email"}</p>
                    </div>
                </div>
                <Button onClick={logout}>Logout</Button>
            </div>
        </div>
    )
}

export default Profile