import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { createBusiness } from "../../api/businesses"
import BusinessForm from "../../components/admin/BusinessForm"
import { toast } from "sonner"
import BackButton from "../../components/BackButton"


const CreateBusiness = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")

    const handleCreate = async (formData: any) => {
        setLoading(true)
        setError("")

        try {
            await createBusiness(formData)
            toast.success("Business created successfully")
            navigate("/businesses")
        } catch (err: any) {
            setError(err.message || "Failed to create business")
            toast.error(err.message || "Failed to create business")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="p-6">

            <BackButton />

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <BusinessForm
                onSubmit={handleCreate}
                loading={loading}
                title="Create New Business"
                buttonText="Create Business"
            />
        </div>
    )
}

export default CreateBusiness