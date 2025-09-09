// app/api/health/route.js
export async function GET() {
  const services = {
    newsapi: await checkService('https://newsapi.org'),
    newsdata: await checkService('https://newsdata.io'),
    coinapi: await checkService('https://rest.coinapi.io'),
    website: true
  };

  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    services
  });
}
