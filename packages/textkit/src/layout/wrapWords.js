import fromFragments from '../attributedString/fromFragments';
import charIsAlphabetic from '../utils/isAlphabet';

/**
 * @typedef {import('../types.js').AttributedString} AttributedString
 */

/**
 * Default word hyphenation engine used when no one provided.
 * Does not perform word hyphenation at all
 *
 * @param {string} word
 * @returns {[string]} same word
 */
const defaultHyphenationEngine = (word) => [word];

function breakText(word) {
  const parts = [];

  for (let i = 0; i < word.length; ) {
    if (charIsAlphabetic(word.charAt(i))) {
      let alphabeticWordEndIndex = i + 1;
      while (
        alphabeticWordEndIndex < word.length &&
        charIsAlphabetic(word.charAt(alphabeticWordEndIndex))
      ) {
        alphabeticWordEndIndex += 1;
      }
      parts.push(word.slice(i, alphabeticWordEndIndex));
      i = alphabeticWordEndIndex;
    } else {
      parts.push(word.charAt(i));
      i += 1;
    }
  }

  return parts;
}

/**
 * Wrap words of attribute string
 *
 * @param {Object} engines layout engines
 * @param {Object} options layout options
 */
const wrapWords = (engines = {}, options = {}) => {
  /**
   * @param {AttributedString} attributedString attributed string
   * @returns {AttributedString} attributed string including syllables
   */
  return (attributedString) => {
    const syllables = [];
    const fragments = [];

    const hyphenateWord =
      options.hyphenationCallback ||
      engines.wordHyphenation?.(options) ||
      defaultHyphenationEngine;

    for (let i = 0; i < attributedString.runs.length; i += 1) {
      let string = '';
      const run = attributedString.runs[i];
      const words = breakText(
        attributedString.string.slice(run.start, run.end),
      ).filter(Boolean);

      for (let j = 0; j < words.length; j += 1) {
        const word = words[j];
        const parts = hyphenateWord(word);

        syllables.push(...parts);
        string += parts.join('');
      }

      fragments.push({ ...run, string });
    }

    return { ...fromFragments(fragments), syllables };
  };
};

export default wrapWords;
