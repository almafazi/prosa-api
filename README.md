# prosa-api

A node js client interface for [Prosa.ai](https://prosa.ai).
Advanced Natural Language Processor Designed for Bahasa Indonesia

You will need an API key from [Prosa.ai](https://prosa.ai).

## Add to your project
```shell
$ npm install prosa-api --save
```

## Test
```shell
$ X_API_KEY=<your api key> npm test
```

## Example usage of v2 API
All methods support promises and node-style callbacks.
```js
const ProsaAPI = require('prosa-api');
const prosaApi = new ProsaAPI('YOUR_API_KEY');

// Syntactic Analyzer
// Extracts linguistic information, by split up the given text into a series of tokens (generally, words) and sentences from text and identify part-of-speech tag, lemma, and affixes from each token in sentences.
prosaApi.syntacticAnalyzer({
  text: 'Aku mencintai bahasa Indonesia karena aku orang Indonesia.'
}).then(response => {
  console.log(response);
});
