interface WordPressPost {
  id: string
  title: string
  excerpt: string
  content: string
  slug: string
  date: string
  modified: string
  author: {
    node: {
      name: string
      avatar: {
        url: string
      }
    }
  }
  featuredImage: {
    node: {
      sourceUrl: string
      altText: string
    }
  } | null
  categories: {
    nodes: Array<{
      name: string
      slug: string
    }>
  }
}

interface WordPressResponse {
  data: {
    posts: {
      nodes: WordPressPost[]
      pageInfo: {
        hasNextPage: boolean
        hasPreviousPage: boolean
        startCursor: string
        endCursor: string
      }
    }
  }
}

interface WordPressSinglePostResponse {
  data: {
    post: WordPressPost | null
  }
}

const WORDPRESS_GRAPHQL_URL = 'https://blog.bringback.pro/graphql'

// GraphQL query to fetch all posts
const GET_POSTS_QUERY = `
  query GetPosts($first: Int, $after: String) {
    posts(first: $first, after: $after, where: { status: PUBLISH }) {
      nodes {
        id
        title
        excerpt
        content
        slug
        date
        modified
        author {
          node {
            name
            avatar {
              url
            }
          }
        }
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`

// GraphQL query to fetch a single post by slug
const GET_POST_BY_SLUG_QUERY = `
  query GetPostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      title
      content
      excerpt
      slug
      date
      modified
      author {
        node {
          name
          avatar {
            url
          }
        }
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
    }
  }
`

// GraphQL query to get all post slugs for static generation
const GET_ALL_SLUGS_QUERY = `
  query GetAllSlugs {
    posts(first: 1000, where: { status: PUBLISH }) {
      nodes {
        slug
      }
    }
  }
`

// Helper function to make GraphQL requests
async function fetchGraphQL(query: string, variables: Record<string, any> = {}) {
  try {
    const response = await fetch(WORDPRESS_GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables,
      }),
      next: {
        revalidate: 300, // Revalidate every 5 minutes
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const json = await response.json()
    
    if (json.errors) {
      console.error('GraphQL errors:', json.errors)
      throw new Error('GraphQL query failed')
    }

    return json
  } catch (error) {
    console.error('WordPress API error:', error)
    throw error
  }
}

// Fetch all published posts
export async function getAllPosts(first: number = 10, after?: string): Promise<{
  posts: WordPressPost[]
  pageInfo: {
    hasNextPage: boolean
    hasPreviousPage: boolean
    startCursor: string
    endCursor: string
  }
}> {
  const response: WordPressResponse = await fetchGraphQL(GET_POSTS_QUERY, {
    first,
    after,
  })

  return {
    posts: response.data.posts.nodes,
    pageInfo: response.data.posts.pageInfo,
  }
}

// Fetch a single post by slug
export async function getPostBySlug(slug: string): Promise<WordPressPost | null> {
  const response: WordPressSinglePostResponse = await fetchGraphQL(GET_POST_BY_SLUG_QUERY, {
    slug,
  })

  return response.data.post
}

// Get all post slugs for static generation
export async function getAllPostSlugs(): Promise<string[]> {
  const response = await fetchGraphQL(GET_ALL_SLUGS_QUERY)
  return response.data.posts.nodes.map((post: { slug: string }) => post.slug)
}

// Helper function to format WordPress date
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

// Helper function to calculate reading time
export function calculateReadingTime(content: string): string {
  if (!content) return '1 min read'
  const wordsPerMinute = 200
  const textContent = content.replace(/<[^>]*>/g, '') // Strip HTML tags
  const wordCount = textContent.split(/\s+/).length
  const readingTime = Math.ceil(wordCount / wordsPerMinute)
  return `${readingTime} min read`
}

// Helper function to extract excerpt from content if not provided
export function extractExcerpt(content: string, length: number = 160): string {
  if (!content) return ''
  const textContent = content.replace(/<[^>]*>/g, '') // Strip HTML tags
  return textContent.length > length 
    ? textContent.substring(0, length).trim() + '...'
    : textContent
}

export type { WordPressPost }