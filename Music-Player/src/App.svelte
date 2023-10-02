<script>
  import {onMount} from "svelte";
  import {musicList} from "./musiclist.js";

  let currentSongIndex = 0;
  let playerState = "play";
  let audioElement;
  let mainElement;

  function prev(){

  }

  function playpause() {

  }

  function next(){

  }
  function setSong(){

  }

</script>

<main bind:this={mainElement}>
    <audio
            src = {"./files/audio/"+$musicList[currentSongIndex].audio}
            bind:this = {audioElement}
            autoplay = "false"
    >
    </audio>
    <div class="player">
        <div class = "current-song">
            <div class = "avatar">
                <img src={$musicList[currentSongIndex].image}>
            </div>
            <div class = "song-controls">
                <h2>
                    {$musicList[currentSongIndex].name}
                </h2>
                <div class = "controls">
                    <button on:click={prev}>
                        <i class="fa fa-backward"></i>
                    </button>
                    <button on:click={playpause}>
                        {#if playerState == "play"}
                            <i class="fa fa-pause"></i>
                        {:else}
                            <i class="fa fa-play"></i>
                        {/if}
                    </button>
                    <button on:click={next}>
                        <i class="fa fa-forward"></i>
                    </button>
                </div>
            </div>
        </div>
        <div class="song-list">
            {#each $musicList as music,i}
                <div
                class =" {i==currentSongIndex?"active":""}"
                on:click="{()=>setSong(i)}"
                >
                <div class="avatar">
                <img src="{music.image}">
                </div>
                <div class="song.details">
                    <h2>{music.name}</h2>
                    <p>{music.artist}</p>
                </div>
                </div>
            {/each}
        </div>
    </div>
</main>

<style>

</style>
