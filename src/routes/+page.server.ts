import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	let response = await supabase.from('bands').select();
	return { data: response.data };
}
