import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Get total count of all downloads (both PNG and JPEG)
    const { count, error } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true });

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json({ count: 0 }, { status: 200 });
    }

    return NextResponse.json({ count: count || 0 }, { status: 200 });
  } catch (error) {
    console.error('Stats API error:', error);
    return NextResponse.json({ count: 0 }, { status: 200 });
  }
}
