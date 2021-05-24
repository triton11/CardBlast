# Card Blast!

A multiplayer (.io) web game for learning flash cards!

## Instructions

1. Choose a username
2. You can either choose a pre-made card list, or paste in your own csv.
3. You pick up cards by running into them (move your curser or use touch on mobile). Your current card is listed at the bottom of the screen. 
4. On top of your character, you can see an indicator that changes color depending on how close you are to the card you seek (green = close, red = far). If you do not see an indicator, that may mean someone else has your card, in which case you should drop your card (press "x" or double tap on mobile). 
5. When you match a card, you get points! You can eat another player if you have more points than them (their name will turn green). If you eat another player, you will lose half your points, but you will gain an "eats". The goal of the game is to have the most "eats".  

## Development

Built with [Node.js](https://nodejs.org/), [socket.io](https://socket.io/), and [HTML5 Canvas](https://www.w3schools.com/html/html5_canvas.asp).

Built using Victor Zhou's tutorial: [**How to Build a Multiplayer (.io) Web Game**](https://victorzhou.com/blog/build-an-io-game-part-1/).

To get started, make sure you have Node and NPM installed. Then,

```bash
$ npm install
$ npm run develop
```

on your local machine.

To run the project in a production setting, simply

```bash
$ npm install
$ npm run build
$ npm start
```

## Tests

To run the tests for this this project, simply

```bash
$ npm install
$ npm test
```
