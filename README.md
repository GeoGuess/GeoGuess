![logo](../master/public/img/icons/android-icon-36x36.png) Geoguess
===

![GitHub](https://img.shields.io/github/license/BilelJegham/Geoguess-2) <!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-4-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

> Demo : https://demo.geoguess.games

Geoguess is a free and lazy geoguess game. Players compete how close the player can guess random locations in five rounds.
You can play multiplayer with your friends up to five friends. The first player creates a room and decides the room size. Other players type the same room name as the first player created and the game will start.
Cause of Google Map Api price, we aren't enabled to deploy server with unlimited access. But you can deploy your own game server and play this game unlimitedly and free.

This game was forked from [GeoGuess Master Web](https://github.com/spider-hand/Geoguess-Master-Web).

## Table of contents

<!-- TOC -->

-   [🃏 Features](#-features)
-   [👏 Contributors](#-contributors)
-   [🚀 Deploy](#-deploy)
-   [📜 License](#-license)
-   [📞 Contact](#-contact)
<!-- /TOC -->

## 🃏 Features

-   Multiplayer game
-   PWA and responsive design
-   Custom Map (geojson)
-   History
-   Score

## 👏 Contributors

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/BilelJegham"><img src="https://avatars3.githubusercontent.com/u/20130405?v=4" width="100px;" alt=""/><br /><sub><b>Bilel Jegham</b></sub></a><br /><a href="https://github.com/GeoGuess/Geoguess/commits?author=BilelJegham" title="Code">💻</a> <a href="#translation-BilelJegham" title="Translation">🌍</a></td>
    <td align="center"><a href="http://simonrousseau.me"><img src="https://avatars3.githubusercontent.com/u/19766429?v=4" width="100px;" alt=""/><br /><sub><b>Simon</b></sub></a><br /><a href="https://github.com/GeoGuess/Geoguess/commits?author=simonrousseau" title="Code">💻</a> <a href="#design-simonrousseau" title="Design">🎨</a> <a href="#translation-simonrousseau" title="Translation">🌍</a> <a href="https://github.com/GeoGuess/Geoguess/pulls?q=is%3Apr+reviewed-by%3Asimonrousseau" title="Reviewed Pull Requests">👀</a></td>
    <td align="center"><a href="https://github.com/dimfort"><img src="https://avatars3.githubusercontent.com/u/22171924?v=4" width="100px;" alt=""/><br /><sub><b>dim.fort</b></sub></a><br /><a href="https://github.com/GeoGuess/Geoguess/commits?author=dimfort" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/tululum"><img src="https://avatars2.githubusercontent.com/u/67554090?v=4" width="100px;" alt=""/><br /><sub><b>tululum</b></sub></a><br /><a href="https://github.com/GeoGuess/Geoguess/issues?q=author%3Atululum" title="Bug reports">🐛</a> <a href="#translation-tululum" title="Translation">🌍</a></td>
  </tr>
</table>

<!-- markdownlint-enable -->
<!-- prettier-ignore-end -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!

## 🚀 Deploy

You need to configure Google Maps Platform and Firebase to make game work.
See the instructions below.

-   [Google Maps API](https://developers.google.com/maps/documentation/javascript/get-api-key#get-the-api-key)
-   [Firebase](https://firebase.google.com/docs/database/web/start)
-   [Firebase Realtime Database](https://firebase.google.com/docs/database/web/start)

Once you get an API key and register the project with Firebase, create files named `.env.development.local` and `.env.production.local` inside this project to put environment variables.
The files should be like this.

`.env.production.local`

```
NODE_ENV=production
VUE_APP_API_KEY=YOUR_GOOGLE_MAPS_API_KEY
VUE_APP_FIREBASE_API_KEY=YOUR_FIREBASE_API_KEY
VUE_APP_FIREBASE_PROJECT_ID=YOUR_FIREBASE_PROJECT_ID
VUE_APP_FIREBASE_MESSAGING_SENDER_ID=YOUR_FIREBASE_MESSAGING_SENDER_ID
VUE_APP_FIREBASE_APP_ID=YOUR_FIREBASE_APP_ID
VUE_APP_FIREBASE_MEASUREMENT_ID=YOUR_FIREBASE_MEASUREMENT_ID
```

`.env.development.local`

```
NODE_ENV=development
...
```

Now you can run this game.  
Download Node.js [here](https://nodejs.org/en/download/) if you don't have and make sure you can run `npm` from the terminal.

```
# install dependencies
npm install

# run locally
npm run serve

# build for production
npm run build
```

You need to host this project as a static website to play multiplayer game with your friends. I recommend using [Netlify](https://www.netlify.com/). You can just fork this project and deploy it from Netlify. Also you can manage environment variables on the Netlify console.

## 📜 License

Licensed under [MIT License](https://github.com/GeoGuess/Geoguess/blob/master/LICENSE)

## 📞 Contact

Feel free to give us feedback.  
[Issues](https://github.com/GeoGuess/Geoguess/issues) or
[Discord](https://discord.gg/9GXm6RT)
