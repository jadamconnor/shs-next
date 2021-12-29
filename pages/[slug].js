import Image from 'next/image'
import Header from '../components/header'
import Footer from '../components/footer'
import Newsletter from '../components/newsletter'
import { getPostsWithSlug, getPostAndMorePosts, getMenuBySlug, getPostsWithTag } from '../lib/api'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faFacebookSquare, faInstagramSquare, faTwitterSquare } from '../node_modules/@fortawesome/free-brands-svg-icons'
import Moment from 'react-moment'
import 'moment-timezone'

export default function Post({ post, related, posts, preview, navigationMenus }) {
    return (
        <>
            <Header menu={navigationMenus}/>
            <div className='container grid grid-cols-3 px-5 lg:px-22 xl:px-40 gap-5 my-12'>
                <div className='col-span-3 lg:col-span-2'>
                    <div className='text-base text-gray-500 font-extralight'>
                        The Smart Home Starter team picks the products and services we write about. When you buy through our links, we may get a commission.
                    </div>
                    <div className='text-4xl font-bold tracking-wider mt-12 mb-5'>
                        {post.title}
                    </div>
                    <div className='flex justify-between items-baseline mb-2'>
                        <div className='text-lg'>
                            <Moment format={'MMM D, YYYY'}>{post.date}</Moment>
                        </div>
                        <div className='flex text-sky-600 mb-3 text-3xl'>
                           <FontAwesomeIcon icon={faFacebookSquare} className='mr-1'/>
                           <FontAwesomeIcon icon={faInstagramSquare} className='mr-1'/>
                           <FontAwesomeIcon icon={faTwitterSquare} />
                        </div>
                    </div>
                    {post.featuredImage &&
                        <div className='relative h-96 mb-5'>
                            <Image
                                src={post.featuredImage.node.sourceUrl}
                                alt={post.featuredImage.node.altText}
                                objectFit='cover'
                                layout='fill'
                                // Work-around for no out-of-box dataUrl
                                blurDataURL={`/_next/image?url=${post.featuredImage.node.sourceUrl}&w=16&q=1`}
                                priority
                            />
                        </div>
                    }
                    <div className='unreset' dangerouslySetInnerHTML={{__html: post.content}}></div>
                </div>
                <div className='hidden lg:inline col-span-1'>
                    <div className='w-full bg-gray-300 h-[700px] mb-14'>
                        AD
                    </div>
                    <div className='text-3xl font-bold mb-5'>
                        Related Articles
                    </div>
                    {related.map((el) => (
                        el.title !== post.title &&
                        <div className='mb-8' key={el.id}>
                            <div className='text-xl mb-1'>
                                <a href={el.slug}>
                                    {el.title}
                                </a>
                            </div>
                            <div className='text-sky-600 text-base font-medium uppercase tracking-wider'>
                                {el.categories.nodes.map((cat, index) => (
                                    <span key={cat.id}>
                                        <a className='text-sky-600 hover:text-blue-500' href={`../category/${cat.slug}`}>{cat.name}</a> {index < (el.categories.nodes.length - 1) ? <span>| </span> : <span></span>}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                    <div className='border-y-2 border-y-gray-500 py-12 my-14'>
                        <div className='text-4xl text-sky-600 font-bold mb-5 tracking-wider'>
                            Sign up for our newsletter
                        </div>
                        <Newsletter mode={'light'}/>
                    </div>
                    <div className='w-full bg-gray-300 h-[700px] top-10 sticky'>
                        AD
                    </div>
                </div>
            </div>
            <Footer myMenu={navigationMenus} />
        </>
    )
}

async function getRelatedPosts(tags) {
    let arr = []

    tags.forEach((tag) => {
        arr.push(tag.node.slug)
    })

    console.log(arr)

    let data = []
    let i = 0
    do {
        console.log(arr[i])
        let res = await getPostsWithTag(arr[i])
        !data.some((el) => res.posts.nodes.some((node) => node.slug === el.slug)) && data.push(...res.posts.nodes)
        i++
    } while (i < arr.length)

    return data
}
            
export async function getStaticProps({ params, preview = false, previewData }) {
    const data = await getPostAndMorePosts(params.slug, preview, previewData)
    const related = await getRelatedPosts(data?.post?.tags?.edges)
    let navigationSlugs = [
		'brands',
		'faq',
		'entertainment',
		'in-the-home'
	]
	let navigationMenus = []
	let i = 0
	do {
		let res = await getMenuBySlug(navigationSlugs[i])
		navigationMenus.push(...res?.menus?.nodes)
		i++
	} while (i < navigationSlugs.length)
    
    return {
        props: {
            preview,
            post: data.post,
            related: related,
            posts: data.posts,
            navigationMenus: navigationMenus
        },
        revalidate: 1
    }
    
}

async function getAllPostsWithSlug() {
    let data = []
    let endCursor = null
    let hasNextPage = true
    do {
        let res = await getPostsWithSlug(100, endCursor || null)
        endCursor = await res?.pageInfo.endCursor
        hasNextPage = await res?.pageInfo.hasNextPage
        data.push(...res.edges)
    } while (hasNextPage)
    return data
}

// Generate all paths?
const allPaths = false

export async function getStaticPaths() {
    let data = []
    if (allPaths) {
        data = await getAllPostsWithSlug() // Generates all articles statically
    } else {
        data = await getPostsWithSlug(10) // Generates only a few articles, rest loaded on demand, either on client or server depending on fallback property below
        data = data?.edges
    }

    return {
        paths: data?.map(({ node }) => `/${node.slug}`) || [],
        fallback: 'blocking'
    }
}