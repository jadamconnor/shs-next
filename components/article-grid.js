import Image from 'next/image'

export default function ArticleGrid ({ myArticles, myCategory }) {

    const adArr = [1,2,3,4]

    return (
        <>
            <div className='container px-5 sm:px-0 md:px-6 xl:px-0 mb-12'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {myArticles.map((el, index) => (
                            (index !== 0 && index % 8 === 0) ?
                                <div className={`bg-gray-200 h-72`} key={index}>
                                    AD
                                </div>
                                :
                                <div className='h-80' key={el.id}>
                                    {el.featuredImage &&
                                        <a href={`../${el.slug}`}>
                                            <div className='relative h-44 mb-3'>
                                                <Image 
                                                    src={el.featuredImage.node.sourceUrl}
                                                    alt={el.featuredImage.node.altText}
                                                    objectFit='cover'
                                                    layout='fill'
                                                    placeholder='blur'
                                                    // Work-around for no out-of-box dataUrl
                                                    blurDataURL={`/_next/image?url=${el.featuredImage.node.sourceUrl}&w=16&q=1`}
                                                />
                                            </div>
                                        </a>
                                    }
                                    <div>
                                        <div className='text-lg mb-3 hover:underline decoration-1 underline-offset-4 decoration-gray-300'>
                                            <a href={`../${el.slug}`}>
                                                {el.title}
                                            </a>
                                        </div>
                                        <div className='text-smart-blue'>
                                            {el.categories.edges.filter((e) => e.node.name !== myCategory && e.node.name !== 'Featured').map((cat, index) => (
                                                <span key={cat.node.id}>
                                                    <a className='text-base font-semibold text-smart-blue hover:text-smart-teal uppercase tracking-wider' href={`../category/${cat.node.slug}`}>{cat.node.name}</a> {index < (el.categories.edges.filter((e) => e.node.name !== myCategory && e.node.name !== 'Featured').length - 1) ? <span>| </span> : <span></span>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            
                    ))}
                </div>
            </div>     
        </>
    )
}
