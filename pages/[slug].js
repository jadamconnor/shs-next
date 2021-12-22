import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getPostsWithSlug, getPostAndMorePosts } from '../lib/api'

export default function Post({ post, posts, preview }) {

    const router = useRouter()
    
    if (!router.isFallback && !post?.slug) {
        return <ErrorPage statusCode={404} />
    }
    
    return (
        <>
        {router.isFallback ? (
                <div>Loading…</div>
            ) : (
                <div dangerouslySetInnerHTML={{__html: post.content}}></div>
            )}
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
        data.push(res)
        console.log(endCursor)
    } while (hasNextPage)
    
    return {
        paths: data[0].edges.map(({ node }) => `/${node.slug}`),
        fallback: false
    }
}