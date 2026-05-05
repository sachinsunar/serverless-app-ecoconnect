import { cn } from "../utils/cn"

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
    label?: string;
};


export default function Button({ label, onClick, className, children, ...props }: ButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn('bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer', className)}
            {...props}
        >
            {children ?? label}
        </button>
    )
}