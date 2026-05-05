import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

export default function AdminLayout() {
    return (
        <div className="flex h-screen overflow-hidden bg-[#b6edbc]">
            <Sidebar />
            <main className="flex-1 overflow-auto p-8">
                <Outlet />
            </main>
        </div>
    );
}