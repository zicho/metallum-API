<script lang="ts">
	import DataTable, { Head, Body, Row, Cell, Label, SortValue } from '@smui/data-table';
	import IconButton from '@smui/icon-button';
	import type { Band } from 'src/models/Band';

	export let items: Band[] = [];
	let sort: keyof Band = 'name';
	let sortDirection: Lowercase<keyof typeof SortValue> = 'ascending';

	function handleSort() {
		items.sort((a, b) => {
			const [aVal, bVal] = [a[sort], b[sort]][
				sortDirection === 'ascending' ? 'slice' : 'reverse'
			]();
			if (typeof aVal === 'string' && typeof bVal === 'string') {
				return aVal.localeCompare(bVal);
			}
			return Number(aVal) - Number(bVal);
		});
		items = items;
	}
</script>

<DataTable
	sortable
	bind:sort
	bind:sortDirection
	on:SMUIDataTable:sorted={handleSort}
	table$aria-label="User list"
	style="width: 100%;"
>
	<Head>
		<Row>
			<Cell columnId="name" style="width: 100%;">
				<Label>Name</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
			<Cell columnId="genre">
				<Label>Genre</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
			<Cell columnId="location">
				<Label>Location</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
            <Cell columnId="status">
				<Label>Status</Label>
				<IconButton class="material-icons">arrow_upward</IconButton>
			</Cell>
		</Row>
	</Head>
	<Body>
		{#each items as item}
			<Row href="{item.url}">
				<Cell><a href="{item.url}">{item.name}</a></Cell>
				<Cell>{item.genre}</Cell>
				<Cell>{item.location}</Cell>
				<Cell>{item.status}</Cell>
			</Row>
		{/each}
	</Body>
</DataTable>
