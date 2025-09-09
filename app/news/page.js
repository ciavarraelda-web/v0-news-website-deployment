// app/news/page.js
export async function generateStaticParams() {
  return [{ category: 'crypto' }, { category: 'blockchain' }];
}

export async function generateMetadata({ params }) {
  return {
    title: `${params.category} News - CryptoICO EU`,
    description: `Latest ${params.category} news and updates`
  };
}
