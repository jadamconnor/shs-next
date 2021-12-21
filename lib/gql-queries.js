import { gql } from 'graphql-request'

export const morePostsQuery = gql`
    query ($slug: String!, $batchSize: Int, $endCursor: String) {
    posts(first: $batchSize, after: $endCursor, where: {categoryName: $slug}) {
        pageInfo {
            hasNextPage
            endCursor
        }
        edges {
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
}`