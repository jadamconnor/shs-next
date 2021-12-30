import Router from 'next/router'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getSearchResults, getMenuBySlug } from '../lib/api'
import Header from '../components/header'
import Footer from '../components/footer'
import SearchForm from '../components/search-form'
import { isEmpty } from '../lib/utils'

export default function Search({ data, navigationMenus, slug }) {
    const searchQueryString = process.browser ? ( Router?.query?.s ?? '' ) : ''
    const [ searchQuery, setSearchQuery ] = useState( searchQueryString )
    const [ searchError, setSearchError ] = useState( '' )
    const [ queryResultPosts, setQueryResultPosts  ] = useState( {} )
    const [ showResultInfo, setShowResultInfo ] = useState( false )
	const [loading, setLoading] = useState(false)


    async function getAllSearchResults(first, after, query) {
        let data = {
            posts: {
                edges: []
            }
        }
        let res = null
        let hasNextPage = true
        let pageCount = 0
        do {
            res = await getSearchResults(first, after || null, query)
            after = res.posts.pageInfo.endCursor
            hasNextPage = res.posts.pageInfo.hasNextPage
            data.posts.edges.push(...res.posts.edges)
            pageCount++
        } while (hasNextPage)
        return data
    }

    async function fetchPosts(first, after, query) {
        setLoading(true)
        data = null
        try {
            data = await getAllSearchResults(first, after, query)
        } catch (e) {
            console.error(e)
            setSearchError(e)
        } finally {
            setQueryResultPosts( data?.posts ?? {} )
            setShowResultInfo( true )
            setLoading(false)
        }
    }


    const handleSearchFormSubmit = ( event ) => {
        event.preventDefault()
        setShowResultInfo( false )
        
        if ( isEmpty( searchQuery ) ) {
            setSearchError( 'Please enter text to search.' )
            setQueryResultPosts( {} )
            return null
        }
        
        setSearchError( '' )
        
        fetchPosts(36, null, searchQuery)
    }

    useEffect( () => {
        /**
        * If the query params is set, set the searchQuery in the in
        * 1. Set the search input value to that query.
        * 2. Call fetchPosts to get the results as per the query string from query params.
        */
        if ( searchQueryString ) {
            setSearchQuery( searchQueryString )
            fetchPosts(36, null, searchQueryString)
        }
        
    }, [ searchQueryString ] )
    
    const totalPostResultCount =  queryResultPosts?.edges?.length

    return (
        <>
            <Header menu={navigationMenus} slug={slug} />
            <div className='flex justify-center px-5 md:px-0  my-12'>
                <SearchForm
                    searchQuery={ searchQuery }
                    setSearchQuery={ setSearchQuery }
                    handleSearchFormSubmit={handleSearchFormSubmit}
                    mode={'light'}
                />
            </div>
            {loading ?
                <div className='container h-[800px]'>
                    Loading...
                </div>
            :
                <>
                    <div className='container mb-12'>
                        <div className={showResultInfo ? 'container text-xl my-5' : 'hidden'}>
                            Your search returned {totalPostResultCount} articles...
                        </div>
                        <div className={searchError ? 'container text-xl my-5' : 'hidden'}>
                            {searchError}
                        </div>
                        <div className='grid grid-cols-1 px-5 md:px-0 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                            {queryResultPosts?.edges?.map((el) => (
                                <div key={el.node.id}>
                                    <div className='h-80'>
                                        {el.node.featuredImage &&
                                            <div className='relative h-44 mb-3'>
                                                <Image 
                                                    src={el.node.featuredImage.node.sourceUrl}
                                                    alt={el.node.featuredImage.node.altText}
                                                    objectFit='cover'
                                                    layout='fill'
                                                    placeholder='blur'
                                                    // Work-around for no out-of-box dataUrl
                                                    blurDataURL={`/_next/image?url=${el.node.featuredImage.node.sourceUrl}&w=16&q=1`}
                                                />
                                            </div>
                                        }
                                        <div>
                                            <div className='text-lg mb-3'>
                                                <a href={`../${el.node.slug}`}>
                                                    {el.node.title}
                                                </a>
                                            </div>
                                            <div className='text-sky-600'>
                                                {el.node.categories.edges.map((cat, index) => (
                                                    <span key={cat.node.id}>
                                                        <a className='text-base font-bold text-sky-600 hover:text-blue-500 uppercase tracking-wider' href={`../category/${cat.node.slug}`}>{cat.node.name}</a> {index < (el.node.categories.edges.length - 1) ? <span>| </span> : <span></span>}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </>
            }
            <Footer myMenu={navigationMenus}/>
        </>
    )
}

export async function getStaticProps({ params, preview = false, previewData }) {
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
            navigationMenus: navigationMenus,
            slug: 'search'
        }
    }
    
}