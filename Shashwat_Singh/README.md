# Music Player Svelte App
This Svelte app provides a simple and stylish music player interface with features such as play/pause, next, and previous controls. It also includes a song list with clickable items to switch between songs.

# Table of Contents
* Features
* Usage
* File Structure

# Features
* Play/Pause: Toggle between playing and pausing the current song.
* Next/Previous: Navigate to the next or previous song in the playlist.
* Song List: View and select songs from a list of available tracks.
* Background Image: Displays a dynamic background image related to the currently playing   song.
* Digital Clock: A digital clock is included for additional functionality.

# Usage
1. Clone the repository to your local machine.
2. Ensure you have Node.js installed.
3. Open a terminal in the project directory.
4. Run the following commands inside the /Shashwat_Singh Directory:

```
# Install dependencies
npm install

# Run the app
npm run dev
```

Open your browser and navigate to http://localhost:5000 to view the app.

# File Structure
* `App.svelte`: The main component that defines the structure of the music player app.
* `musiclist.js`: Contains the list of songs with details such as name, author, image, and audio file.
* `DigitalClock.svelte`: Component for displaying a digital clock.
* `style`: Contains the styling for the app.

Enjoy your music with the Svelte Music Player!