<script lang="ts">
import CodeSnippetCard from "../CodeStorageCard.svelte";
import { snippetStore, addSnippet } from "../SnippetStore";
import type { PageData } from "./$types";

export let data: PageData;

  // Define a data object to store the form input
let formData: CodeSnippetInput = {
    contestName: "",
    codingPlatform: "",
    problemId: "",
    code: "",
};

  // Set the snippetStore with the data.snippets
snippetStore.set(data.srcCode);

  // Function to handle form submission
function handleSubmit() {
    // Add a new snippet with form data
    addSnippet(formData);

    // Clear the form data after submission
    formData = {
    contestName: "",
    codingPlatform: "",
    problemId: "",
    code: "",
    };
}
</script>

<div class="flex justify-center">
<div class="grid grid-cols-1 gap-4 min-w-full md:min-w-[750px]">
    <h3 class="text-center py-6 text-2xl font-bold">
    <span >DUMP</span>
    <span >YOUR</span>
    <span >CODES</span>
</h3>


    <div class="card p-4 w-full text-token space-y-4">
    <label class="label">
    <span>Coding Platform</span>
    <select class="select" bind:value={formData.codingPlatform}>
        <option value="" disabled selected style="color: #999; opacity: 0.6;">Select a platform</option> <!-- Placeholder -->
        <option value="Codeforces">Codeforces</option>
        <option value="Codechef">Codechef</option>
		<option value="LeetCode">LeetCode</option>
		<option value="TopCoder">TopCoder</option>
        <option value="AtCoder">AtCoder</option>
    </select>
</label>

	<label class="label">
        <span>Contest Name</span>
        <input class="input" type="text" placeholder="Enter title here..." bind:value={formData.contestName} />
    </label>
    <label class="label">
        <span>Problem ID</span>
        <select class="select	" bind:value={formData.problemId}>
		<option value="" disabled selected>Select ID</option> <!-- Placeholder -->
        <option value="A">A</option>
        <option value="B">B</option>
        <option value="C">C</option>
        <option value="D">D</option>
        <option value="E">E</option>
        <option value="F">F</option>
        </select>
    </label>
    <label class="label">
        <span>
			Source Code
		</span>
        <textarea class="textarea" rows="4" placeholder="Enter the source code here..." bind:value={formData.code} />
    </label>
   <button type="button" class="btn btn-sm variant-filled-primary bg-lime-500 hover:bg-lime-600" on:click={handleSubmit}>

        Dump Code
    </button>
    </div>
    <div class="text-center py-6 text-2xl font-bold">
    <h2 style="font-size: 24px; ">DUMPED CODES</h2>

    </div>
    {#each $snippetStore as snippet, index}
    <CodeSnippetCard {snippet} {index} /> <!-- Use curly braces for props -->
    {/each}
</div>
</div>
