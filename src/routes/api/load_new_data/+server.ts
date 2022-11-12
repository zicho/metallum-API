import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';
import { json, type RequestEvent } from '@sveltejs/kit';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/** @type {import('./$types').RequestHandler} */
export async function GET({ url } : RequestEvent ) {

	const name = url.searchParams.get('name') ?? '';
	const genre = url.searchParams.get('genre') ?? '';
	const location = url.searchParams.get('location') ?? '';
	const country = url.searchParams.get('country') ?? '';
	const status = url.searchParams.get('status') ?? '';

	console.dir(name)
	console.dir(genre)
	console.dir(location)
	console.dir(country)
	console.dir(status)

	let  { data, error } = await supabase.from('bands')
		.select()
		.ilike('name', `%${name}%`)
		.ilike('genre', `%${genre}%`)
		.ilike('location', `%${location}%`)
		.ilike('country', `%${country}%`)
		.ilike('status', `%${status}%`);

	console.dir("Results: " + data?.length)

	return json(data);
};

