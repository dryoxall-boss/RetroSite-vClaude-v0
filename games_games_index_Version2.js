// Exported list of game modules, thumbs, etc.
export const games = {
  flappyCat: {
    title: "Flappy Cat",
    thumb: "assets/game_flappycat.gif",
    desc: "Tap/Space to fly. Avoid pipes. Earn XP!",
    module: "./games/flappy_cat.js"
  },
  pacMan: {
    title: "Pac-Man",
    thumb: "assets/game_pacman.gif",
    desc: "Eat dots, avoid ghosts. Arrow keys. XP for score.",
    module: "./games/pacman.js"
  },
  dinoRunner: {
    title: "Dino Runner",
    thumb: "assets/game_dino.gif",
    desc: "Jump over obstacles. Space/Up arrow.",
    module: "./games/dino_runner.js"
  },
  numberMunchers: {
    title: "Number Munchers",
    thumb: "assets/game_munchers.gif",
    desc: "Munch numbers! Arrow keys.",
    module: "./games/number_munchers.js"
  }
};