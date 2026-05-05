import { MapPin, Star } from "lucide-react";
import { useParams } from "react-router-dom";
import UserReviewInput from "../components/UserReviewInput";
import { deleteReview, getAllReviews, getBusiness } from "../api/businesses";
import { useEffect, useState } from "react";
import CommentsBox from "../components/CommentsBox";
import { toast } from "sonner";
import BackButton from "../components/BackButton";

export type Review = {
    reviewId: string
    businessId: string
    businessName?: string
    userId: string
    userName: string
    rating: number
    comment: string
    createdAt: string
}

type Business = {
    businessId: string
    name: string
    description: string
    location: string
    category: string
    image: string,
    totalReviews: number,
    ratingSum: number,
}



const ListingsView = () => {

    const { id } = useParams();
    const [business, setBusiness] = useState<Business>()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [submit, setSubmit] = useState<boolean>(false)

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const data = await getBusiness(id)
                const reviewsData = await getAllReviews(id)
                setBusiness(data.business)
                setReviews(reviewsData.reviews || [])
            } catch (error) {
                console.error("Failed to fetch businesses:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchBusinesses()
    }, [id, submit])

    const handleDelete = async (businessId: string) => {
        try {
            await deleteReview(businessId)
            toast.success("Review deleted successfully")
            setSubmit(prev => !prev)
        } catch (error) {
            console.error("Failed to delete review", error)
            toast.error("Failed to delete review")
        }
    }


    if (loading) {
        return <div className="flex items-center text-2xl font-bold justify-center h-screen">Loading...</div>
    }

    if (!business) {
        return <div className="flex items-center text-2xl font-bold justify-center h-screen">Business not found</div>
    }

    const avgRating = (business.totalReviews ?? 0) > 0 ? (business.ratingSum / business.totalReviews).toFixed(1) : undefined


    return (
        <div className="bg-[#b6edbc] p-10 min-h-screen">
            <BackButton />


            {/* Business Details Section */}
            <div className="mt-10 flex gap-10 bg-white rounded-lg p-10 shadow-lg">
                <img src={business.image} alt="" className="h-[500px] w-[500px] object-cover rounded-lg shadow-lg" />

                <div className="w-2/3">
                    <p className="text-3xl font-semibold py-2">{business.name}</p>
                    {avgRating && <p className="flex gap-2 items-center"> {
                        Array.from({ length: Math.round(Number(avgRating)) }).map((_, index) => (
                            <>
                                <Star key={index} fill="#FFD700" stroke="#FFD700" size={18} />
                            </>
                        ))} {avgRating || 0}</p>}
                    <p className="flex gap-2 items-center text-md text-gray-600 py-2"><MapPin size={18} />{business.location}</p>

                    <p className="text-md font-normal text-justify mt-4 text-gray-700">{business.description}</p>
                    <div className="flex gap-2 py-8">
                        <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">{business.category}</span>
                    </div>
                </div>
            </div>


            {/* Review section */}
            <div className="bg-white shadow-md rounded-xl p-6 mt-6 w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Review {business.name}
                </h2>
                <p className="text-gray-500 text-sm mb-4">
                    Share your experience with {business.name}
                </p>

                <UserReviewInput businessId={business.businessId} setSubmit={setSubmit} submit={submit} />

                <h1 className="text-xl font-bold text-gray-800 mb-2">Commments</h1>
                <CommentsBox reviews={reviews} handleDelete={handleDelete} refresh={() => setSubmit(prev => !prev)} />
            </div>

        </div >
    )
}

export default ListingsView