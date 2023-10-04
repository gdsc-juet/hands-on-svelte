<script>
	import {onMount} from "svelte";
	import {musicList} from "./musiclist.js";


	let currentsongindex = 0;
	let playerstate = "play";
	let audioElement;
	let mainElement;


	function setBackground(){
		let background = `
      radial-gradient(circle, rgba(63,94,251,1) 0%, rgba(252,70,107,1) 100%),
      url(/Music/Pictures/${$musicList[currentsongindex].image}) center no-repeat
      `;
		mainElement.style.background = background;
		mainElement.style.background = "cover";
	}

	onMount(function(){
		setBackground();
	})


	function prev()
	{
		if(currentsongindex == 0)
		{
			currentsongindex = $musicList.length - 1;
		}
		else
		{
			currentsongindex = (currentsongindex - 1) % $musicList.length;
		}

		playerstate = "play";
		setBackground();

	}

	function playpause()
	{
		if(playerstate === "play")
		{
			playerstate = "pause";
			audioElement.pause();
		}
		else
		{
			playerstate = "play";
			const playPromise = audioElement.play();
			if (playPromise !== null){
				playPromise.then(_ => {}).catch(error => {
					console.log("autoplay error" , error);
				});
			}
		}
	}

	function next()
	{
		currentsongindex = (currentsongindex + 1) % $musicList.length;
		playerstate = "play";
		setBackground();
	}

	function setsong(i)
	{
		currentsongindex = i;
		playerstate = "play";
		setBackground();
	}




</script>


<main bind:this={mainElement}>
	<audio
		src={"./files/audio/" + $musicList[currentsongindex].audio}
		bind:this={audioElement}
		autoplay ="false"
		>
	</audio>
	<div class="player">
		<div class="current-song">
			<div class="avatar">
				<img src={"./files/images/" + $musicList[currentsongindex].image} alt="avatar">
			</div>
			<div class="song-controls">
				<h2>{$musicList[currentsongindex].name}</h2>
				<div class="controls">
					<button on:click={prev}>
						<i class="fa fa-backward"></i>
					</button>
					<button on:click={playpause}>
						{#if playerstate == "play"}
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
					class="{i==currentsongindex ? 'active' : ''}"
					on:click="{() => setsong(i)}"
				>
					<div class="avatar">
						<img src={"./files/images/" +music.image} alt="avatar">
					</div>
					<div class="song-details">
						<h2>{music.name}</h2>
						<p>{music.artist}</p>
					</div>
				</div>


			{/each}
		</div>
	</div>

</main>


<style>
	main{
		height: 100vh;
		position: fixed;
		top: 0px;
		left: 0px;
		width: 100%;
	}

	audio{
		display: none;
	}

	.player{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%,-50%);
		width: 380px;
		height: 430px;
		display: flex;
		flex-direction: column;
		border-radius: 20px;
		overflow: hidden;
	}
	.player .current-song{
		height: 120px;
		padding: 10px;
		display: flex;
		background: rgba(255,255,255,0.8);
	}
	.player .current-song .avatar{
		width: 100px;
		height: 100px;
		padding: 10px;
		text-align: center;
	}
	.player .current-song .avatar img{
		width: 100%;
		height: 100%;
		border-radius: 50%;
		object-fit: cover;
	}
	.player .current-song .controls{
		padding-left: 10px;
		flex: 1;
	}
	.player .current-song .song-controls h2{
		margin-bottom: 15px;
		font-size: 20px;
		color: #111;
	}
	.player .current-song .song-controls .controls{
		display: flex;
		justify-content: space-between;
		padding-right: 40px;
	}
	.player .current-song .song-controls .controls button{
		outline: none;
		border: none;
		background: transparent;
		color: #111;
		font-size: 20px;
		cursor: pointer;
	}
	.player .song-list{
		height: calc(100% - 120px);
		background: rgba(255,255,255,0.2);
		box-shadow: 0px 8px 32px 0 rgba(32,38,135,0.2);
		backdrop-filter: blur(5px);
		border: 1px solid rgba(255,255,255,0.4);
		overflow-y: auto;
	}
	.player .song-list::-webkit-scrollbar{
		width: 4px;
		background: transparent;
	}
	.player .song-list::-webkit-scrollbar-thumb{
		width: 4px;
		background: #fff;
	}
	.player .song-list > div {
		display: flex;
		border-bottom: 1px solid rgba(255,255,255,0.25);
		cursor: pointer;
	}
	.player .song-list > div.active{
		background: rgba(255,255,255,0.25);
	}
	.player .song-list > div .avatar{
		width: 50px;
		height: 50px;
		text-align: center;
		padding: 10px;
	}
	.player .song-list > div .avatar img {
		height: 100%;
		width: 100%;
		border-radius: 50%;
		object-fit: cover;
	}
	.player .song-list > div .song-details{
		padding: 10px;
		display: flex;
		flex-direction: column;
		justify-content: center;
	}
	.player .song-list > div .song-details h2{
		font-size: 16px;
		margin: 0px 0px 2px;
		color: #fff;
	}
	.player .song-list > div .song-details p {
		color: #eee;
		font-size: 15px;
		margin: 0px;
	}
</style>