// import { json } from '@sveltejs/kit';
// import { launch } from 'puppeteer';
// import * as cheerio from 'cheerio';
// import { Band } from '../../../models/Band';
// import { createClient } from '@supabase/supabase-js';
// import { SUPABASE_URL, SUPABASE_ANON_KEY } from '$env/static/private';

// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// /** @type {import('./$types').RequestHandler} */
// export async function GET() {
// 	const browser = await launch();
// 	const [page] = await browser.pages();

// 	await page.goto('https://www.metal-archives.com/lists/SE', { waitUntil: 'networkidle0' });

// 	let data: string = '';

// 	let lastPageHit: boolean = false;
// 	let buttonHitCounter: number = 0;
// 	let pageCounter: number = 1;

// 	while (!lastPageHit) {
// 		process.stdout.write('Scraping page ' + pageCounter);
// 		data += (await page.evaluate(() => document.querySelector('*')?.outerHTML)) as string;

// 		// searching for the "next page disabled class" to know when to stop searching.
// 		// but for some reason this gets hit on the first loop as well so we work around that
// 		const nextBtnDisabled = await page.$('.paginate_button_disabled');

// 		if (nextBtnDisabled) {
// 			buttonHitCounter++;
// 		}

// 		if (buttonHitCounter == 2) {
// 			lastPageHit = true;
// 			process.stdout.write(', last page');
// 		} else {
// 			await page.click('#bandListCountry_next');
// 			await page.waitForNetworkIdle();
// 			pageCounter++;
// 		}

// 		process.stdout.write(' ...Done!\n');
// 	}

// 	await browser.close();

// 	var bands: Band[] = [];

// 	const $ = cheerio.load(data);

// 	$('tr').each((index, element) => {
// 		var name = $(element).find('td').eq(0).text();
// 		var url = $(element).find('td > a').eq(0).attr('href');
// 		var genre = $(element).find('td').eq(1).text();
// 		var location = $(element).find('td').eq(2).text();
// 		var status = $(element).find('td').eq(3).text();

// 		if (!name && !url && !genre && !location && !status) {
// 			// if we can find no info, we have probably parsed an invalid line. don't add it.
// 			return;
// 		}

// 		if (!name) name = 'Name not found';
// 		if (!url) url = '#';
// 		if (!genre) genre = 'Genre not found';
// 		if (!location) location = 'Location not found';
// 		if (!status) status = 'Status not found';

// 		bands.push(new Band(name, url, genre, location, status));
// 	});

//   await supabase.from('bands').insert(bands)

// 	return json(data);
// }
