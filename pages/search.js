import Router from 'next/router'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { getSearchResults } from '../lib/api'
import ArticleGrid from '../components/article-grid'

export default function Search( { data }) {
    const searchQueryString = process.browser ? ( Router?.query?.s ?? '' ) : ''
    const [ searchQuery, setSearchQuery ] = useState( searchQueryString )
    const [ searchError, setSearchError ] = useState( '' )
    const [ queryResultPosts, setQueryResultPosts  ] = useState( {} )
    const [ showResultInfo, setShowResultInfo ] = useState( false )

    async function fetchPosts(first, after, query) {
        data = null
        try {
            data = await getSearchResults(first, after, query)
        } catch (e) {
            console.error(e)
        } finally {
            setQueryResultPosts( data?.posts ?? {} )
            setShowResultInfo( true )
        }
    }

    const handleSearchFormSubmit = ( event ) => {
        event.preventDefault()
        setShowResultInfo( false )
        
        if ( isEmpty( searchQuery ) ) {
            setSearchError( 'Please enter text to search' )
            setQueryResultPosts( {} )
            return null
        }
        
        setSearchError( '' )
        
        fetchPosts({
            first: null,
            after: null,
            query: searchQuery
        })
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
        
    }, [ searchQueryString, fetchPosts ] )
    
    const totalPostResultCount =  queryResultPosts?.pageInfo?.offsetPagination?.total

    return (
        <>
            <div className='container text-2xl my-12'>
                Work in Progress
            </div>
            <div className='container px-5 md:px-0 mb-12'>
                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                    {queryResultPosts?.edges?.map((el, index) => (
                        <div key={el.node.id}>
                            {(index !== 0 && index % 7 === 0) ?
                                <div className='bg-gray-200 h-72' key={index}>
                                    AD
                                </div>
                            :
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
                            }
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}