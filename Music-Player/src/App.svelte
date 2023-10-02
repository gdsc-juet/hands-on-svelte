<script>
  import {onMount} from "svelte";
  import {musicList} from "./musiclist.js";

  let currentSongIndex = 0;
  let playerState = "play";
  let audioElement;
  let mainElement;
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
                        <i class="fa fa-backward"></i>
                    </button>
                    <button on:click={prev}>
                        <i class="fa fa-backward"></i>
                    </button>
                </div>
            </div>
        </div>
    </div>
</main>

<style>

</style>
