import Newsletter from './newsletter'
import { kebabCase } from '../lib/utils'

export default function Header({ myMenu }) {
        
    return (
        <div className='bg-black py-12'>
            <div className='container px-5 md:px-0 '>
                <div className='md:grid md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    <div className='flex flex-col xl:justify-between'>
                        <div className='mb-12'>
                            <div className='text-4xl text-sky-600 font-bold tracking-wider mb-9'>
                                Sign up for our newsletter
                            </div>
                            <Newsletter/>
                        </div>
                        <div className='hidden lg:block'>
                            <div className='text-xl text-white font-semibold tracking-wider mb-3'>
                                Smart Home Starter
                            </div>
                            <div className='text-sm text-white font-light tracking-wider mb-5'>
                                This site is owned and operated by Time Off Club, LLC. Smarthomestarter.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. This site also participates in other affiliate programs and is compensated for referring traffic and business to these companies.
                            </div>
                        </div>
                    </div>
                    <div>
                    </div>
                    <div className='hidden md:block'>
                        <div className='flex justify-between'>
                            {myMenu.slice(0,2).map((el) => (
                                <div className='text-sky-600 text-2xl font-bold tracking-wider' key={el.id}>
                                    {el.name}
                                    {el.menuItems.nodes.map((e) => (
                                        <a href={`../category/${kebabCase(e.label)}`} key={e.id}>
                                            <div className='text-white text-lg font-bold tracking-wider mt-2'>
                                                    {e.label}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='hidden md:block'>
                        <div className='flex flex-col xl:justify-between h-full'>
                            {myMenu.slice(2,4).map((el) => (
                                <div className='text-sky-600 text-2xl font-bold tracking-wider mb-10 xl:mb-0' key={el.id}>
                                    <div className=''>
                                        {el.name}
                                    </div>
                                    {el.menuItems.nodes.map((e) => (
                                        <a href={`../category/${kebabCase(e.label)}`} key={e.id}>
                                            <div className='text-white text-lg font-bold tracking-wider mt-2'>
                                                    {e.label}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='md:hidden'>
                        <div className='flex flex-wrap justify-between h-full'>
                            {myMenu.map((el) => (
                                <div className='text-sky-600 text-2xl font-bold tracking-wider mb-5' key={el.id}>
                                    <div className=''>
                                        {el.name}
                                    </div>
                                    {el.menuItems.nodes.map((e) => (
                                        <a href={`../category/${kebabCase(e.label)}`} key={e.id}>
                                            <div className='text-white text-lg font-bold tracking-wider mt-2'>
                                                    {e.label}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className='lg:hidden mt-10'>
                        <div className='text-xl text-white font-semibold tracking-wider mb-3'>
                            Smart Home Starter
                        </div>
                        <div className='text-sm text-white font-light tracking-wider mb-5'>
                            This site is owned and operated by Time Off Club, LLC. Smarthomestarter.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. This site also participates in other affiliate programs and is compensated for referring traffic and business to these companies.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}