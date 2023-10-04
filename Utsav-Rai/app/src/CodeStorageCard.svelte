<script lang="ts">
    import { CodeBlock } from "@skeletonlabs/skeleton";
    import { deleteSnippet, toggleFavorite } from "./SnippetStore";

    export let snippet: CodeSnippet = {
        contestName: "",
        codingPlatform: "",
        problemId: "",
        code: "",
        favorite: false
    };

    export let index: number;

</script>

<div class="card">
    <header class="card-header">
        <div class="flex justify-between">
            <div>
                <span>{snippet.contestName} - {snippet.codingPlatform}</span>
            </div>
            <div class="float-right">
                <button type="button" class="btn btn-sm variant-filled-secondary" on:click={() => toggleFavorite(index)}>
                    { snippet.favorite ? "Unfavorite" : "Favorite" }
                </button>
                <button type="button" class="btn btn-sm variant-filled-error" on:click={() => deleteSnippet(index)}>
                    X
                </button>
            </div>
        </div>
    </header>
    <section class="p-4">
        <div class="text-lg font-bold mb-2">{snippet.problemId}</div>
        <CodeBlock lang={snippet.codingPlatform} code={snippet.code}/>
    </section>
</div>
