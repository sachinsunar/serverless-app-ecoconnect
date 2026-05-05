import { useNavigate } from "react-router-dom"
import Button from "./Button"


const Hero = () => {
    const navigate = useNavigate()
    return (
        <div className="flex flex-col items-center justify-center gap-4 p-40">
            <h1 className="text-4xl font-bold">Discover Sustainable Living in Coventry</h1>
            <p className="text-lg font-light">Find eco-friendly businesses, sustainable services, and green alternatives in your community</p>
            <Button onClick={() => navigate("/listings")}>Explore Businesses</Button>
        </div>
    )
}

export default Hero