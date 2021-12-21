import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { InView } from 'react-intersection-observer'
import { getAllCategories, getPostsByCategory, getCategoryNameFromSlug, getMenuFromSlug, getPrimaryMenu } from '../../lib/api'
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

	const router = useRouter()
	if (!router.isFallback && !posts?.edges) {
	  return <ErrorPage statusCode={404} />
	}

	return (
		router.isFallback ? 
		<>
			<div>Loading…</div>
		</>
		: 
			<>   
				<Header menu={primaryNav}/>
				<div className="container">
					<div className="row">
						<div className="col-2">
							<div className={styles.mainCategoryWrapper}>
								<div className={styles.mainCategory}>
									{category}
								</div>
								<div className={styles.mainCategoryDescription}>
									Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aliquam ut porttitor
								</div>
							</div>
						</div>
					</div>
				</div>
				<FeaturedCategory myArticles={posts.edges} myCategory={category} />
				<ArticleFilterBar myMenu={filterMenu !== null ? filterMenu.menuItems.nodes : filterTabs} myCategory={category} onFilter={filter} />
				<ArticleGrid myArticles={filteredArticles || articles || posts.edges} myCategory={category} pageInfo={posts.pageInfo}/>
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
							You've reached the end of articles in this category.
						</div>
					}
				</div>
			</>
	)
}

export async function getStaticProps({ params, preview = false, previewData }) {
	const data = await getPostsByCategory(params.slug, 36)
	const category = await getCategoryNameFromSlug(params.slug)
	const menu = await getMenuFromSlug(params.slug)
	const nav = await getPrimaryMenu()
	return {
		props: {
			preview,
			posts: data?.posts,
			category: category,
			categorySlug: params.slug,
			filterMenu: menu,
			primaryNav: nav
		},
	}
}

export async function getStaticPaths() {
	const allCategories = await getAllCategories()
	
	return {
		paths: allCategories.edges.filter((node) => node.count > 0).map(({ node }) => `/categories/${node.slug}`) || [],
		fallback: true,
	}
}