<script lang="ts">
	const rows: number = 4;
	const columns: number = 10;

	function handleClick(row: number, column: number): void {
		console.log(`Clicked cell at row ${row + 1}, column ${column + 1}`);
	}
</script>

<div class="grid-wrapper">
	<div class="h-[200px]">
		<div class="">
			<span>Power Available: </span> <span class="font-semibold"> 12 / 12</span>
		</div>
	</div>
	<div class="flex justify-center pb-4">
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="#a39e9a"
			stroke-width="1.25"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-move-up"
			><path d="M8 6L12 2L16 6" /><path d="M12 2V22" /></svg
		>
		<h1>Enemy Starting Position</h1>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="#a39e9a"
			stroke-width="1.25"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="lucide lucide-move-up"
			><path d="M8 6L12 2L16 6" /><path d="M12 2V22" /></svg
		>
	</div>
	<div
		class="grid-container"
		style="display: grid; grid-template-columns: repeat(10, 1fr); grid-template-rows: repeat(4, 1fr);"
	>
		{#each Array(rows) as _, rowIndex (rowIndex)}
			{#each Array(columns) as _, colIndex (colIndex)}
				<button
					class="grid-cell border border-surface-400 hover:border-surface-100"
					onclick={() => handleClick(rowIndex, colIndex)}
					aria-label="cell"
				></button>
			{/each}
		{/each}
	</div>
</div>

<style>
	.grid-container {
		width: 100%;
	}

	.grid-cell {
		width: 100%;
		height: 100%;
		min-height: 75px;
		min-width: 75px;
		border-width: 1px;
		border-style: solid;
		background-color: transparent;
		cursor: pointer;
	}
</style>
