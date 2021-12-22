import ErrorPage from 'next/error'
import { getPostsWithSlug, getPostAndMorePosts } from '../lib/api'

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

export async function getStaticPaths() {
    let data = []
    let endCursor = null
    let hasNextPage = true
    do {
        let res = await getPostsWithSlug(endCursor || null)
        endCursor = await res?.pageInfo.endCursor
        hasNextPage = await res?.pageInfo.hasNextPage
        data.push(...res.edges)
    } while (hasNextPage)
    
    return {
        paths: data.map(({ node }) => `/${node.slug}`) || [],
        fallback: 'blocking'
    }
}