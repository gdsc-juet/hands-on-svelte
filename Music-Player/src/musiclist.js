import { writable } from "svelte/store";
import Suzume from "/Music/audio/Suzume.mp3";
import Sparkle from "/Music/audio/Sparkle.mp3"
import SuzumeP from "/Music/Pictures/Suzume.png"
import SparkleP from "/Music/Pictures/Sparkle.jpg"
import PokemonP from "/Music/Pictures/Pokemon.jpg"
import Pokemon from "/Music/audio/Pokemon.mp3"
import NoragamiP from "/Music/Pictures/Noragami.png"
import Noragami from "/Music/audio/Noragami.mp3"

export const musicList = writable([
    {
        image: SuzumeP,
        audio: Suzume,
        name: "Suzume no Tojimari",
        author: "Shashwat"
    },
    {
        image: SparkleP,
        audio: "asdsadasd",
        name: "Your Name",
        author: "Toka"
    },
    {
        image: PokemonP,
        audio: "dfasdsad",
        name: "Pokemon",
        author: "Ash"
    },
    {
        image: NoragamiP,
        audio: "dasdsad",
        name: "Noragami",
        author: "Yato"
    },
]);