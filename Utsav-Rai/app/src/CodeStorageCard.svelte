<script lang="ts">
    import { CodeBlock } from "@skeletonlabs/skeleton";
    import { deleteSnippet } from "./SnippetStore";

    export let snippet: CodeSnippet = {
        contestName: "",
        codingPlatform: "",
        problemId: "",
        code: "",
        starred: false // Added a 'starred' property
    };

    export let index: number;
    let showFullCode = false;

    function toggleFullCode() {
        showFullCode = !showFullCode;
    }

    function toggleStarred() {
        snippet.starred = !snippet.starred;
    }

</script>

<div class="card">
    <header class="card-header">
        <div class="flex justify-between">
            <div>
                <span>{snippet.codingPlatform} - {snippet.contestName}</span>
            </div>
            <div class="float-right">
                <button type="button" class="btn btn-sm variant-filled-secondary" on:click={toggleStarred}>
                    {snippet.starred ? "⭐ Starred" : "Star"}
                </button>
                <button type="button" class="btn btn-sm variant-filled-error" on:click={() => deleteSnippet(index)}>
                    X
                </button>
            </div>
        </div>
    </header>
    <section class="p-4">
        <div class="text-lg font-bold mb-2">{snippet.problemId}</div>
        {#if showFullCode}
        <CodeBlock lang={snippet.codingPlatform} code={snippet.code} />
        <button type="button" class="btn btn-sm variant-filled-primary mt-2" on:click={toggleFullCode}>
            Show Less
        </button>
        {:else}
        <div class="overflow-hidden h-20">
            <CodeBlock lang={snippet.codingPlatform} code={snippet.code} />
        </div>
        <button type="button" class="btn btn-sm variant-filled-primary mt-2" on:click={toggleFullCode}>
            Show More
        </button>
        {/if}
    </section>
</div>
