import { getPostsWithSlug, getCategories } from "../../lib/api"

const EXTERNAL_DATA_URL = 'https://shs-vercel.app'

function generateSiteMap(posts, categories) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${EXTERNAL_DATA_URL}/contact</loc>
     </url>
     ${categories
       .map((el) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/category/${el.node.slug}`}</loc>
       </url>
     `
       })
       .join('')}
     ${posts
       .map((el) => {
         return `
       <url>
           <loc>${`${EXTERNAL_DATA_URL}/${el.node.slug}`}</loc>
       </url>
     `
       })
       .join('')}
   </urlset>
 `
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

async function getAllPostsWithSlug() {
      let data = {
        posts: {
            edges: []
        }
    }
    let endCursor = null
    let hasNextPage = true
    do {
        let res = await getPostsWithSlug(100, endCursor || null)
        endCursor = await res?.pageInfo.endCursor
        hasNextPage = await res?.pageInfo.hasNextPage
        data.posts.edges.push(...res.edges)
    } while (hasNextPage)
    return data
}

async function getAllCategories() {
	let data = []
    let endCursor = null
    let hasNextPage = true
    do {
        let res = await getCategories(100, endCursor || null)
        endCursor = await res?.pageInfo.endCursor
        hasNextPage = await res?.pageInfo.hasNextPage
        data.push(...res.edges)
    } while (hasNextPage)

	return data
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const postRequest = await getAllPostsWithSlug()
  const posts = await postRequest.posts.edges

  const categoriesRequest = await getAllCategories()
  const categories = await categoriesRequest

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts, categories)

  res.setHeader('Content-Type', 'text/xml')
  // we send the XML to the browser
  res.write(sitemap)
  res.end()

  return {
    props: {}
  }
}

export default SiteMap