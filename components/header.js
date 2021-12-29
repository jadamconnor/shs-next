import { useState } from 'react'
import Router from 'next/router'
import SearchForm from './search-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch, faTimes } from '@fortawesome/pro-regular-svg-icons'
import { faWindowClose } from '@fortawesome/pro-light-svg-icons'
import { faFacebookSquare, faInstagramSquare, faTwitterSquare } from '../node_modules/@fortawesome/free-brands-svg-icons'
import Accordion from './accordian'

export default function Header(menu) {
    // Converts menuItem labels to slugs, since slugs don't exist on menuItems
    const kebabCase = string => string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase()

    const [megaMenu, setMegaMenu] = useState(null)
    const [activeLabel, setActiveLabel] = useState(null)
    const [mobileNav, setMobileNav] = useState(null)
    const [searchInput, setSearchInput] = useState(null)
    const [ searchQuery, setSearchQuery ] = useState( '' )
    const handleSearchFormSubmit = ( event ) => {
        event.preventDefault();
        Router.push( `/search?s=${searchQuery}` )
        return null
    }

    const toggleMobileNav = () => {
        setMobileNav(!mobileNav)
    }

    return (
        <div>
            {/* Upper nav on large viewports only */}
            <div className='hidden lg:block h-12 text-white bg-neutral-900'>
                <div className='container px-6 md:px-0'>
                    <div className='hidden lg:flex items-center justify-end'>
                        <div className='text-base font-semibold text-white tracking-wide mt-2.5'>
                            Contact Us
                        </div>
                        <div className='text-base font-semibold text-white tracking-wide ml-4 mt-2.5'>
                            Subscribe
                        </div>
                        <div className='text-3xl font-semibold text-white ml-4 mt-2.5'>
                            <FontAwesomeIcon icon={faFacebookSquare}/>
                        </div>
                        <div className='text-3xl font-semibold text-white ml-2 mt-2.5'>
                            <FontAwesomeIcon icon={faInstagramSquare}/>
                        </div>
                        <div className='text-3xl font-semibold text-white ml-2 mt-2.5'>
                            <FontAwesomeIcon icon={faTwitterSquare}/>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main nav all viewports */}
            <div className='h-20 bg-black'>
                <div className='container px-6 md:px-0'>
                    <div className='flex justify-between'>
                        <div className='w-40 cursor-pointer'>
                            LOGO
                        </div>
                        <div className={mobileNav ? 'flex lg:hidden text-3xl items-center h-[79px] text-stone-50 font-light' : 'hidden lg:hidden text-3xl items-center h-[79px] text-stone-50 font-light'}>
                            <FontAwesomeIcon
                                icon={faTimes}
                                onClick={() => toggleMobileNav()}
                            />
                        </div>
                        <div className={mobileNav ? 'hidden lg:hidden text-3xl items-center h-[79px] text-stone-50 font-light' : 'flex lg:hidden text-3xl items-center h-[79px] text-stone-50 font-light'}>
                            <FontAwesomeIcon
                                className={mobileNav ? 'hidden' : 'block'}
                                icon={faBars}
                                onClick={() => toggleMobileNav()}
                            />
                        </div>
                        <div className='hidden lg:flex items-center h-[79px]'>
                            {menu.menu.map((el) => (
                                <div
                                    className={activeLabel === el.name ? `border-b-white inline-flex text-lg font-semibold text-sky-600 tracking-wider cursor-pointer h-full ml-4 border-b-2 transition ease-in-out duration-300` :  `border-b-black hidden lg:inline-flex text-lg font-semibold text-sky-600 tracking-wider cursor-pointer h-full ml-4 border-b-2 transition ease-in-out duration-300`}
                                    onMouseEnter={() => {setMegaMenu(el.menuItems.nodes), setActiveLabel(el.name)}}
                                    key={el.id}
                                >
                                    <div className='h-9 self-end'>
                                        {el.name}
                                    </div>
                                </div>
                            ))}
                            <div 
                                onMouseEnter={() => {setMegaMenu(false), setActiveLabel(null)}}
                                onClick={() => setSearchInput(false)}
                                className={searchInput ? 'inline text-xl font-semibold cursor-pointer text-white mt-5 ml-4' : 'hidden text-xl font-semibold cursor-pointer text-white mt-5 ml-4'}
                            >
                                <FontAwesomeIcon icon={faWindowClose}/>
                            </div>
                            <div 
                                onMouseEnter={() => {setMegaMenu(false), setActiveLabel(null)}}
                                onClick={() => setSearchInput(true)}
                                className={searchInput ? 'hidden text-xl font-semibold cursor-pointer text-white mt-5 ml-4' : 'inline text-xl font-semibold cursor-pointer text-white mt-5 ml-4'}
                            >
                                <FontAwesomeIcon icon={faSearch}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main search input - appears when searchInput === true */}
            <div
                className={searchInput ? 'flex z-50 absolute top-30 right-12 bg-neutral-900 h-20 p-5 items-center' : 'hidden'}
            >
            <SearchForm
                searchQuery={ searchQuery }
                setSearchQuery={ setSearchQuery }
                handleSearchFormSubmit={handleSearchFormSubmit}
            />
            </div>
            {/* Mobile search - beneath main nav on mobile viewports */}
            <div className='flex justify-center items-center w-full h-24 bg-neutral-900 lg:hidden px-6 md:px-10'>
                <div className='container relative'>
                    <span className="h-full text-xl absolute inset-y-0 left-2 flex items-center pl-2">
                        <FontAwesomeIcon icon={faSearch} className='fill-current text-sky-600'/>
                    </span>
                    <input
                        className='w-full h-14 bg-neutral-900 border-2 text-sky-600 border-gray-600 rounded pl-10 text-2xl'
                    >
                    </input>
                </div>
            </div>
            {/* Mobile nav - beneath main nav on mobile viewports */}
            <div 
                className={
                    mobileNav ? 
                        'absolute z-50 top-44 left-0 w-screen h-fit bg-black transition-all ease-in-out duration-400 py-12' 
                    :
                        'absolute w-screen z-40 h-0 bg-black transition-all ease-in-out duration-400'
                    }
                >
                {menu.menu.map((el) => (
                    <div className={mobileNav ? 'px-6 bg-black ' : 'hidden'} key={el.id}>
                        <Accordion primary={el.name} secondary={el.menuItems.nodes} onToggleNav={toggleMobileNav}/>
                    </div>
                ))}
            </div>
            {/* Megamenu - large viewports */}
            {megaMenu &&
                <div className='absolute hidden w-full lg:block bg-black z-40 py-5' onMouseLeave={() => {setMegaMenu(null), setActiveLabel(null)}}>
                    <div className='container grid grid-cols-4'>
                        {megaMenu.map((el) => (
                            <div onClick={() => {setMegaMenu(null)}} className='justify-self-center cursor-pointer h-10' key={el.id}>
                                <a href={`../category/${kebabCase(el.label)}`} className='text-base text-white hover:text-gray-200 tracking-wider font-semibold transition ease-in-out duration-700'>
                                    {el.label}
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            }
        </div>
    )
}