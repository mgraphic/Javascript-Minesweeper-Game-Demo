# Minesweeper Game

## Generated from Webpack Frontend Starterkit

[![Dependabot badge](https://flat.badgen.net/dependabot/wbkd/webpack-starter?icon=dependabot)](https://dependabot.com/)

A modified Minesweeper game based from Traversy Media.
https://www.youtube.com/watch?v=W0No1JDc6vE&t=172s

Working Demo: http://kmarshall.com/minesweeper/

### Installation

```
npm install
```

### Start Dev Server

```
npm start
```

### Build Prod Version

```
npm run build
```

### Features:

-   Retro Minesweeper look
-   Two ways to win, uncover all valid tiles and/or flag all bombs correctly
-   Timer added
-   Game restart button
-   Game settings to change game board size and bomb count
-   Customizable configuration in one place
-   Customizable SASS CSS options

When you run `npm run build` we use the [mini-css-extract-plugin](https://github.com/webpack-contrib/mini-css-extract-plugin) to move the css to a separate file. The css file gets included in the head of the `index.html`.
