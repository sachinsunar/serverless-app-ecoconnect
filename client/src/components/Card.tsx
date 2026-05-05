import { type LucideIcon } from "lucide-react"
const Card = ({
    title,
    description,
    logo: Logo
}: {
    title: string;
    description: string;
    logo: LucideIcon;
}) => {
    return (
        <div className="bg-white rounded-lg p-4 flex flex-col items-center justify-center gap-2 w-[260px]">
            <Logo className="rounded-full bg-green-600 p-4 w-16 h-16 text-white" />
            <h1 className="text-xl font-medium">{title}</h1>
            <p className="text-center text-md text-gray-600">{description}</p>
        </div>
    )
}

export default Card