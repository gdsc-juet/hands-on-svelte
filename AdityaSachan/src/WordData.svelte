<script>
    export let wordData = null;
  
    function playAudio(src) {
      let audio = new Audio(src);
      audio.play();
    }
  </script>
  
  <style>
    .word-data {
      font-family: 'Arial', sans-serif;
      max-width: 600px;
      margin: 20px auto;
    }
  
    .audios {
      margin-bottom: 10px;
    }
  
    button {
      background-color: black;
      color: #fff;
      padding: 5px 10px;
      border: none;
      cursor: pointer;
      border-radius: 4px;
    }
  
    .meaning {
      margin-top: 15px;
    }
  
    .part-of-speech {
      font-weight: bold;
      margin-bottom: 5px;
    }
  
    .definitions {
      margin-left: 15px;
    }
  
    b {
      color: #3498db;
    }
  
    i {
      color: #27ae60;
    }
  </style>
  
  <div class="word-data">
    {#if wordData.phonetics}
      <div class="audios">
        {#each wordData.phonetics as data}
          <div class="audios">
            <p>{data.text} <i><button on:click={() => playAudio(data.audio)} tabindex="0">Speaker</button></i></p>
          </div>
        {/each}
      </div>
    {/if}
  
    {#each wordData.meanings as meaning}
      <div class="meaning">
        <div class="part-of-speech">&bull; {meaning.partOfSpeech}</div>
        <div class="definitions">
          {#each meaning.definitions as data}
            <div class="definitions">
              <p>Definitions: <b>{data.definition}</b></p>
              {#if data.example}
                <p>Example: <i>{data.example}</i></p>
              {/if}
            </div>
          {/each}
        </div>
      </div>
    {/each}
  </div>
  