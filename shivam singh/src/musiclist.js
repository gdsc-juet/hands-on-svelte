import {writable} from "svelte/store";

export const musicList = writable([
    {
        image:"aud1.jpg",
        audio:"aud1.mp3",
        name:"soothing music",
        artist:"goodmode"
    },

    {
      image:"aud2.jpg",
      audio: "aud2.mp3",
        name:"happy music",
        artist:"goodmode"
    },

    {
        image:"aud3.jpg",
        audio:"aud3.mp3",
        name:"funny music",
        artist:"goodmode"
    },

    {
      image:"aud4.jpg",
      audio:"aud4.mp3",
        name:"dance music",
        artist:"goodmode"
    }

]);