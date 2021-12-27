import Newsletter from './newsletter'

export default function Header({ myMenu }) {
    // Converts menuItem labels to slugs, since slugs don't exist on menuItems
    const kebabCase = string => string
        .replace(/([a-z])([A-Z])/g, "$1-$2")
        .replace(/[\s_]+/g, '-')
        .toLowerCase()
        
    return (
        <div className='bg-black py-12'>
            <div className='container'>
                <div className='md:grid md:grid-cols-2 lg:grid-cols-4 gap-5'>
                    <div>
                        <div className='mb-12'>
                            <div className='text-2xl text-sky-600 font-bold tracking-wider mb-9'>
                                Sign up for our newsletter
                            </div>
                            <Newsletter/>
                        </div>
                        <div className='text-xl text-white font-semibold tracking-wider mb-5'>
                            Smart Home Starter
                        </div>
                        <div className='text-sm text-white tracking-wider mb-5'>
                            This site is owned and operated by Time Off Club, LLC. Smarthomestarter.com is a participant in the Amazon Services LLC Associates Program, an affiliate advertising program designed to provide a means for sites to earn advertising fees by advertising and linking to Amazon.com. This site also participates in other affiliate programs and is compensated for referring traffic and business to these companies.
                        </div>
                    </div>
                    <div>
                    </div>
                    <div>
                        <div className='flex justify-between'>
                            {myMenu.slice(0,2).map((el) => (
                                <div className='text-sky-600 text-2xl font-bold tracking-wider' key={el.id}>
                                    {el.name}
                                    {el.menuItems.nodes.map((e) => (
                                        <a href={`../categories/${kebabCase(e.label)}`} key={e.id}>
                                            <div className='text-white text-lg font-bold tracking-wider mt-2'>
                                                    {e.label}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <div className='flex flex-col justify-between h-full'>
                            {myMenu.slice(2,4).map((el) => (
                                <div className='text-sky-600 text-2xl font-bold tracking-wider' key={el.id}>
                                    {el.name}
                                    {el.menuItems.nodes.map((e) => (
                                        <a href={`../categories/${kebabCase(e.label)}`} key={e.id}>
                                            <div className='text-white text-lg font-bold tracking-wider mt-2'>
                                                    {e.label}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}