<script lang="ts">
  import CodeSnippetCard from "../CodeSnippetCard.svelte";
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
  snippetStore.set(data.snippets);

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
    <h3 class="text-center py-6">Dump Your Codes</h3>
    <div class="card p-4 w-full text-token space-y-4">
      <label class="label">
        <span>Contest Name</span>
        <input class="input" type="text" placeholder="Enter title here..." bind:value={formData.contestName} />
      </label>
      <label class="label">
        <span>Coding Platform</span>
        <select class="select" bind:value={formData.codingPlatform}>
          <option value="Codeforces">Codeforces</option>
          <option value="Codechef">Codechef</option>
          <option value="AtCoder">AtCoder</option>
        </select>
      </label>
      <label class="label">
        <span>Problem ID</span>
        <select class="select	" bind:value={formData.problemId}>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
          <option value="E">E</option>
          <option value="F">F</option>
        </select>
      </label>
      <label class="label">
        <span>Code Snippet</span>
        <textarea class="textarea" rows="4" placeholder="Enter your snippet code here..." bind:value={formData.code} />
      </label>
      <button type="button" class="btn btn-sm variant-filled-primary" on:click={handleSubmit}>
        Dump Code
      </button>
    </div>
    <div class="text-center py-6">
      <h2>My Code Snippets</h2>
    </div>
    {#each $snippetStore as snippet, index}
    <CodeSnippetCard {snippet} {index} /> <!-- Use curly braces for props -->
    {/each}
  </div>
</div>
