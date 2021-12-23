const API_URL = process.env.NEXT_PUBLIC_WORDPRESS_API_URL

async function fetchAPI(query, { variables } = {}) {
  const headers = { 'Content-Type': 'application/json' }

  if (process.env.WORDPRESS_AUTH_REFRESH_TOKEN) {
    headers[
      'Authorization'
    ] = `Bearer ${process.env.WORDPRESS_AUTH_REFRESH_TOKEN}`
  }

  const res = await fetch(API_URL, {
    method: 'POST',
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  })

  const json = await res.json()
  if (json.errors) {
    console.error(json.errors)
    throw new Error('Failed to fetch API')
  }
  return json.data
}

export async function getPreviewPost(id, idType = 'DATABASE_ID') {
  const data = await fetchAPI(
    `
    query PreviewPost($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        databaseId
        slug
        status
      }
    }`,
    {
      variables: { id, idType },
    }
  )
  return data.post
}

export async function getPostsWithSlug(endCursor) {
  const data = await fetchAPI(`
        query ($endCursor: String) {
            posts(first: 100, after: $endCursor) {
                pageInfo {
                  hasNextPage
                  endCursor
                }
                edges {
                    node {
                        slug
                    }
                }
            }
        }`,
        {
            variables: { endCursor }
        }
  )
  return data?.posts
}

export async function getCategories(endCursor) {
    const data = await fetchAPI(`
        query ($endCursor: String) {
            categories(first: 100, after: $endCursor) {
                pageInfo {
                    hasNextPage
                    endCursor
                }
                edges {
                    node {
                        slug
                        count
                    }
                }
            }
        }`,
        {
            variables: { endCursor }
        }
    )
    return data?.categories
}

export async function getPrimaryMenu() {
    const data = await fetchAPI(`
    {
        primaryNavMenu: menus(where: {location: PRIMARY}) {
            nodes {
                menuItems {
                    nodes {
                        label
                        id
                    }
                }
            }
        }
    }`
    )
    return data
}

export async function getAllPostsForHome(preview) {
  const data = await fetchAPI(
    `
    query AllPosts {
      posts(first: 20, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            title
            excerpt
            slug
            date
            featuredImage {
              node {
                sourceUrl
              }
            }
            author {
              node {
                name
                firstName
                lastName
                avatar {
                  url
                }
              }
            }
          }
        }
      }
    }
  `,
    {
      variables: {
        onlyEnabled: !preview,
        preview,
      },
    }
  )
  return data?.posts
}

export async function getPostAndMorePosts(slug, preview, previewData) {
  const postPreview = preview && previewData?.post
  // The slug may be the id of an unpublished post
  const isId = Number.isInteger(Number(slug))
  const isSamePost = isId
    ? Number(slug) === postPreview.id
    : slug === postPreview.slug
  const isDraft = isSamePost && postPreview?.status === 'draft'
  const isRevision = isSamePost && postPreview?.status === 'publish'
  const data = await fetchAPI(
    `
    fragment AuthorFields on User {
      name
      firstName
      lastName
      avatar {
        url
      }
    }
    fragment PostFields on Post {
      title
      excerpt
      slug
      date
      featuredImage {
        node {
          sourceUrl
        }
      }
      author {
        node {
          ...AuthorFields
        }
      }
      categories {
        edges {
          node {
            name
          }
        }
      }
      tags {
        edges {
          node {
            name
          }
        }
      }
    }
    query PostBySlug($id: ID!, $idType: PostIdType!) {
      post(id: $id, idType: $idType) {
        ...PostFields
        content
        ${
          // Only some of the fields of a revision are considered as there are some inconsistencies
          isRevision
            ? `
        revisions(first: 1, where: { orderby: { field: MODIFIED, order: DESC } }) {
          edges {
            node {
              title
              excerpt
              content
              author {
                node {
                  ...AuthorFields
                }
              }
            }
          }
        }
        `
            : ''
        }
      }
      posts(first: 3, where: { orderby: { field: DATE, order: DESC } }) {
        edges {
          node {
            ...PostFields
          }
        }
      }
    }
  `,
    {
      variables: {
        id: isDraft ? postPreview.id : slug,
        idType: isDraft ? 'DATABASE_ID' : 'SLUG',
      },
    }
  )

  // Draft posts may not have an slug
  if (isDraft) data.post.slug = postPreview.id
  // Apply a revision (changes in a published post)
  if (isRevision && data.post.revisions) {
    const revision = data.post.revisions.edges[0]?.node

    if (revision) Object.assign(data.post, revision)
    delete data.post.revisions
  }

  // Filter out the main post
  data.posts.edges = data.posts.edges.filter(({ node }) => node.slug !== slug)
  // If there are still 3 posts, remove the last one
  if (data.posts.edges.length > 2) data.posts.edges.pop()
  return data
}

export async function getPostsByCategory(slug, batchSize, endCursor) {
  const data = await fetchAPI(
    `
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
    }
  `,
    {
      variables: { slug, batchSize, endCursor },
    }
  )
  return data
}

export async function getPropsForCategory(slug, batchSize, endCursor) {
    const data = await fetchAPI(`
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
            filterMenu: menus(where: {slug: $slug}) {
                nodes {
                    name
                    menuItems {
                        nodes {
                            label
                        }
                    }
                }
            }
            categoryName: categories(where: {slug: [$slug]}) {
                edges {
                    node {
                        name
                    }
                }
            }
        }
      
    `,
      {
        variables: { slug, batchSize, endCursor },
      }
    )
    return data
  }

  export async function getMenuByLocation(location) {
    const data = await fetchAPI(`
        query ($location: MenuLocationEnum) {
            menus(where: {location: $location}) {
                nodes {
                    name
                    id
                    menuItems(first: 100) {
                        nodes {
                            label
                            id
                        }
                    }
                }
            }
        }`,
        {
            variables: { location }
        }
    )
    return data
  }