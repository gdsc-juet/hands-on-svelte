<script>
    import Loader from "./Loader.svelte";
    import WordData from "./WordData.svelte";

    let word = "";
    let loading = false;
    let wordData = null;

    async function searchWord() {
        if (word.length === 0) {
            return;
        }
        loading = true;
        wordData = null;

        try {
            let res = await fetch("https://api.dictionaryapi.dev/api/v2/entries/en/" + word);
            let data = await res.json();
            if (Array.isArray(data)) {
                wordData = data[0];
            } else {
                wordData = "No Result";
            }
            loading = false;
        } catch (err) {
            loading = false;
        }
    }
</script>

<style>
    .header {
        width: 100%;
        padding: 20px;
        background: black;
        color: #f5f5f5;
        font-size: 20px;
        text-align: center;
    }

    .center {
        margin: 40px auto;
        width: 95%;
        max-width: 550px;
        background: #fff;
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.05);
        padding: 20px;
    }
    .made-with-love {
        position: absolute;
        bottom: 90%;
        left: 50%;
        transform: translate(-50%, 50%);
        width: 100%;
        background: #4caf50;
        color: #fff;
        text-align: center;
        white-space: nowrap;
        animation: marquee 15s linear infinite;
    }

    .form {
        background:whitesmoke;
        padding: 20px;
        border: 1px solid #f5f5f5;
        box-shadow: 0px 0px 5px 2px rgba(0, 0, 0, 0.05);
        margin: 20px 0px;
    }

    .form .form-group {
        margin: 10px 0px;
    }

    .form .form-group label {
        display: block;
        font-size: 16px;
        margin-bottom: 8px;
    }

    .form .form-group input {
     
        width: 100%;
        padding: 8px;
        border: 1px solid #111;
        border-radius: 4px;
    }

    .form .form-group button {
        
        background-color: #4caf50;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    .result {
        margin-top: 20px;
    }

    .result p.padding {
        padding: 20px;
    }
</style>

<div class="header">DICTIONARY</div>
<div class="center">
    <div class="form">
        <div class="form-group">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label>Search Word</label>
            <input type="text" placeholder="Type word here" bind:value={word} />
        </div>
        <div class="form-group">
            <button on:click={searchWord}>Search</button>
        </div>
    </div>
    {#if loading === true || wordData != null}
    <div class="result">
        {#if wordData != null && typeof wordData !== 'string'}
        <WordData {wordData}/>
        {:else if wordData === null && loading === true}
        <Loader />
        {:else}
        <p class="padding">No result Found</p>
        {/if}
    </div>
    {/if}
</div>
<div class="made-with-love">Made by Aditya Sachan</div>