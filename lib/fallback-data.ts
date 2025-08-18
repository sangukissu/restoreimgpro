// Fallback data for when network requests fail
export const fallbackBlogPosts = [
  {
    id: "fallback-1",
    title: "How to Restore Old Family Photos: A Complete Guide",
    excerpt: "Learn the essential techniques and tools for bringing your precious family memories back to life with our comprehensive photo restoration guide.",
    content: "Photo restoration is an art that combines technical skill with emotional care...",
    slug: "how-to-restore-old-family-photos",
    date: "2024-01-15T10:00:00Z",
    modified: "2024-01-15T10:00:00Z",
    author: {
      node: {
        name: "BringBack Team",
        avatar: {
          url: "/placeholder.svg?height=40&width=40&text=Author"
        }
      }
    },
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=600&text=Photo+Restoration+Guide",
        altText: "Photo restoration guide"
      }
    },
    categories: {
      nodes: [
        {
          name: "Tutorials",
          slug: "tutorials"
        }
      ]
    }
  },
  {
    id: "fallback-2",
    title: "5 Common Photo Damage Types and How to Fix Them",
    excerpt: "Discover the most common types of photo damage including tears, fading, water damage, and scratches, plus professional tips for restoration.",
    content: "Photos can suffer from various types of damage over time...",
    slug: "common-photo-damage-types",
    date: "2024-01-10T14:30:00Z",
    modified: "2024-01-10T14:30:00Z",
    author: {
      node: {
        name: "BringBack Team",
        avatar: {
          url: "/placeholder.svg?height=40&width=40&text=Author"
        }
      }
    },
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=600&text=Photo+Damage+Types",
        altText: "Common photo damage types"
      }
    },
    categories: {
      nodes: [
        {
          name: "Tips",
          slug: "tips"
        }
      ]
    }
  },
  {
    id: "fallback-3",
    title: "Preserving Your Digital Memories for Future Generations",
    excerpt: "Learn best practices for storing and organizing your restored photos to ensure they last for generations to come.",
    content: "Digital preservation is crucial for maintaining your restored photos...",
    slug: "preserving-digital-memories",
    date: "2024-01-05T09:15:00Z",
    modified: "2024-01-05T09:15:00Z",
    author: {
      node: {
        name: "BringBack Team",
        avatar: {
          url: "/placeholder.svg?height=40&width=40&text=Author"
        }
      }
    },
    featuredImage: {
      node: {
        sourceUrl: "/placeholder.svg?height=400&width=600&text=Digital+Preservation",
        altText: "Digital photo preservation"
      }
    },
    categories: {
      nodes: [
        {
          name: "Preservation",
          slug: "preservation"
        }
      ]
    }
  }
];

// Offline detection utility
export function isOnline(): boolean {
  if (typeof navigator !== 'undefined') {
    return navigator.onLine;
  }
  return true; // Assume online on server
}