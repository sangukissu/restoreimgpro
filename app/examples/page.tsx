// /app/examples/page.tsx
import { allPseoPages } from '@/lib/generate-pages';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import  Header from '@/components/header';
import Footer from '@/components/footer';

export default function ExamplesPage() {
  return (
    <>
      <Header />
      <main className="container mx-auto px-4 pt-30">
        <h1 className="text-4xl font-bold mb-8 text-center">Use Cases & Examples</h1>
        <p className="text-lg text-muted-foreground mb-12 text-center max-w-3xl mx-auto">
          Explore the many ways our AI can restore your photos. Each example below links to a dedicated page with more details.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {allPseoPages.map((page) => (
            <Link key={page.slug} href={`/restore/${page.slug}`} passHref>
              <Card className="h-full">
                <CardHeader>
                  <CardTitle className="text-lg">{page.h1}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{page.metaDescription}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </>
  );
}