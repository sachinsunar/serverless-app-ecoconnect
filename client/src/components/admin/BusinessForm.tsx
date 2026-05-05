import { useState, useEffect } from "react"
import TitleHeader from "../TitleHeader"
import Button from "../Button"

interface BusinessFormProps {
    initialData?: {
        name: string;
        description: string;
        category: string;
        location: string;
        image: string;
    };
    onSubmit: (data: any) => Promise<void>;
    loading: boolean;
    title: string;
    buttonText: string;
}

const BusinessForm = ({ initialData, onSubmit, loading, title, buttonText }: BusinessFormProps) => {
    const [form, setForm] = useState({
        name: "",
        description: "",
        category: "",
        location: "",
        image: ""
    })

    useEffect(() => {
        if (initialData) {
            setForm(initialData)
        }
    }, [initialData])

    const categories = [
        "Zero Waste",
        "Local Food",
        "Repair Cafes",
    ]

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSubmit(form)
    }

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <TitleHeader title={title} className="py-0 mb-8" />

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Business Name</label>
                    <input
                        type="text"
                        name="name"
                        required
                        value={form.name}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="Enter business name"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
                    <textarea
                        name="description"
                        required
                        rows={4}
                        value={form.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all resize-none"
                        placeholder="Describe what this business does..."
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                    <select
                        name="category"
                        required
                        value={form.category}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all bg-white"
                    >
                        <option value="">Select a category</option>
                        {categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Location</label>
                    <input
                        type="text"
                        name="location"
                        required
                        value={form.location}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="e.g. Coventry London, UK11 1BC"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Image URL</label>
                    <input
                        type="url"
                        name="image"
                        required
                        value={form.image}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-500 transition-all"
                        placeholder="https://images.unsplash.com/..."
                    />
                </div>



                <div className="pt-4">
                    <Button
                        type="submit"
                        disabled={loading}
                        className="w-full py-4 bg-green-700 text-white rounded-xl font-bold hover:bg-green-800 transition-all shadow-lg shadow-green-900/10"
                    >
                        {loading ? "Processing..." : buttonText}
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default BusinessForm
