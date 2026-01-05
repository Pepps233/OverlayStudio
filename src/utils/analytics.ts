import { supabase } from '@/lib/supabase';

// Generate a browser fingerprint for rate limiting
function getBrowserFingerprint(): string {
  if (typeof window === 'undefined') return 'server';
  
  // Check if we have a stored fingerprint
  const stored = localStorage.getItem('browser_fingerprint');
  if (stored) return stored;
  
  // Generate a simple fingerprint based on browser characteristics
  const fingerprint = btoa(
    [
      navigator.userAgent,
      navigator.language,
      new Date().getTimezoneOffset(),
      screen.width,
      screen.height,
      screen.colorDepth,
    ].join('|')
  ).substring(0, 64);
  
  // Store it for future use
  localStorage.setItem('browser_fingerprint', fingerprint);
  return fingerprint;
}

// Check rate limit using localStorage (client-side)
function checkClientRateLimit(): boolean {
  const fingerprint = getBrowserFingerprint();
  const key = `rate_limit_${fingerprint}`;
  const now = Date.now();
  const tenMinutes = 10 * 60 * 1000;
  
  // Get stored timestamps
  const stored = localStorage.getItem(key);
  let timestamps: number[] = stored ? JSON.parse(stored) : [];
  
  // Remove timestamps older than 10 minutes
  timestamps = timestamps.filter(ts => now - ts < tenMinutes);
  
  // Check if under limit
  if (timestamps.length >= 5) {
    console.log('Rate limit reached: 5 downloads per 10 minutes');
    return false;
  }
  
  // Add current timestamp
  timestamps.push(now);
  localStorage.setItem(key, JSON.stringify(timestamps));
  
  return true;
}

// Track download activity
export async function trackDownload(format: 'png' | 'jpeg'): Promise<void> {
  try {
    // Check client-side rate limit first
    if (!checkClientRateLimit()) {
      console.log('Download tracked locally but not sent to server (rate limited)');
      return;
    }
    
    const fingerprint = getBrowserFingerprint();
    
    // Check server-side rate limit
    const { data: canInsert } = await supabase.rpc('check_rate_limit', {
      p_browser_fingerprint: fingerprint
    });
    
    if (!canInsert) {
      console.log('Server rate limit reached');
      return;
    }
    
    // Track the download
    const { error } = await supabase
      .from('activities')
      .insert({
        usage: 1,
        browser_fingerprint: fingerprint,
        export_format: format,
        user_agent: navigator.userAgent,
      });
    
    if (error) {
      console.error('Failed to track download:', error);
    } else {
      console.log(`Download tracked: ${format}`);
    }
  } catch (error) {
    console.error('Analytics error:', error);
    // Silently fail - don't block the download
  }
}

// Get download statistics (optional - for admin dashboard)
export async function getDownloadStats() {
  try {
    const { data, error } = await supabase
      .from('download_stats')
      .select('*')
      .order('download_date', { ascending: false })
      .limit(30);
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Failed to fetch stats:', error);
    return null;
  }
}
