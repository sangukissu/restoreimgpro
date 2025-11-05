export default function Head() {
  return (
    <>
      <title>Login - BringBack | Sign in to restore photos</title>
      <meta
        name="description"
        content="Sign in to BringBack to start restoring and enhancing your photos securely."
      />
      <meta name="robots" content="noindex, nofollow" />

      {/* Open Graph */}
      <meta property="og:title" content="Login - BringBack" />
      <meta
        property="og:description"
        content="Sign in to BringBack to start restoring and enhancing your photos securely."
      />
      <meta property="og:type" content="website" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary" />
      <meta name="twitter:title" content="Login - BringBack" />
      <meta
        name="twitter:description"
        content="Sign in to BringBack to start restoring and enhancing your photos securely."
      />

      {/* JSON-LD Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Login",
            description: "Sign in to BringBack to start restoring photos",
            isPartOf: { "@type": "WebSite", name: "BringBack" },
          }),
        }}
      />
    </>
  )
}