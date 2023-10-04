<script lang='ts'>
	// The ordering of these imports is critical to your app working properly
	// import '@skeletonlabs/skeleton/themes/theme-crimson.css';
	// // If you have source.organizeImports set to true in VSCode, then it will auto change this ordering
	// import '@skeletonlabs/skeleton/styles/all.css';
	// // Most of your app wide CSS should be put in this file
	import '../app.postcss';
	// Skeleton UI
	import { AppBar, AppShell, storeHighlightJs } from "@skeletonlabs/skeleton";
	import hljs from 'highlight.js';
	import 'highlight.js/styles/github-dark.css';
	storeHighlightJs.set(hljs);
</script>


<style>
    .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        z-index: 999;
    }
		:hover.scroll-to-top {
			background-color: #77ff00;
			color: #000;
			font-display: bold;
		}
</style> 

<AppShell>
    <svelte:fragment slot="header">
        <AppBar>
            <h1 class="text-left text-2xl font-bold">CodeDump</h1>
        </AppBar>
    </svelte:fragment>
    <slot />
</AppShell>

<button
    type="button"
    class="btn btn-sm variant-filled-primary scroll-to-top"
    on:click={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
>
    Scroll To Top
</button>
