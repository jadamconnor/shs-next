import { getPropsForCategory, getCategories, getPostsByCategory, getMenuBySlug } from '../../lib/api'
import Header from '../../components/header'
import Footer from '../../components/footer'
import FeaturedCategory from '../../components/featured-category'
import ArticleGrid from '../../components/article-grid'
import ArticleFilterBar from '../../components/article-filter-bar'
import { useState } from 'react'

export default function Categories({ posts, category, categorySlug, filterMenu, navigationMenus }) {
    const categories = []

	const [articles, setArticles] = useState(false)
	const [filteredArticles, setFilteredArticles] = useState(false)
	const [endCursor, setEndCursor] = useState(null)
	const [hasNextPage, setHasNextPage] = useState(true)
	const [loadingMoreArticles, setLoadingMoreArticles] = useState(false)

	posts?.edges.forEach(el => {
		el.node.categories.edges.forEach(e => {
			!categories.includes(e.node.name) && categories.push(e.node.name)
		})
	})

	const filterTabs = []
	categories.forEach(el => filterTabs.push({label: el}))

	const filter = (cat) => {
		let arr = []
		if (cat === "All") {
			!articles ?
				setFilteredArticles(posts?.edges)
			:
				setFilteredArticles(null)
		} else {
			!articles ?
				posts?.edges.forEach(el => {
					el.node.categories.edges.forEach(e => {
						e.node.name === cat && arr.push(el)
					})
				})
			:
				articles?.forEach(el => {
					el.node.categories.edges.forEach(e => {
						e.node.name === cat && arr.push(el)
					})
				})
			setFilteredArticles(arr)
		}
	}

	async function loadMoreArticles() {
		setLoadingMoreArticles(true)
		let data = null
		try {
			data = await getPostsByCategory(categorySlug, 40, endCursor || posts?.pageInfo.endCursor)
		} catch (e) {
			console.error(e)
		} finally {
			setLoadingMoreArticles(false)
			setEndCursor(data?.posts.pageInfo.endCursor)
			setHasNextPage(data?.posts.pageInfo.hasNextPage)
			setArticles(articles ? articles.concat(data?.posts.edges) : posts?.edges.concat(data?.posts.edges))
		}
	}

	return (
		<>  
			<Header menu={navigationMenus}/>
			<div className='container px-5 md:px-0 grid grid-cols-4 gap-5 my-12'>
				<div className='flex col-span-4 lg:col-span-2 items-center flex-wrap lg:flex-nowrap'>
					<div className='flex-shrink-0 text-sky-600 text-6xl font-semibold lg:border-r-2 border-r-black py-3 pr-3'>
						{category.edges[0].node.name}
					</div>
					<div className='text-lg md:text-base font-medium tracking-wider lg:pl-5'>
						Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam ut porttitor
					</div>
				</div>
			</div>
			<FeaturedCategory myArticles={posts.edges} myCategory={category.edges[0].node.name} />
			<ArticleFilterBar myMenu={filterMenu !== null ? filterMenu : filterTabs} myCategory={category.edges[0].node.name} onFilter={filter} />
			<ArticleGrid myArticles={filteredArticles || articles || posts.edges} myCategory={category.edges[0].node.name} pageInfo={posts.pageInfo}/>
			<div className='flex justify-center mb-12'>
				{hasNextPage ?
					<div className='text-xl cursor-pointer' as="div" onClick={() => loadMoreArticles()}>
						{loadingMoreArticles ? 
							<div>
								Loading more articles...
							</div>
						:
							<div>
								Load More
							</div>
						}
					</div>
				:
					<div className='text-xl cursor-pointer'>
						No more articles in this category.
					</div>
				}
			</div>
			<Footer myMenu={navigationMenus} />
		</>
	)
}

export async function getStaticProps({ params, preview = false}) {
	const data = await getPropsForCategory(params.slug, 24)
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

	// Let's make sure this category exists. If not, 404
	if (!data.categoryName.edges[0]) {
		return {
			notFound: true
		}
	}

	return {
		props: {
			preview,
			posts: data?.posts,
			category: data?.categoryName,
			categorySlug: params.slug,
			// A little data massaging to match shape of filterTabs and catch categories without specified menus
			filterMenu: data?.filterMenu?.nodes[0]?.menuItems.nodes || null,
			navigationMenus: navigationMenus
		},
        revalidate: 1
	}
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

// Generate all paths?
const allPaths = false

export async function getStaticPaths() {
    let data = []
    if (allPaths) {
        data = await getAllCategories() // Generates all articles statically
	} else {
        data = await getCategories() // Generates only a few articles, rest loaded on demand, either on client or server depending on fallback property below
		data = data?.edges
	}
	
	return {
		paths: data?.map(({ node }) => `/category/${node.slug}`) || [],
		fallback: 'blocking',
	}
}