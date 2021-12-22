import { InView } from 'react-intersection-observer'
import { getPropsForCategory, getAllCategories, getPostsByCategory, getPrimaryMenu } from '../../lib/api'
import Header from '../../components/header'
import FeaturedCategory from '../../components/featured-category'
import ArticleGrid from '../../components/article-grid'
import ArticleFilterBar from '../../components/article-filter-bar'
import { useState } from 'react'
import styles from './category.module.css'

export default function Categories({ posts, category, categorySlug, filterMenu, primaryNav }) {
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
		const data = await getPostsByCategory(categorySlug, 24, endCursor || posts?.pageInfo.endCursor)
		data && setLoadingMoreArticles(false)
		setEndCursor(data?.posts.pageInfo.endCursor)
		setHasNextPage(data?.posts.pageInfo.hasNextPage)
		setArticles(articles ? articles.concat(data?.posts.edges) : posts?.edges.concat(data?.posts.edges))
	}

	return (
		<>  
			<Header menu={primaryNav}/>
			<div className="container">
				<div className="row">
					<div className="col-2">
						<div className={styles.mainCategoryWrapper}>
							<div className={styles.mainCategory}>
								{category.edges[0].node.name}
							</div>
							<div className={styles.mainCategoryDescription}>
								Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam ut porttitor
							</div>
						</div>
					</div>
				</div>
			</div>
			<FeaturedCategory myArticles={posts.edges} myCategory={category.edges[0].node.name} />
			<ArticleFilterBar myMenu={filterMenu !== null ? filterMenu : filterTabs} myCategory={category.edges[0].node.name} onFilter={filter} />
			<ArticleGrid myArticles={filteredArticles || articles || posts.edges} myCategory={category.edges[0].node.name} pageInfo={posts.pageInfo}/>
			<div className={styles.loadArticlesStatus}>
				{hasNextPage ?
					<InView as="div" onChange={() => loadMoreArticles()}>
						{loadingMoreArticles ? 
							<div>
								Loading more articles...
							</div>
							:
							<div></div>
						}
					</InView>
				:
					<div>
						No articles in this category.
					</div>
				}
			</div>
		</>
	)
}

export async function getStaticProps({ params, preview = false}) {
	const data = await getPropsForCategory(params.slug, 36)
	const primaryNav = await getPrimaryMenu()

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
			primaryNav: primaryNav?.primaryNavMenu
		},
	}
}

export async function getStaticPaths() {
	let data = []
    let endCursor = null
    let hasNextPage = true
    do {
        let res = await getAllCategories(endCursor || null)
        endCursor = await res?.pageInfo.endCursor
        hasNextPage = await res?.pageInfo.hasNextPage
        data.push(...res.edges)
    } while (hasNextPage)
	
	return {
		paths: data.map(({ node }) => `/categories/${node.slug}`) || [],
		fallback: false,
	}
}