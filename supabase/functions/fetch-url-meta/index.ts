const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string' || !url.startsWith('http')) {
      return new Response(JSON.stringify({ error: 'Invalid URL' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return new Response(JSON.stringify({ name: '', description: '', thumbnailUrl: '', category: 'Allgemein' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeutLicht/1.0)', Accept: 'text/html,application/xhtml+xml' },
      redirect: 'follow',
      signal: AbortSignal.timeout(8000),
    });

    const html = await res.text();

    const getMeta = (prop: string): string => {
      const ogMatch = html.match(new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)`, 'i'));
      if (ogMatch?.[1]) return ogMatch[1].trim();
      const nameMatch = html.match(new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)`, 'i'));
      if (nameMatch?.[1]) return nameMatch[1].trim();
      // Also try content before property/name
      const altOg = html.match(new RegExp(`<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:${prop}["']`, 'i'));
      if (altOg?.[1]) return altOg[1].trim();
      return '';
    };

    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const titleTag = titleMatch?.[1]?.trim() ?? '';

    // Favicon fallback
    const faviconMatch = html.match(/<link[^>]+rel=["'](?:shortcut )?icon["'][^>]+href=["']([^"']+)["']/i);
    let faviconUrl = faviconMatch?.[1] ?? '';
    if (faviconUrl && !faviconUrl.startsWith('http')) {
      faviconUrl = faviconUrl.startsWith('/') ? parsedUrl.origin + faviconUrl : parsedUrl.origin + '/' + faviconUrl;
    }

    const rawTitle = getMeta('title') || titleTag;
    const rawDescription = getMeta('description');
    const rawImage = getMeta('image');
    const siteName = getMeta('site_name');

    // Ensure image URL is absolute
    let thumbnailUrl = rawImage || faviconUrl || '';
    if (thumbnailUrl && !thumbnailUrl.startsWith('http')) {
      thumbnailUrl = thumbnailUrl.startsWith('/') ? parsedUrl.origin + thumbnailUrl : parsedUrl.origin + '/' + thumbnailUrl;
    }

    // Auto-detect category
    const detectCategory = (text: string): string => {
      const lower = text.toLowerCase();
      if (lower.includes('metall') || lower.includes('laser') || lower.includes('stahl')) return 'Metallbau';
      if (lower.includes('restaurant') || lower.includes('gastro') || lower.includes('café') || lower.includes('cafe')) return 'Gastronomie';
      if (lower.includes('handwerk') || lower.includes('bau') || lower.includes('sanierung') || lower.includes('renovier')) return 'Handwerk';
      if (lower.includes('salon') || lower.includes('beauty') || lower.includes('friseur') || lower.includes('kosmetik')) return 'Beauty';
      if (lower.includes('arzt') || lower.includes('praxis') || lower.includes('medizin') || lower.includes('therapie')) return 'Medizin';
      if (lower.includes('shop') || lower.includes('store') || lower.includes('kaufen') || lower.includes('bestellen')) return 'E-Commerce';
      if (lower.includes('beratung') || lower.includes('agentur') || lower.includes('consulting')) return 'Dienstleistung';
      return 'Allgemein';
    };

    return new Response(JSON.stringify({
      name: rawTitle || siteName || '',
      description: rawDescription || '',
      thumbnailUrl,
      category: detectCategory(rawTitle + ' ' + rawDescription),
      siteName: siteName || '',
      fetchedAt: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({
      error: 'Fetch failed',
      message: error.message,
      name: '',
      description: '',
      thumbnailUrl: '',
      category: 'Allgemein',
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
