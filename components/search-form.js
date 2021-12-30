import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch, faTimes } from '@fortawesome/pro-regular-svg-icons'

export default function SearchForm({ searchQuery, setSearchQuery, handleSearchFormSubmit, mode }) {
    return (
        <>
            <form className={mode === 'dark' ? 'flex w-full justify-center' : 'hidden'} onSubmit={handleSearchFormSubmit}>
                <div className='w-80 relative'>
                    <span className="h-full text-xl absolute inset-y-0 left-2 flex items-center pl-2">
                        <FontAwesomeIcon icon={faSearch} className='fill-current text-sky-600'/>
                    </span>
                    <input 
                        value={searchQuery}
                        onChange={( event ) => setSearchQuery( event.target.value )}
                        className='w-full h-10 text-sky-600 px-2 bg-neutral-900 border-2 border-gray-600 rounded focus:outline-none pl-11'
                        placeholder='Search...'
                    />
                </div>
                <input
                    type='submit'
                    value='Search'
                    onClick={handleSearchFormSubmit}
                    className='hidden lg:inline cursor-pointer text-white text-xl bg-neutral-900 border-0 px-5 focus:outline-none'
                />
            </form>
            <form className={mode === 'light' ? 'flex w-full justify-center' : 'hidden'} onSubmit={handleSearchFormSubmit}>
                <div className='w-80 relative'>
                    <span className="h-full text-xl absolute inset-y-0 left-2 flex items-center pl-2">
                        <FontAwesomeIcon icon={faSearch} className='fill-current text-sky-600'/>
                    </span>
                    <input 
                        value={searchQuery}
                        onChange={( event ) => setSearchQuery( event.target.value )}
                        className='w-full h-10 text-sky-600 px-2 bg-gray-200 border-0 focus:outline-none pl-11'
                        placeholder='Search...'
                    />
                </div>
                <input
                    type='submit'
                    value='Search'
                    onClick={handleSearchFormSubmit}
                    className='cursor-pointer text-white bg-sky-600 text-xl border-0 px-5 ml-1 focus:outline-none'
                />
            </form>
        </>
    )
}