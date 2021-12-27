import Image from 'next/image'

export default function HomeFeatured({ myArticles, myCategory }) {
    let featuredArticle
    myArticles.length > 0 ? featuredArticle = myArticles[0].node : null

    return (
        <div className='container mb-12'>
            <div className='block lg:grid grid-cols-1 lg:grid-cols-4 lg:gap-5'>
                <div className='relative lg:col-span-2 mb-3 lg:mb-0'>
                    {featuredArticle.featuredImage &&
                        <div className='relative h-96'>
                            <Image
                                src={featuredArticle.featuredImage.node.sourceUrl}
                                alt={featuredArticle.featuredImage.node.altText}
                                objectFit='cover'
                                layout='fill'
                                priority
                            />
                        </div>
                    }
                    <div className='absolute top-0 bottom-0 w-full h-full bg-opacity-60 bg-black'>
                    </div>
                    <div className='absolute left-0 bottom-0 group:w-full pb-5 px-5'>
                        <a href={`../${featuredArticle.slug}`}>
                            <div className='text-2xl text-white font-medium pb-2 tracking-wider'>
                                {featuredArticle.title}
                            </div>
                        </a>
                        {featuredArticle.categories.edges.filter((e) => e.node.name !== myCategory).map((cat, index) => (
                            <span key={cat.node.id} className='text-sky-600 text-md font-semibold uppercase tracking-wider'>
                                <a href={`../categories/${cat.node.slug}`} className='text-sky-600 hover:text-blue-500'>{cat.node.name}</a> {index < (featuredArticle.categories.edges.filter((e) => e.node.name !== myCategory).length - 1) ? <span>| </span> : <span></span>}
                            </span>
                        ))}
                    </div>
                </div>
                <div className='sm:grid grid-cols-2 sm:col-span-2 gap-x-5'>
                    <div className='col-span-2 text-sky-600 font-bold text-2xl tracking-wider mb-5'>
                        Top Articles
                    </div>
                    {myArticles.slice(1,7).map((el) => (
                        <div key={el.node.id} className='flex flex-col justify-start h-24 text-base basis-80 font-medium mb-2'>
                            <div className='mb-2'>
                                <a href={`../${el.node.slug}`}>
                                    {el.node.title}
                                </a>
                            </div>
                            <div className='text-sky-600 text-sm font-medium uppercase tracking-wider'>
                                {el.node.categories.edges.filter((e) => e.node.name !== myCategory).map((cat, index) => (
                                    <span key={cat.node.id}>
                                        <a className='text-sky-600 hover:text-blue-500' href={`../categories/${cat.node.slug}`}>{cat.node.name}</a> {index < (el.node.categories.edges.filter((e) => e.node.name !== myCategory).length - 1) ? <span>| </span> : <span></span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5'>
                {myArticles.slice(7,11).map((el) => (
                    <div key={el.node.id} className='inline-flex flex-wrap w-72 lg:w-full mb-5'>
                        {el.node.featuredImage &&
                            <a href={`../${el.node.slug}`} className='relative w-full h-56 mb-3'>
                                <Image 
                                    src={el.node.featuredImage.node.sourceUrl}
                                    alt={el.node.featuredImage.node.altText}
                                    objectFit='cover'
                                    layout='fill'
                                />
                            </a>
                        }
                        <div>
                            <div className='text-lg mb-3'>
                                <a href={`../${el.node.slug}`}>
                                    {el.node.title}
                                </a>
                            </div>
                            <div className='text-sm text-sky-600'>
                                {el.node.categories.edges.filter((e) => e.node.name !== myCategory).map((cat, index) => (
                                    <span key={cat.node.id}>
                                        <a className='text-sky-600 uppercase' href={`../categories/${cat.node.slug}`}>{cat.node.name}</a> {index < (el.node.categories.edges.filter((e) => e.node.name !== myCategory).length - 1) ? <span>| </span> : <span></span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}