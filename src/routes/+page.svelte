<script lang="ts">
	import * as cheerio from 'cheerio';
	import type { Band } from '../models/Band';
	import { onMount } from 'svelte';
	import DataTable from '../components/DataTable.svelte';
	import Select, { Option } from '@smui/select';
	import Textfield from '@smui/textfield';
	import HelperText from '@smui/textfield/helper-text';
	import LayoutGrid, { Cell } from '@smui/layout-grid';
	import Button, { Label } from '@smui/button';

	/** @type {import('./$types').PageData} */ export let data: { data: Band[] };

	var bands: Band[] = [];
	let filteredBands: Band[] = [];

	let loading: boolean = false;

	// search parameters
	let bandNameSearchTerm: string = '';
	let locationSearchTerm: string = '';
	let genreSearchTerm: string = '';

	let statuses: string[] = ['Any'];
	let selectedStatus: string = statuses[0];

	onMount(() => {
		bands = data.data;
	})

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
	{#if bands.length != 0}
		<Cell span={12}>
			<DataTable items={filteredBands} />
		</Cell>
	{:else}
		<Cell span={12}>
			<Label>No data has been loaded</Label>
		</Cell>
	{/if}
</LayoutGrid>
