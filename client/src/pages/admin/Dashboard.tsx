import { useAuth } from '../../auth/AuthContext';
import { getDashboardData } from '../../api/businesses';
import { useEffect, useState } from 'react';

export default function Dashboard() {
    const { user } = useAuth();
    const [loading, setLoading] = useState<boolean>(true);
    const [data, setData] = useState({
        totalBusinesses: 0,
        totalUsers: 0,
        totalReviews: 0
    });

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const data = await getDashboardData()
                setData(data)
            } catch (error) {
                console.error("Failed to fetch dashboard data", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBusinesses()
    }, [])


    if (loading) {
        return <div className='flex justify-center items-center h-screen'>Loading...</div>
    }


    return (
        <div>
            <h1 className="text-2xl font-bold text-gray-800 mb-1">
                Welcome back, {user?.name || 'Super Admin'}
            </h1>
            <p className="text-sm text-gray-500 mb-8">{user?.email}</p>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {[
                    { label: 'Total Listings', value: data.totalBusinesses || '—' },
                    { label: 'Total Users', value: data.totalUsers || '—' },
                    { label: 'Reviews', value: data.totalReviews || '—' },
                ].map(stat => (
                    <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
                        <p className="text-sm text-gray-500">{stat.label}</p>
                        <p className="text-3xl font-bold text-green-700 mt-1">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}