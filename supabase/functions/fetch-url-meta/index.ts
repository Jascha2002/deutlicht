import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  // Auth check
  const authHeader = req.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_ANON_KEY')!,
    { global: { headers: { Authorization: authHeader } } }
  );

  const token = authHeader.replace('Bearer ', '');
  const { data: claimsData, error: claimsError } = await supabase.auth.getClaims(token);
  if (claimsError || !claimsData?.claims) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: corsHeaders });
  }

  try {
    const { url } = await req.json();
    if (!url || typeof url !== 'string') {
      return new Response(JSON.stringify({ error: 'Missing url' }), { status: 400, headers: corsHeaders });
    }

    // Basic URL validation
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
      if (!['http:', 'https:'].includes(parsedUrl.protocol)) {
        throw new Error('Invalid protocol');
      }
    } catch {
      return new Response(JSON.stringify({ title: '', description: '', thumbnailUrl: '' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; DeutLicht/1.0)' },
      redirect: 'follow',
    });
    const html = await res.text();

    const getOG = (prop: string) => {
      const match = html.match(
        new RegExp(`<meta[^>]+property=["']og:${prop}["'][^>]+content=["']([^"']+)`, 'i')
      );
      if (match) return match[1];
      // Try name attribute too
      const match2 = html.match(
        new RegExp(`<meta[^>]+name=["']${prop}["'][^>]+content=["']([^"']+)`, 'i')
      );
      return match2?.[1] ?? '';
    };

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);

    return new Response(JSON.stringify({
      title: getOG('title') || titleMatch?.[1]?.trim() || '',
      description: getOG('description') || '',
      thumbnailUrl: getOG('image') || '',
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (e) {
    return new Response(JSON.stringify({ title: '', description: '', thumbnailUrl: '' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
