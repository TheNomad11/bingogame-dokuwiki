# An experimental Bingo plugin for Dokuwiki

Developed with the assistance of ChatGPT and Perplexity.ai. I'm still conducting some testing.

A simple interactive Bingo-style listening exercise plugin for DokuWiki. 
Learners click on words in the correct order as they hear them read aloud. Works well for language classes as an engaging listening activity.

## Features

- Insert a 3×3 or 4×4 Bingo grid into any wiki page.
- Students click on the words in the order they hear them.
- Words are placed randomly in the grid each time.
- A score counter tracks how many correct clicks are made.
- When a row is completed, a sound effect is played.
- Fully responsive: works on desktop and mobile.

## Usage

Insert the plugin into any DokuWiki page using the syntax:

### 3×3 board

<code>{{bingolistening>words="Müll,ehrenamtlich,Flüchtlinge,Umwelt,vermeiden,Wegwerfgesellschaft,Rohstoffe,Lebensstil,nachhaltig"}}</code>

- Exactly 9 words must be provided.
- The words will be shuffled and displayed in a 3×3 grid.

### 4×4 board

<code>{{bingolistening>words="Haus,Baum,Auto,Katze,Hund,Stuhl,Tisch,Blume,Schule,Arbeit,Buch,Stadt,Land,Fluss,Meer,Wald"}}</code>

- Exactly 16 words must be provided.
- The words will be shuffled and displayed in a 4×4 grid.

## Customization

- Replace sounds/win.mp3 with your own audio file if desired.
- Modify style.css to adjust colors, fonts, or grid size.
- Default: 3×3 on smartphones, 4×4 on desktops (you can adjust the CSS grid for different layouts).






