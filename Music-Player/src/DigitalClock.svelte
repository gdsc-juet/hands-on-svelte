<script>
    import { onMount, onDestroy } from "svelte";
    import { readable } from "svelte/store";

    function getTime() {
        const time = new Date();
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        return {
            day: daysOfWeek[time.getDay()],
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
    main {
        font-size: 55px;
        color: white;
    }
    .text{
        padding-left: 14px;
    }
</style>

<main>
    <div class="text">{$clock.day}</div>
    <div>
        {($clock.hours < 10 ? "0" : "") + $clock.hours}:
        {($clock.minutes < 10 ? "0" : "") + $clock.minutes}:
        {($clock.seconds < 10 ? "0" : "") + $clock.seconds}
    </div>
</main>