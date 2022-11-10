import { launch } from 'puppeteer';

/** @type {import('./$types').PageServerLoad} */
export async function load() {
	const browser = await launch();
	const [page] = await browser.pages();

	await page.goto('https://www.metal-archives.com/lists/SE', { waitUntil: 'networkidle0' });

	let data: string = '';

	let lastPageHit: boolean = false;
	let buttonHitCounter: number = 0;
    let pageCounter: number = 1;

	while (!lastPageHit) {
        process.stdout.write("Scraping page " + (pageCounter))
		data += (await page.evaluate(() => document.querySelector('*')?.outerHTML)) as string;

		// searching for the "next page disabled class" to know when to stop searching.
		// but for some reason this gets hit on the first loop as well so we work around that
		const nextBtnDisabled = await page.$('.paginate_button_disabled');

		if (nextBtnDisabled) {
			buttonHitCounter++;
		}

		if (buttonHitCounter == 2) {
			lastPageHit = true;
            process.stdout.write(", last page");
		} else {
			await page.click('#bandListCountry_next');
			await page.waitForNetworkIdle();
            pageCounter++;
		}

        process.stdout.write(" ...Done!\n");
	}

	await browser.close();

	return { data };
}
