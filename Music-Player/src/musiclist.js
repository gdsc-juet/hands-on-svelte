import { writable } from "svelte/store";


export const musicList = writable([
    {
        image: "Suzume.png",
        audio: "Suzume.mp3",
        name: "Suzume no Tojimari",
        author: "Keiko Masuda"
    },
    {
        image: "Sparkle.png",
        audio: "Sparkle.mp3",
        name: "Your Name",
        author: "Radwimps"
    },
    {
        image: "Pokemon.jpg",
        audio: "Pokemon.mp3",
        name: "I wanna be the very Best",
        author: "Jason Peige"
    },
    {
        image: "Noragami.png",
        audio: "Noragami.mp3",
        name: "Goya wa Machiawase",
        author: "Hello Sleepwalkers"
    },{
        image: "GOF.jpg",
        audio: "GOF.mp3",
        name: "Rain",
        author: "Senri Oe"
    }
]);