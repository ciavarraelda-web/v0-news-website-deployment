// app/api/news/route.js
export async function GET() {
  const data = await fetchNewsData();
  
  return NextResponse.json(data, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=59'
    }
  });
}
