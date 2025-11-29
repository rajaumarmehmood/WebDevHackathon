import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

// GET - Fetch user's interview preps
export async function GET() {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data, error } = await supabase
      .from('interview_preps')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ preps: data });
  } catch (error) {
    console.error('Error fetching interview preps:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST - Save interview prep
export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { company, role, technologies, prepMaterial } = await request.json();

    const { data, error } = await supabase
      .from('interview_preps')
      .insert({
        user_id: user.id,
        company,
        role,
        technologies,
        prep_material: prepMaterial,
      })
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ prep: data });
  } catch (error) {
    console.error('Error saving interview prep:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
