import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { getBusiness, updateBusiness } from "../../api/businesses"
import BusinessForm from "../../components/admin/BusinessForm"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import Button from "../../components/Button"

const EditBusiness = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [error, setError] = useState("")
    const [initialData, setInitialData] = useState<any>(null)

    useEffect(() => {
        const fetchBusiness = async () => {
            try {
                if (!id) return;
                const data = await getBusiness(id)
                // The API returns the business in a 'business' property
                setInitialData(data.business)
            } catch (err: any) {
                setError(err.message || "Failed to fetch business details")
                toast.error("Error loading business data")
            } finally {
                setFetching(false)
            }
        }
        fetchBusiness()
    }, [id])

    const handleUpdate = async (formData: any) => {
        if (!id) return;
        setLoading(true)
        setError("")

        try {
            await updateBusiness(id, formData)
            toast.success("Business updated successfully")
            navigate("/businesses")
        } catch (err: any) {
            setError(err.message || "Failed to update business")
            toast.error(err.message || "Failed to update business")
        } finally {
            setLoading(false)
        }
    }

    if (fetching) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <div className="w-10 h-10 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium">Loading business data...</p>
            </div>
        )
    }

    return (
        <div className="p-6">

            <Button onClick={() => navigate(-1)} className="flex items-center gap-2 mb-4">
                <ArrowLeft size={18} />Back
            </Button>

            {error && (
                <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100">
                    {error}
                </div>
            )}

            <BusinessForm
                initialData={initialData}
                onSubmit={handleUpdate}
                loading={loading}
                title="Edit Business"
                buttonText="Update Business"
            />
        </div>
    )
}

export default EditBusiness
