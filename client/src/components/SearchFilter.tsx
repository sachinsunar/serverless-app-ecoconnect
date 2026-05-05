import { Search, X } from 'lucide-react'

interface SearchFilterProps {
    searchQuery: string
    setSearchQuery: (query: string) => void
}

const SearchFilter = ({ searchQuery, setSearchQuery }: SearchFilterProps) => {
    return (
        <div className='flex gap-4 items-center'>
            <div className='flex items-center gap-2 bg-white rounded-lg w-1/3 px-4'>
                <Search />
                <input
                    type="text"
                    placeholder='Search business...'
                    className='border-none focus:ring-0 rounded-lg w-full px-4 py-2'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <X className="cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => setSearchQuery("")} />
                )}
            </div>
        </div>
    )
}

export default SearchFilter