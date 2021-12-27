import Image from 'next/image'
import Header from '../components/header'
import Footer from '../components/footer'
import { getPostsWithSlug, getPostAndMorePosts, getMenuBySlug } from '../lib/api'
import { FaTwitterSquare, FaInstagramSquare, FaFacebookSquare } from 'react-icons/fa'
import Moment from 'react-moment'
import 'moment-timezone'

export default function Post({ post, posts, preview, navigationMenus }) {
    return (
        <>
            <Header menu={navigationMenus}/>
            <div className='container'>
            </div>
            <div className='container grid grid-cols-3 md:px-28 lg:px-44 gap-5 my-12'>
                <div className='col-span-2'>
                    <div className='text-base text-gray-400 font-extralight'>
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
                            <FaFacebookSquare className='mr-1'/>
                            <FaInstagramSquare className='mr-1'/>
                            <FaTwitterSquare/>
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
                <div className='col-span-1'>
                    <div className='w-full bg-gray-300 h-[900px]'>
                        AD
                    </div>
                </div>
            </div>
            <Footer myMenu={navigationMenus} />
        </>
    )
}
            
export async function getStaticProps({ params, preview = false, previewData }) {
    const data = await getPostAndMorePosts(params.slug, preview, previewData)
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
const allPaths = true

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