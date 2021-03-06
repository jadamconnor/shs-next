import { useState } from 'react'
import Image from 'next/image'
import Router from 'next/router'
import SearchForm from './search-form'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars, faSearch, faTimes } from '@fortawesome/pro-regular-svg-icons'
import { faWindowClose } from '@fortawesome/pro-light-svg-icons'
import { faFacebookSquare, faInstagramSquare, faTwitterSquare } from '../node_modules/@fortawesome/free-brands-svg-icons'
import Accordion from './accordian'
import { kebabCase } from '../lib/utils'
import NewsletterModal from './newsletter-modal'

export default function Header({ menu, slug }) {

    const [modalOpen, setModalOpen] = useState(false)
    const [megaMenu, setMegaMenu] = useState(null)
    const [megaMenuDisabled, setMegaMenuDisabled] = useState(false)
    const [activeLabel, setActiveLabel] = useState(null)
    const [mobileNav, setMobileNav] = useState(null)
    const [searchInput, setSearchInput] = useState(null)
    const [mobileSearchInput, setMobileSearchInput] = useState(null)
    const [ searchQuery, setSearchQuery ] = useState( '' )
    
    const handleSearchFormSubmit = ( event ) => {
        event.preventDefault();
        Router.push( `/search?s=${searchQuery}` )
        return null
    }

    const toggleMobileNav = () => {
        setMobileNav(!mobileNav)
    }

    const toggleMobileSearch = () => {
        setMobileSearchInput(!mobileSearchInput)
    }

    return (
        <div className='relative'>
            {/* Upper nav on large viewports only */}
            <div className='hidden lg:block h-12 text-white bg-neutral-900'>
                <div onMouseEnter={() => setMegaMenu(false)} className='container px-6 sm:px-0 md:px-6 xl:px-0'>
                    <div className='hidden md:flex items-center justify-end'>
                        <div className='text-base font-semibold text-white tracking-wide mt-2.5'>
                            <a href={'/contact-us'}>
                                Contact Us
                            </a>
                        </div>
                        <div onClick={() => {setModalOpen(true), setMegaMenuDisabled(true)}} className='text-base cursor-pointer font-semibold text-white tracking-wide ml-4 mt-2.5'>
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
                <div className='container px-6 sm:px-0 md:px-6 xl:px-0'>
                    <div className='flex justify-between'>
                        <div className={mobileNav ? 'flex lg:hidden text-3xl items-center h-[80px] text-stone-50 font-light mr-2' : 'hidden lg:hidden text-3xl items-center h-[80px] text-stone-50 font-light'}>
                            <FontAwesomeIcon
                                icon={faTimes}
                                onClick={() => toggleMobileNav()}
                            />
                        </div>
                        <div className={mobileNav ? 'hidden lg:hidden text-3xl items-center h-[80px] text-stone-50 font-light' : 'flex lg:hidden text-3xl items-center h-[80px] text-stone-50 font-light'}>
                            <FontAwesomeIcon
                                className={mobileNav ? 'hidden' : 'block'}
                                icon={faBars}
                                onClick={() => toggleMobileNav()}
                            />
                        </div>
                        <a href={process.env.NEXT_PUBLIC_URL}>
                            <div className='relative hidden md:block h-16 w-80 pt-6 cursor-pointer'>
                                <Image 
                                    src={'/Smart-Home-Starter_Logo-White.png'}
                                    alt={'Smart Home Starter'}
                                    layout='responsive'
                                    width={78}
                                    height={10}
                                />
                            </div>
                        </a>
                        <a href={process.env.NEXT_PUBLIC_URL} className='w-full md:hidden flex justify-center'>
                            <div className='h-14 w-14 pt-3 md:hidden cursor-pointer relative'>
                                <Image
                                    src={'/SHSLogo.png'}
                                    alt={'Smart Home Starter'}
                                    layout='responsive'
                                    width={10}
                                    height={10}
                                />
                            </div>
                        </a>
                        <div className={'flex lg:hidden text-3xl items-center h-[80px] text-stone-50 font-light'}>
                            <FontAwesomeIcon
                                icon={faSearch}
                                onClick={() => toggleMobileSearch()}
                            />
                        </div>
                        <div className='hidden lg:flex items-center h-[80px]'>
                            {menu.map((el) => (
                                <div
                                    className={activeLabel === el.name ? `border-b-white inline-flex text-lg font-semibold text-smart-blue tracking-wider cursor-pointer h-full ml-4 border-b-2 transition ease-in-out duration-300` :  `border-b-black hidden lg:inline-flex text-lg font-semibold text-smart-blue tracking-wider cursor-pointer h-full ml-4 border-b-2 transition ease-in-out duration-300`}
                                    onMouseEnter={() => {setMegaMenu(el.menuItems.nodes), setActiveLabel(el.name)}}
                                    key={el.id}
                                >
                                    <div className='h-9 self-end'>
                                        {el.name}
                                    </div>
                                </div>
                            ))}
                            <div className={slug === 'search' ? 'hidden' : 'mt-5 ml-4'}>
                                <div 
                                    onMouseEnter={() => {setMegaMenu(false), setActiveLabel(null)}}
                                    onClick={() => setSearchInput(false)}
                                    className={searchInput ? 'inline text-xl font-semibold cursor-pointer text-white' : 'hidden text-xl font-semibold cursor-pointer text-white'}
                                >
                                    <FontAwesomeIcon icon={faWindowClose}/>
                                </div>
                                <div 
                                    onMouseEnter={() => {setMegaMenu(false), setActiveLabel(null)}}
                                    onClick={() => setSearchInput(true)}
                                    className={searchInput ? 'hidden text-xl font-semibold cursor-pointer text-white' : 'inline text-xl font-semibold cursor-pointer text-white'}
                                >
                                    <FontAwesomeIcon icon={faSearch}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Main search input - appears when searchInput === true */}
            <div
                
                className={searchInput ? 'hidden lg:flex z-50 absolute top-30 right-12 bg-neutral-900 h-20 p-5 items-center' : 'hidden'}
            >
                <SearchForm
                    searchQuery={ searchQuery }
                    setSearchQuery={ setSearchQuery }
                    handleSearchFormSubmit={handleSearchFormSubmit}
                    mode={'dark'}
                />
            </div>
            {/* Mobile nav - beneath main nav on mobile viewports */}
            <div
                className={
                    mobileNav ? 
                        // If slug is /search bump this menu up higher with top attribute
                        slug === 'search' ? 
                            'absolute lg:hidden z-50 left-0 w-screen h-fit bg-black transition-all ease-in-out duration-400 py-12' 
                        :
                            'absolute lg:hidden z-50 top-20 left-0 w-screen h-fit bg-black transition-all ease-in-out duration-400 py-12'
                    :
                        'absolute lg:hidden w-screen z-50 h-0 bg-black transition-all ease-in-out duration-400'
                    }
                >
                {/* Mobile search - beneath main nav on mobile viewports, unless slug is /search */}
                <div className={mobileSearchInput ? 'block' : 'hidden'}>
                    <div>
                        <label className='text-smart-blue flex lg:hidden justify-center items-center w-full h-24 bg-neutral-900  px-6 md:px-10'>
                            <SearchForm
                                searchQuery={ searchQuery }
                                setSearchQuery={ setSearchQuery }
                                handleSearchFormSubmit={handleSearchFormSubmit}
                                mode={'dark'}
                            />
                            <span className='ml-3'>Search</span>
                        </label>
                    </div>
                </div>
                {menu.map((el) => (
                    <div className={mobileNav ? 'px-6 bg-black ' : 'hidden'} key={el.id}>
                        <Accordion primary={el.name} secondary={el.menuItems.nodes} onToggleNav={toggleMobileNav}/>
                    </div>
                ))}
                <div
                    onClick={() => {setMobileNav(false), setModalOpen(true)}} 
                    className={mobileNav ? 'text-smart-blue px-6 text-2xl mt-6 cursor-pointer' : 'hidden'}
                >
                    Subscribe
                </div>
                <div  className={mobileNav ? 'text-smart-blue px-6 text-2xl mt-6 cursor-pointer' : 'hidden'}>
                    <a href={'/contact-us'}>
                        Contact Us
                    </a>
                </div>
            </div>
            {/* Megamenu - large viewports */}
            {(megaMenu && !megaMenuDisabled) &&
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
            {/* Newsletter modal - shows on Subscribe link click */}
            {modalOpen &&
                <NewsletterModal
                    onClose={() => {setModalOpen(false), setMegaMenuDisabled(false)}}
                />
            }
        </div>
    )
}