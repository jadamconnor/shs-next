export default function SearchForm({ searchQuery, setSearchQuery, handleSearchFormSubmit }) {
    return (
        <form className="flex w-full justify-center" onSubmit={handleSearchFormSubmit}>
            <div className='w-80'>
                <input 
                    value={searchQuery}
                    onChange={( event ) => setSearchQuery( event.target.value )}
                    className='w-full h-10 text-sky-600 px-2 bg-neutral-900 border-2 border-gray-600 rounded focus:outline-none'
                />
            </div>
            <input
                type="submit"
                value="Search"
                onClick={handleSearchFormSubmit}
                className="cursor-pointer text-white text-xl bg-neutral-900 border-0 py-2 px-5 focus:outline-none"
            />
        </form>
    )
}