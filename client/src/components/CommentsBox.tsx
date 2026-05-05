import { Star, User } from "lucide-react"
import { getRelativeTime } from "../utils/getRelativeTime"
import Button from "./Button"
import type { Review } from "../pages/ListingsView"
import { useAuth } from "../auth/AuthContext"
import { useState } from "react"
import { updateReview } from "../api/businesses"
import { toast } from "sonner"

interface CommentsBoxProps {
    reviews: Review[]
    handleDelete: (businessId: string) => Promise<void>
    refresh: () => void
}

const CommentsBox = ({ reviews, handleDelete, refresh }: CommentsBoxProps) => {
    const { user } = useAuth()
    const [editingUserId, setEditingUserId] = useState<string | null>(null)
    const [editRating, setEditRating] = useState(0)
    const [editComment, setEditComment] = useState("")
    const [isUpdating, setIsUpdating] = useState(false)
    const [deletingUserId, setDeletingUserId] = useState<string | null>(null)

    const startEditing = (review: Review) => {
        setEditingUserId(review.userId)
        setEditRating(review.rating)
        setEditComment(review.comment)
    }

    const handleUpdate = async (businessId: string) => {
        setIsUpdating(true)
        try {
            await updateReview(businessId, editRating, editComment)
            toast.success("Review updated successfully")
            setEditingUserId(null)
            refresh()
        } catch (error) {
            toast.error("Failed to update review")
        } finally {
            setIsUpdating(false)
        }
    }

    const onDeleteClick = async (businessId: string, userId: string) => {
        setDeletingUserId(userId)
        try {
            await handleDelete(businessId)
        } finally {
            setDeletingUserId(null)
        }
    }

    return (
        <div>
            {reviews?.length > 0 ? reviews?.map((review, index) => {
                const isEditing = editingUserId === review.userId
                const isDeleting = deletingUserId === review.userId

                return (
                    <div key={index} className="bg-green-50 rounded-lg p-4 mt-4">
                        <div className="flex gap-2 items-center justify-between">
                            <p className="text-gray-800 font-semibold  flex gap-2 items-center"> <User size={18} />
                                {review?.userName || "Anonymous"} <span className="text-gray-400 text-xs">{getRelativeTime(review?.createdAt)}</span> </p>

                            {!isEditing && (
                                <p className="flex gap-2 items-center"> {
                                    Array.from({ length: Math.round(review?.rating) }).map((_, index) => (
                                        <Star key={index} fill="#FFD700" stroke="#FFD700" size={18} />
                                    ))}</p>
                            )}
                        </div>

                        {isEditing ? (
                            <div className="mt-2">
                                <div className="flex gap-2 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={20}
                                            className="cursor-pointer transition"
                                            fill={star <= editRating ? "#FFD700" : "none"}
                                            stroke="#FFD700"
                                            onClick={() => setEditRating(star)}
                                        />
                                    ))}
                                </div>
                                <textarea
                                    value={editComment}
                                    onChange={(e) => setEditComment(e.target.value)}
                                    className="border-gray-300 border rounded-lg w-full p-2 text-sm"
                                />
                                <div className="flex gap-2 mt-2">
                                    <Button
                                        onClick={() => handleUpdate(review.businessId)}
                                        disabled={isUpdating}
                                    >
                                        {isUpdating ? "Updating..." : "Save"}
                                    </Button>
                                    <Button
                                        onClick={() => setEditingUserId(null)}
                                        className="bg-gray-200 text-gray-800"
                                        disabled={isUpdating}
                                    >
                                        Cancel
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <p className="text-gray-600 p-2">{review?.comment}</p>

                                {user?.userId === review?.userId && (
                                    <div className="flex gap-2 mt-2">
                                        <Button
                                            className="bg-gray-200 text-gray-800"
                                            onClick={() => startEditing(review)}
                                            disabled={isDeleting}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            className="bg-red-200 text-red-800"
                                            onClick={() => onDeleteClick(review.businessId, review.userId)}
                                            disabled={isDeleting}
                                        >
                                            {isDeleting ? "Deleting..." : "Delete"}
                                        </Button>
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )
            }) :
                <p>No comments yet</p>}
        </div>
    )
}

export default CommentsBox