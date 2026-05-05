import { MapPin, Star } from "lucide-react"
const BusinessCard = ({
    imageUrl,
    name,
    location,
    category,
    rating,

}: {
    imageUrl: string;
    name: string;
    location: string;
    category: string;
    rating: number;
}) => {
    return (
        <div className='bg-white rounded-lg p-3 flex items-center justify-start gap-6 w-[600px] shadow-lg'>
            <img
                className='h-40 w-40 rounded-lg'
                src={imageUrl} alt="image" />
            <div className="space-y-1">
                <h1 className="text-xl font-medium">{name}</h1>
                <p className="flex gap-2 items-center"> {
                    Array.from({ length: Math.round(rating) }).map((_, index) => (
                        <>
                            <Star key={index} fill="#FFD700" stroke="#FFD700" size={18} />
                        </>
                    ))} {rating > 0 ? rating : null}</p>
                <p className="flex gap-2 items-center text-md text-gray-600"><MapPin size={18} />{location}</p>
                <div className="flex gap-2 pt-2">
                    <span className="bg-green-500 text-white px-2 py-1 rounded-full text-sm">{category}</span>
                </div>
            </div>
        </div>
    )
}

export default BusinessCard