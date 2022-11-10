<script lang="ts">
	import * as cheerio from 'cheerio';
	import { Band } from '../models/Band';
	import { onMount } from 'svelte';
	import DataTable from '../components/DataTable.svelte';
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import LayoutGrid, { Cell } from '@smui/layout-grid';

	/** @type {import('./$types').PageData} */ export let data: { data: string };

	var bands: Band[] = [];
	let filteredBands: Band[] = [];

	// search parameters
	let bandNameSearchTerm: string = '';
	let locationSearchTerm: string = '';
	let genreSearchTerm: string = '';

	let statuses: string[] = ['Any'];
	let selectedStatus: string = statuses[0];

	onMount(() => {
		const $ = cheerio.load(data.data);

		$('tr').each((index, element) => {
			var name = $(element).find('td').eq(0).text();
			var url = $(element).find('td > a').eq(0).attr('href');
			var genre = $(element).find('td').eq(1).text();
			var location = $(element).find('td').eq(2).text();
			var status = $(element).find('td').eq(3).text();

			if (!name && !url && !genre && !location && !status) {
				// if we can find no info, we have probably parsed an invalid line. don't add it.
				return;
			}

			if (!name) name = 'Name not found';
			if (!url) url = '#';
			if (!genre) genre = 'Genre not found';
			if (!location) location = 'Location not found';
			if (!status) status = 'Status not found';

			bands.push(new Band(name, url, genre, location, status));
		});

		bands = bands.filter((b) => b.location.toLocaleLowerCase());
		statuses = statuses.concat([...new Set(bands.map((x) => x.status).sort())]);
	});

	$: {
		filteredBands = bands
			.filter(
				(b) => b.name.toLocaleLowerCase().indexOf(bandNameSearchTerm.toLocaleLowerCase()) !== -1
			)
			.filter(
				(b) => b.location.toLocaleLowerCase().indexOf(locationSearchTerm.toLocaleLowerCase()) !== -1
			)
			.filter(
				(b) => b.genre.toLocaleLowerCase().indexOf(genreSearchTerm.toLocaleLowerCase()) !== -1
			);

		if (selectedStatus != statuses[0]) {
			filteredBands = filteredBands.filter(
				(b) => b.status.toLocaleLowerCase().indexOf(selectedStatus.toLocaleLowerCase()) !== -1
			);
		}
	}
</script>

<div>
	<h1>Metal Archives API by zicho</h1>
	<p>Enter search parameters below</p>
</div>

<LayoutGrid>
	<Cell spanDevices={{ desktop: 3, tablet: 6, phone: 12 }}>
		<Textfield
			style="width:100%"
			variant="outlined"
			bind:value={bandNameSearchTerm}
			label="Band name"
		>
			<HelperText slot="helper">Filter by band name</HelperText>
		</Textfield>
	</Cell>

	<Cell spanDevices={{ desktop: 3, tablet: 6, phone: 12 }}>
		<Textfield style="width:100%" variant="outlined" bind:value={genreSearchTerm} label="Genre">
			<HelperText slot="helper">Filter by genre</HelperText>
		</Textfield>
	</Cell>

	<Cell spanDevices={{ desktop: 3, tablet: 6, phone: 12 }}>
		<Textfield
			style="width:100%"
			variant="outlined"
			bind:value={locationSearchTerm}
			label="Location"
		>
			<HelperText slot="helper">Filter by location</HelperText>
		</Textfield>
	</Cell>

	<Cell
		spanDevices={{ desktop: 3, tablet: 6, phone: 12 }}
		class="columns margins"
		style="justify-content: flex-start;"
	>
		<Select
			style="width:100%"
			variant="outlined"
			bind:value={selectedStatus}
			label="Filter by status"
		>
			{#each statuses as status}
				<Option value={status}>{status}</Option>
			{/each}
		</Select>
	</Cell>
</LayoutGrid>

<span>Showing {filteredBands.length} of {bands.length} bands</span>

<DataTable items={filteredBands} />

<!-- <ul style="list-style: none; padding: 0">
	{#if bands}
		{#each filteredBands as band}
			<li style="margin-top: 20px">
				<span>Name: <a href="{band.url}">{band.name}</a></span><br />
				<span>Genre: {band.genre}</span><br />
				<span>Location: {band.location}</span><br />
				<span>Status: {band.status}</span><br />
				<hr style="margin-top: 20px"/>
			</li>
		{/each}
	{:else}
		Loading...
	{/if}
</ul> -->
