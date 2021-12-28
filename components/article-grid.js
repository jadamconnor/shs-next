import Image from 'next/image'

export default function ArticleGrid ({ myArticles, myCategory }) {

    return (
        <>
            <div className='container px-5 md:px-0 mb-12'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {myArticles.map((el, index) => (
                        <div key={el.node.id}>
                            {(index !== 0 && index % 7 === 0) ?
                                <div className='bg-gray-200 h-72' key={index}>
                                    AD
                                </div>
                                :
                                <div className='h-80'>
                                    {el.node.featuredImage &&
                                        <div className='relative h-44 mb-3'>
                                            <Image 
                                                src={el.node.featuredImage.node.sourceUrl}
                                                alt={el.node.featuredImage.node.altText}
                                                objectFit='cover'
                                                layout='fill'
                                                placeholder='blur'
                                                // Work-around for no out-of-box dataUrl
                                                blurDataURL={`/_next/image?url=${el.node.featuredImage.node.sourceUrl}&w=16&q=1`}
                                            />
                                        </div>
                                    }
                                    <div>
                                        <div className='text-lg mb-3'>
                                            <a href={`../${el.node.slug}`}>
                                                {el.node.title}
                                            </a>
                                        </div>
                                        <div className='text-sky-600'>
                                            {el.node.categories.edges.filter((e) => e.node.name !== myCategory).map((cat, index) => (
                                                <span key={cat.node.id}>
                                                    <a className='text-base font-bold text-sky-600 hover:text-blue-500 uppercase tracking-wider' href={`../categories/${cat.node.slug}`}>{cat.node.name}</a> {index < (el.node.categories.edges.filter((e) => e.node.name !== myCategory).length - 1) ? <span>| </span> : <span></span>}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            }
                        </div>
                    ))}
                </div>
            </div>     
        </>
    )
}
