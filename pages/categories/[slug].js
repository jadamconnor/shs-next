import { useRouter } from 'next/router'
import ErrorPage from 'next/error'
import { getAllCategories, getPostsByCategory, getMorePostsByCategory, getCategoryNameFromSlug, getMenuFromSlug } from '../../lib/api'
import FeaturedCategory from '../../components/featured-category'
import ArticleGrid from '../../components/article-grid'
import ArticleFilterBar from '../../components/article-filter-bar'
import { useState } from 'react'
import styles from './category.module.css'

export default function Categories({ posts, category, categorySlug, filterMenu }) {
    const categories = []
	const [filteredArticles, setFilteredArticles] = useState(false)
	const [endCursor, setEndCursor] = useState(null)
	const [hasNextPage, setHasNextPage] = useState(true)
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
			setFilteredArticles(posts?.edges)
		} else {
			posts?.edges.forEach(el => {
				el.node.categories.edges.forEach(e => {
					e.node.name === cat && arr.push(el)
				})
			})
			setFilteredArticles(arr)
		}
	}
	async function loadMoreArticles() {
		const headers = { 'Content-Type': 'application/json' }
		const query = 
		`query ($slug: String!, $batchSize: Int, $endCursor: String) {
			morePosts: posts(first: $batchSize, after: $endCursor, where: {categoryName: $slug}) {
			  pageInfo {
				hasNextPage
				endCursor
			  }
			  edges {
				cursor
				node {
				  id
				  categories {
					edges {
					  node {
						name
						slug
						id
					  }
					}
				  }
				  date
				  featuredImage {
					node {
					  sourceUrl(size: MEDIUM)
					  altText
					}
				  }
				  slug
				  title
				}
			  }
			}
		  }
		`
		const variables = {slug:categorySlug, batchSize:24, endCursor: endCursor || posts?.pageInfo.endCursor}
		const res = await fetch('http://localhost:10083/graphql', {
			method: 'POST',
			headers,
			body: JSON.stringify({
				query,
				variables
			}
			),
		  })
		  const json = await res.json()
		  if (json.errors) {
			console.error(json.errors)
			throw new Error('Failed to fetch API')
		  }
		  console.log(json?.data)
		  setEndCursor(json?.data.morePosts.pageInfo.endCursor)
		  setHasNextPage(json?.data.morePosts.pageInfo.hasNextPage)
		  setFilteredArticles(filteredArticles ? filteredArticles.concat(json?.data.morePosts.edges) : posts?.edges.concat(json?.data.morePosts.edges))
	}
	const router = useRouter()
	if (!router.isFallback && !posts?.edges) {
	  return <ErrorPage statusCode={404} />
	}
	return (
		router.isFallback ? (
			<div>Loading…</div>
		) : (
			<>
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
				<ArticleGrid onLoadMore={loadMoreArticles} myArticles={filteredArticles || posts.edges} myCategory={category} pageInfo={posts.pageInfo}/>

                {hasNextPage ?
                    <div onClick={loadMoreArticles}>
                        Load More
                    </div>
                    :
                    <div>
                        No More
                    </div>
                }
			</>
		)
	)
}

export async function getStaticProps({ params, preview = false, previewData }) {
	const data = await getPostsByCategory(params.slug, 12)
	const category = await getCategoryNameFromSlug(params.slug)
	const menu = await getMenuFromSlug(params.slug)
	return {
		props: {
			preview,
			posts: data?.posts,
			category: category,
			categorySlug: params.slug,
			filterMenu: menu
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