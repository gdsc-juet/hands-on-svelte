<script>
    import {db} from "./firebase";
    import {collectionData} from "rxfire/firestore";
    import {startWith} from "rxjs/operators";
    
    export let user;
    export let logout;

    let message = "";

    const query = db.collection("chats").orderBy("sentAt");
    const chats = collectionData(query , "id").pipe(startWith([]));

    function sendMessage()
    {
        if (message.trim() === "") return;  // prevent sending empty messages

        db.collection("chats").add({
            uid: user.uid,
            message: message,
            avatar: user.photoURL,
            sentAt: +new Date()
        })
        .then(() => {
            message = "";
        })
        .catch(error => console.error("Error sending message:", error));
    }
</script>

<style>
    main {
        height: 100%;
    }
    .header{
        width: 100%;
        height: 50px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0px 10px;
        border-bottom: 1px solid grey; 
    }
    .header .logo
    {
        font-size: 15px;
        font-weight: 600;
        color: #181717;
    }
    .header button
    {
        background-color: transparent;
        padding: 5px 10px;
        border: 1px solid #a8dde6;
        font-size: 15px;
        cursor: pointer;
    }

    .form
    {
        display: flex;
        width: 100%;
        height: 40px;
        border-top: 1px solid #a8dde6;
    }

    .form input
    {
        flex: 1;
        border: none;
        outline: none;
        font-size: 16px;
        color: #0a0909;
        padding: 10px;
    }

    .form button
    {
        padding: 10px;
        font-size: 20px;
        color: #4c4848;
        background-color: transparent;
        border:none;
        outline: none;
        cursor: pointer;
    }
    .messages{
        width: 100%;
        height: calc(100% - 90px);
        padding: 10px;
        overflow-y: auto;
    }
    .messages::-webkit-scrollbar {
        width: 4px;
        background-color: aliceblue;
    }
    .messages::-webkit-scrollbar-thumb {
        width: 4px;
        background: #827d7d;
    }
    .messages .message {
        margin : 10px 0px;
        display:flex;
    }
    .messages .my-message
    {
        justify-content: flex-end;
    }
    .messages .message .avatar {
        width: 30px;
        height: 30px;
        margin-right: 8px;
    }
    .messages .message .text
    {
        padding: 10px;
        background-color: #181717;
        color: aliceblue;
        font-size: 14px;
        font-weight: 600;
        max-width: fit-content;
        flex: 1;
        border-radius: 50px;
    }
    .messages .message .avatar img {
        width:100%;
        height: 100%;
        border-radius: 50%;
    }
    .messages .my-message .text{
        background-color: #5c5c5c;
        color: aliceblue;
    }
</style>

<main>
    <div class="header">
        <div class="logo">ChatRoom</div>
        <button on:click={logout}>Logout</button>
    </div>
    <div class="messages">
        {#each $chats as chat}
            {#if user.uid == chat.uid}
                <div class="message my-message">
                    <div class="text">
                        {chat.message}
                    </div>  
                </div>    
            {:else}
            <div class="message">
                <div class="avatar">
                    <img src={chat.avatar}>
                </div>
                <div class="text">
                    {chat.message}
                </div>
            </div>
            {/if}
        {/each}
    </div>
    <div class="form">
        <input type="text" bind:value={message}>
        <button on:click={sendMessage}>Send</button>
    </div>
</main>
