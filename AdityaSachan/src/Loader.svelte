

<script>
    export let message = "Loading...";
</script>

<style>
    .loader {
        position: relative;
        padding: 40px;
        width: 100%;
        height: 100%;
    }

    .loader:before {
        content: "";
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 50px;
        height: 50px;
        background-color: greenyellow; 
        border-radius: 50%;
        animation: bouncing 1s infinite alternate;
    }

    @keyframes bouncing {
        0% {
            transform: translate(-50%, -50%) translateY(0);
        }
        100% {
            transform: translate(-50%, -50%) translateY(20px);
        }
    }
</style>

<div class="loader">
    <p>{message}</p>
</div>
