import { getPostsWithSlug, getPostAndMorePosts } from '../lib/api'


const allPaths = false

export default function Post({ post, posts, preview }) {
    
    return (
        <>
            <div dangerouslySetInnerHTML={{__html: post.content}}></div>
        </>
    )
}
            
export async function getStaticProps({ params, preview = false, previewData }) {
    const data = await getPostAndMorePosts(params.slug, preview, previewData)
    
    return {
        props: {
            preview,
            post: data.post,
            posts: data.posts,
        },
        revalidate: 1
    }
    
}

async function getAllPostsWithSlug() {
    let data = []
    let endCursor = null
    let hasNextPage = true
    do {
        let res = await getPostsWithSlug(endCursor || null)
        endCursor = await res?.pageInfo.endCursor
        hasNextPage = await res?.pageInfo.hasNextPage
        data.push(...res.edges)
    } while (hasNextPage)
    return data
}

export async function getStaticPaths() {
    let data = null
    allPaths ? 
        data = await getAllPostsWithSlug() // Generates all articles statically
    :
        data = await getPostsWithSlug() // Generates only a few articles, rest loaded on demand, either on client or server depending on fallback property below
        data = data.edges

    return {
        paths: data.map(({ node }) => `/${node.slug}`) || [],
        fallback: 'blocking'
    }
}