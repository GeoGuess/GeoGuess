Contributing
=====

Welcome 👋 !
I glad to see that you are interested in contributing to GeoGuess.

Please note we have a [code of conduct](https://github.com/GeoGuess/Geoguess/blob/master/CODE_OF_CONDUCT.md), please follow it in all your interactions with the project.

## Geoguess Principe
1. GeoGuess is an open-source game
2. GeoGuess is free
3. GeoGuess is decentralized. Anyone can install its game server without any dependence on this repository
4. GeoGuess keep in mind to have an educational goal

## Pull Request Process

1. Make sure `npm test` passes
2. Comments PR : We don't have rules about the PR description, just clearly explain what you have done

## Transalation


- [] Add translation file in `src/lang/` following `TranslationsEN.js`

- [ ] Add the language in :
    * `src/lang/index.js` 
```js
import ru from './TranslationsRU'; // 1

Vue.use(VueI18n);

const translations = Object.assign(en, ja, fr, cs, de, ru); // 2


export const languages = [
    {
        text: 'English',
        value: 'en',
    },
    {// 3
        text: 'русский',
        value: 'ru',
    }
];
```
    * `src/plugins/vuetify.js`
```js
// 1 
import ru from 'vuetify/es5/locale/ru';

export default new Vuetify({

    lang: {
        locales: { en, fr, ja, cs, de, ru },// 2
    },

```


