/* eslint-disable no-undef */
const badWordsData = require('./bannedWords.json');

const findBadWords = (text) => {
  return badWordsData.RECORDS.reduce((acc, wordData) => {
    const regex = new RegExp(`\\b${wordData.word}\\b`, 'i');
    if (regex.test(text)) {
      acc.push(wordData.word);
    }
    return acc;
  }, []);
};

module.exports = findBadWords;
