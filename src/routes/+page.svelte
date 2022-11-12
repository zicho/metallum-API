<script lang="ts">
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
	let genreSearchTerm: string = '';
	let locationSearchTerm: string = '';
	let countrySearchTerm: string = '';

	let statuses: string[] = ['Any'];
	let selectedStatus: string = statuses[0];

	onMount(() => {
		handleResponse(data.data);
		// putting statuses here to work around bug making it add duplicates. Fix maybe?
		statuses = statuses.concat([...new Set(bands.map((x) => x.status).sort())]);
	});

	$: selectedStatus, startSearch(); // in place of on:change for Select which does not seem to work :/

	$: {
		filteredBands = bands
			.filter(
				(b) => b.name.toLocaleLowerCase().indexOf(bandNameSearchTerm.toLocaleLowerCase()) !== -1
			)
			.filter(
				(b) => b.genre.toLocaleLowerCase().indexOf(genreSearchTerm.toLocaleLowerCase()) !== -1
			)
			.filter(
				(b) => b.location.toLocaleLowerCase().indexOf(locationSearchTerm.toLocaleLowerCase()) !== -1
			)
			.filter(
				(b) => b.country.toLocaleLowerCase().indexOf(countrySearchTerm.toLocaleLowerCase()) !== -1
			);

		if (selectedStatus != statuses[0]) {
			filteredBands = filteredBands.filter(
				(b) => b.status.toLocaleLowerCase().indexOf(selectedStatus.toLocaleLowerCase()) !== -1
			);
		}
	}

	const load = async () => {
		return;
		//await fetch("api/load_all_bands");
	};

	const loadNewData = async () => {
		var queryString = `api/load_new_data/
				?name=${bandNameSearchTerm}
				&genre=${genreSearchTerm}
				&location=${locationSearchTerm}
				&country=${countrySearchTerm}
				`;

		if (selectedStatus != statuses[0]) {
			queryString = queryString += `&status=${selectedStatus}`;
		}

		await fetch(queryString).then(async (response) => {
			handleResponse(await response.json());
		});
	};

	var delayTimer: any;

	function startSearch(): void {
		console.log('starting search!');
		clearTimeout(delayTimer);
		delayTimer = setTimeout(function () {
			loadNewData();
		}, 1000);
	}

	function handleResponse(data: Band[]) {
		bands = data;
	}

	function testytest(arg0: string):  void {
		alert(arg0)
	}
</script>

<!-- <Cell span={6}>
	<Button on:click={() => load()} variant="raised">
		<Label>Load new data</Label>
	</Button>
</Cell> -->

<LayoutGrid>
	<Cell span={12}><div class="mdc-typography--headline3">Metal Archives API Beta 1</div></Cell>

	<Cell spanDevices={{ desktop: 3, tablet: 6, phone: 12 }}>
		<Textfield
			style="width:100%"
			variant="outlined"
			label="Band name"
			bind:value={bandNameSearchTerm}
			on:input={startSearch}
		>
			<HelperText slot="helper">Filter by band name</HelperText>
		</Textfield>
	</Cell>

	<Cell spanDevices={{ desktop: 3, tablet: 6, phone: 12 }}>
		<Textfield
			style="width:100%"
			variant="outlined"
			label="Genre"
			bind:value={genreSearchTerm}
			on:input={startSearch}
		>
			<HelperText slot="helper">Filter by genre</HelperText>
		</Textfield>
	</Cell>

	<Cell spanDevices={{ desktop: 2, tablet: 6, phone: 12 }}>
		<Textfield
			style="width:100%"
			variant="outlined"
			label="Location"
			bind:value={locationSearchTerm}
			on:input={startSearch}
		>
			<HelperText slot="helper">Filter by location</HelperText>
		</Textfield>
	</Cell>

	<Cell spanDevices={{ desktop: 2, tablet: 6, phone: 12 }}>
		<Textfield
			style="width:100%"
			variant="outlined"
			label="Country"
			bind:value={countrySearchTerm}
			on:input={startSearch}
		>
			<HelperText slot="helper">Filter by Country</HelperText>
		</Textfield>
	</Cell>

	<Cell
		spanDevices={{ desktop: 2, tablet: 6, phone: 12 }}
		class="columns margins"
		style="justify-content: flex-start;"
	>
		<Select
			style="width:100%"
			variant="outlined"
			label="Filter by status"
			bind:value={selectedStatus}
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
			<Label><div class="mdc-typography--subtitle2">No data has been loaded!</div></Label>
		</Cell>
	{/if}
</LayoutGrid>
