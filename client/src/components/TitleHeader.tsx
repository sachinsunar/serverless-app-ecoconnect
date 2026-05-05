import { cn } from "../utils/cn"

const TitleHeader = ({ title, className }: { title: string, className?: string }) => {
    return (
        <h1 className={cn("text-3xl text-green-800 font-semibold py-4  mx-2 ", className)}>{title}</h1>
    )
}

export default TitleHeader