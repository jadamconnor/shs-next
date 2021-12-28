import { useState } from 'react'
import { BiSearch } from 'react-icons/bi'
import { FaTwitterSquare, FaInstagramSquare, FaFacebookSquare } from 'react-icons/fa'

export default function Header(menu) {
    // Converts menuItem labels to slugs, since slugs don't exist on menuItems
    const kebabCase = string => string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase()

    const [megaMenu, setMegaMenu] = useState(null)
    const [activeLabel, setActiveLabel] = useState(null)

    return (
        <div className=''>
            <div className='h-12 text-white bg-neutral-900'>
                <div className='container'>
                    <div className='flex items-center justify-end'>
                        <div className='hidden lg:block text-base font-semibold text-white tracking-wide mt-2.5'>
                            Contact Us
                        </div>
                        <div className='hidden lg:block text-base font-semibold text-white tracking-wide ml-4 mt-2.5'>
                            Subscribe
                        </div>
                        <div className='hidden lg:block text-3xl font-semibold text-white ml-4 mt-2.5'>
                            <FaFacebookSquare/>
                        </div>
                        <div className='hidden lg:block text-3xl font-semibold text-white ml-2 mt-2.5'>
                            <FaInstagramSquare/>
                        </div>
                        <div className='hidden lg:block text-3xl font-semibold text-white ml-2 mt-2.5'>
                            <FaTwitterSquare/>
                        </div>
                    </div>
                </div>
            </div>
            <div className='h-20 bg-black'>
                <div className='container'>
                    <div className='flex justify-between'>
                        <div className='w-40'>
                        </div>
                        <div className='flex items-center h-[79px]'>
                            {menu?.menu.map((el) => (
                                <div
                                    className={activeLabel === el.name ? `border-b-white hidden lg:inline-flex text-lg font-semibold text-sky-600 tracking-wider cursor-pointer h-full ml-4 border-b-2 transition ease-in-out duration-300` :  `border-b-black hidden lg:inline-flex text-lg font-semibold text-sky-600 tracking-wider cursor-pointer h-full ml-4 border-b-2 transition ease-in-out duration-300`}
                                    onMouseEnter={() => {setMegaMenu(el.menuItems.nodes), setActiveLabel(el.name)}}
                                    key={el.id}
                                >
                                    <div className='h-9 self-end'>
                                        {el.name}
                                    </div>
                                </div>
                            ))}
                            <div className='hidden lg:inline text-lg font-semibold text-white mt-5 ml-4'>
                                <BiSearch className='text-3xl' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {megaMenu &&
                <div className='absolute hidden w-full lg:block bg-black z-50 py-5' onMouseLeave={() => {setMegaMenu(null), setActiveLabel(null)}}>
                    <div className='container grid grid-cols-4'>
                        {megaMenu.map((el) => (
                            <div onClick={() => {setMegaMenu(null)}} className='justify-self-center cursor-pointer h-8' key={el.id}>
                                <a href={`../categories/${kebabCase(el.label)}`} className='text-base text-white hover:text-gray-200 tracking-wider font-semibold transition ease-in-out duration-700'>
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