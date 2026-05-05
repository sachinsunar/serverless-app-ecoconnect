import { Link } from "react-router-dom"
import BusinessCard from "../components/BusinessCard"
import SearchFilter from "../components/SearchFilter"
import TitleHeader from "../components/TitleHeader"
import { getAllBusinesses } from "../api/businesses"
import { useEffect, useState } from "react"


const Listings = () => {

    const [businesses, setBusinesses] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [searchQuery, setSearchQuery] = useState("")

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

    const filteredBusinesses = businesses.filter((business) =>
        (business.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (business.category?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
        (business.location?.toLowerCase() || "").includes(searchQuery.toLowerCase())
    )


    if (loading) {
        return <div className="flex items-center text-2xl font-bold justify-center h-screen">Loading...</div>
    }

    return (
        <div className="min-h-screen bg-[#b6edbc] p-8">
            <SearchFilter searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            <TitleHeader title="Eco-Friendly Businesses in Coventry" className="py-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredBusinesses.length > 0 ? (
                    filteredBusinesses.sort((b, a) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((business) => {
                        const rating = business.totalReviews > 0 && (business.ratingSum / business.totalReviews).toFixed(1)
                        return (
                            <Link key={business.businessId} to={`/listings/${business.businessId}`}>
                                <BusinessCard
                                    imageUrl={business.image}
                                    name={business.name}
                                    location={business.location}
                                    category={business.category}
                                    rating={Number(rating)}
                                />
                            </Link>
                        )
                    })
                ) : (
                    <div className="col-span-full text-center text-xl text-green-900 font-semibold py-20 bg-white/50 rounded-2xl border-2 border-dashed border-green-200">
                        No businesses found matching "{searchQuery}"
                    </div>
                )}
            </div>
        </div>
    )
}

export default Listings