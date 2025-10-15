import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  source: string;
  description?: string;
}

async function fetchRSSFeed(url: string, sourceName: string): Promise<NewsItem[]> {
  try {
    const response = await fetch(url);
    const text = await response.text();
    
    // Parse RSS XML
    const items: NewsItem[] = [];
    const itemRegex = /<item>(.*?)<\/item>/gs;
    const matches = text.matchAll(itemRegex);
    
    for (const match of matches) {
      const itemXml = match[1];
      const title = itemXml.match(/<title>(.*?)<\/title>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim() || '';
      const link = itemXml.match(/<link>(.*?)<\/link>/s)?.[1]?.trim() || '';
      const pubDate = itemXml.match(/<pubDate>(.*?)<\/pubDate>/s)?.[1]?.trim() || '';
      const description = itemXml.match(/<description>(.*?)<\/description>/s)?.[1]?.replace(/<!\[CDATA\[(.*?)\]\]>/s, '$1').trim() || '';
      
      if (title && link) {
        items.push({
          title: title.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>'),
          link,
          pubDate,
          source: sourceName,
          description: description.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/<[^>]*>/g, '').substring(0, 200)
        });
      }
    }
    
    return items;
  } catch (error) {
    console.error(`Error fetching ${sourceName}:`, error);
    return [];
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Fetching cybersecurity news from multiple sources...');

    // Fetch from multiple cybersecurity RSS feeds
    const [threatPost, bleepingComputer, theHackerNews, krebs] = await Promise.all([
      fetchRSSFeed('https://threatpost.com/feed/', 'ThreatPost'),
      fetchRSSFeed('https://www.bleepingcomputer.com/feed/', 'BleepingComputer'),
      fetchRSSFeed('https://thehackernews.com/feeds/posts/default', 'The Hacker News'),
      fetchRSSFeed('https://krebsonsecurity.com/feed/', 'Krebs on Security')
    ]);

    // Combine and sort by date
    const allNews = [...threatPost, ...bleepingComputer, ...theHackerNews, ...krebs]
      .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
      .slice(0, 20); // Get latest 20 articles

    console.log(`Successfully fetched ${allNews.length} news items`);

    return new Response(
      JSON.stringify({ news: allNews }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in fetch-security-news function:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
