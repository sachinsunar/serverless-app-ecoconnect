import { useEffect, useState } from "react"
import { deleteBusiness, getAllBusinesses } from "../../api/businesses"
import TitleHeader from "../../components/TitleHeader"
import { Edit, Trash2, MessageSquare, Loader2, Plus } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Button from "../../components/Button"
import { toast } from "sonner"

const BusinessesList = () => {
    const [businesses, setBusinesses] = useState<any[]>([])
    const [loading, setLoading] = useState<Boolean>(true)
    const [deletingId, setDeletingId] = useState<string | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const data = await getAllBusinesses()
                setBusinesses(data.businesses || [])
            } catch (error) {
                console.error("Failed to fetch businesses:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBusinesses()
    }, [])

    const handleDelete = async (id: string) => {
        setDeletingId(id)
        try {
            await deleteBusiness(id)
            toast.success("Business deleted successfully")
        } catch (error: any) {
            console.error("Failed to delete business:", error)
            toast.error(error.message || "Failed to delete business")
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-6">
                <TitleHeader title="All Businesses" />
                <Button onClick={() => navigate("/businesses/create")} className="flex gap-2 items-center mb-2">
                    <Plus size={18} />
                    Create Business
                </Button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b font-bold text-green-800 text-lg">
                                <th className="px-6 py-4">Image</th>
                                <th className="px-6 py-4">Business</th>
                                <th className="px-6 py-4">Category</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4">Description</th>
                                <th className="px-6 py-4">Average Rating</th>
                                <th className="px-6 py-4">Total Reviews</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-green-800">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>Loading businesses...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : businesses.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-green-800 font-medium">
                                        No businesses found.
                                    </td>
                                </tr>
                            ) : (
                                businesses.sort((b, a) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((business) => {
                                    const ratingSum = Number(business.ratingSum || 0);
                                    const totalReviews = Number(business.totalReviews || 0);
                                    const avgRating = totalReviews > 0 ? (ratingSum / totalReviews).toFixed(1) : "—";

                                    return (
                                        <tr key={business.businessId}>
                                            <td className="px-6 py-4">
                                                <img src={business.image} alt="" className="h-10 w-10 object-cover rounded-lg" />
                                            </td>
                                            <td className="px-6 py-4">{business.name}</td>
                                            <td className="px-6 py-4">{business.category}</td>
                                            <td className="px-6 py-4">{business.location}</td>
                                            <td className="px-6 py-4 truncate max-w-xs" title={business.description}>{business.description}</td>
                                            <td className="px-20 py-4">{avgRating}</td>
                                            <td className="px-20 py-4">{totalReviews}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Button
                                                        onClick={() => navigate(`/businesses/${business.businessId}/reviews`)}
                                                        className="bg-blue-500 p-2 rounded-lg "
                                                        title="View Reviews"
                                                    >
                                                        <MessageSquare size={18} />
                                                    </Button>
                                                    <Button
                                                        onClick={() => navigate(`/businesses/edit/${business.businessId}`)}
                                                        className="bg-green-500 p-2 rounded-lg "
                                                        title="Edit"
                                                    >
                                                        <Edit size={18} />
                                                    </Button>
                                                    <Button className="bg-red-500 p-2 rounded-lg flex gap-2"
                                                        onClick={() => handleDelete(business.businessId)}
                                                        title="Delete"
                                                        disabled={deletingId !== null}
                                                    >
                                                        {deletingId === business.businessId ? (
                                                            <Loader2 size={18} className="animate-spin" />
                                                        ) : (
                                                            <Trash2 size={18} />
                                                        )}
                                                    </Button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default BusinessesList