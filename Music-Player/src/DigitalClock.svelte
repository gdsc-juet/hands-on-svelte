<script>
    import { onMount, onDestroy } from "svelte";
    import { readable, writable } from "svelte/store";

    function getTime() {
        const time = new Date();
        return {
            hours: time.getHours(),
            minutes: time.getMinutes(),
            seconds: time.getSeconds(),
        };
    }

    export const clock = readable(getTime(), (set) => {
        const interval = setInterval(() => {
            set(getTime());
        }, 1000);

        onMount(() => {
            set(getTime());
        });

        onDestroy(() => {
            clearInterval(interval);
        });
    });
</script>

<style>
    div {
        font-size: 18px;
        color: #fff;
    }
</style>

<main>{($clock.hours < 10 ? "0" : "") + $clock.hours}:{($clock.minutes < 10 ? "0" : "") + $clock.minutes}:{($clock.seconds < 10 ? "0" : "") + $clock.seconds}</main>
