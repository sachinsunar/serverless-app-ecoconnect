import { Star } from "lucide-react"
import { useState } from "react"
import Button from "./Button"
import { addReview } from "../api/businesses"
import { toast } from "sonner"
import { useAuth } from "../auth/AuthContext"

const UserReviewInput = ({
    businessId,
    submit,
    setSubmit
}: {
    businessId: string,
    submit: boolean,
    setSubmit: React.Dispatch<React.SetStateAction<boolean>>
}) => {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState("")
    const [loading, setLoading] = useState(false)
    const { user } = useAuth();

    const handleReviewSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) {
            toast.error("Please login to add a review!")
            return
        }
        setLoading(true)
        try {
            const res = await addReview(businessId, rating, comment)
            toast.success(res.message || "Review added successfully!")
            setSubmit(true)
        } catch (error: any) {
            toast.error(error.message || "Failed to add review!")
            setRating(0)
            setComment("")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {submit ? (
                <p className="text-green-600 w-full text-center font-semibold">Thank you for your review!</p>
            ) : (
                <form onSubmit={handleReviewSubmit}>
                    <div className="flex flex-col gap-2">
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={30}
                                    className="cursor-pointer transition"
                                    fill={star <= rating ? "#FFD700" : "none"}
                                    stroke="#FFD700"
                                    onClick={() => setRating(star)}
                                />
                            ))}
                        </div>
                        <textarea
                            name="comment"
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Write your review..."
                            className="border-gray-300 border rounded-lg w-full h-20  p-4 my-2"
                            required />

                        <div className="flex justify-end">
                            <Button type="submit" disabled={loading}>
                                {loading ? "Submitting..." : "Submit Review"}
                            </Button>
                        </div>
                    </div>
                </form>
            )}
        </div>
    )
}

export default UserReviewInput