import { useParams } from "react-router-dom";
import { deleteReviewBySuperadmin, getAllReviews } from "../../api/businesses";
import { useEffect, useState } from "react";
import type { Review } from "../ListingsView";
import TitleHeader from "../../components/TitleHeader";
import Button from "../../components/Button";
import { toast } from "sonner";
import { Loader2, Trash2 } from "lucide-react";
import BackButton from "../../components/BackButton";

const ReviewsList = () => {

    const { id } = useParams();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState<Boolean>(true);
    const [deletingId, setDeletingId] = useState<string | null>(null)


    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await getAllReviews(id);
                setReviews(data.reviews);
            } catch (error: any) {
                console.error("Failed to fetch reviews:", error);
                toast.error(error.message || "Failed to fetch reviews");
            } finally {
                setLoading(false);
            }
        }
        fetchReviews();
    }, [id, deletingId])



    const handleDelete = async (businessId: string, userId: string) => {
        setDeletingId(userId)
        try {
            await deleteReviewBySuperadmin(businessId, userId);
            toast.success("Review deleted successfully");
        } catch (error: any) {
            console.error("Failed to delete review:", error);
            toast.error(error.message || "Failed to delete review");
        } finally {
            setDeletingId(null)
        }
    }
    return (
        <div className="p-4">
            <div className="flex items-center gap-4">
                <BackButton className="mb-0" />
                <TitleHeader title={`All Reviews`} />
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b font-bold text-green-800 text-lg">
                                <th className="px-6 py-4">Business Name</th>
                                <th className="px-6 py-4">User Name</th>
                                <th className="px-6 py-4">Rating</th>
                                <th className="px-6 py-4">Comment</th>
                                <th className="px-6 py-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-green-800">
                                        <div className="flex flex-col items-center gap-2">
                                            <span>Loading reviews...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : reviews.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-green-800 font-medium">
                                        No Reviews found.
                                    </td>
                                </tr>
                            ) : (
                                reviews.map((review) => {
                                    return (
                                        <tr key={review.businessId}>
                                            <td className="px-6 py-4">{review.businessName}</td>
                                            <td className="px-6 py-4">{review.userName}</td>
                                            <td className="px-6 py-4">{review.rating}</td>
                                            <td className="px-6 py-4 max-w-xs text-justify truncate ...">{review.comment}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex gap-2">
                                                    <Button className="bg-red-500 p-2 rounded-lg flex gap-2"
                                                        onClick={() => handleDelete(review.businessId, review.userId)}
                                                        title="Delete"
                                                        disabled={deletingId !== null}
                                                    >
                                                        {deletingId === review.userId ? (
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

export default ReviewsList