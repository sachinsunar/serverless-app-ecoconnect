import { ArrowLeft } from "lucide-react"
import Button from "./Button"
import { useNavigate } from "react-router-dom"
import { cn } from "../utils/cn"

const BackButton = ({ className }: { className?: string }) => {
    const navigate = useNavigate()
    return (
        <Button
            onClick={() => navigate(-1)}
            className={cn("flex gap-2 items-center mb-4", className)}
        >
            <ArrowLeft size={20} />
            Back
        </Button>
    )
}

export default BackButton