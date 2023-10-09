<script>
	import {auth , googleProvider} from "./firebase";
	import {authState} from "rxfire/auth";
	import Chatroom from "./Chatroom.svelte";
	let user;

	const unsubscribe = authState(auth).subscribe(usr => user = usr);

	function login()
	{
		auth.signInWithPopup(googleProvider);
	}

	function logout()
	{
		auth.signOut();
	}

</script>
	
<style>
	main {
		position: fixed;
		top: 50%;
		left : 50%;
		transform: translate(-50% , -50%);
		width: 100%;
		height: 100%;
		max-width: 400px;
		max-height: 500px;
		background-color: beige;
		border: 2px solid bisque;
		box-shadow: 0px 5px 10px rgba(0,0,0,0.05);
	}

	.login
	{
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50% , -50%);
	}
	.login > button
	{
		padding: 10px;
		background-color: rgb(192, 203, 203);
		color: rgb(81, 20, 20);
		font-size: 16px;
		cursor: pointer;
		outline: none;
		border : 1px solid blanchedalmond;
	}
</style>

<main>
	{#if user}
		<Chatroom user={user} logout={logout}/>
	{:else}
	<div class="login">
		<button on:click={login}>
			SignIn with Google
		</button>
	</div>
	{/if}
</main>