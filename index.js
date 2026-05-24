const emojiSubstitutionList = {
  thumbs_up: "👍",
  thumbs_down: "👎",
  heart: "❤️",
  joy: "😂",
  surprised: "😮",
  crying: "😢",
  fire: "🔥",
  skull: "💀",
  skull_crossbones: "☠️",
  wilted_flower: "🥀",
  hundred: "💯",
  money_face: "🤑",
  warning: "⚠️",
  cake: "🍰",
  eyes: "👀",
  broken_heart: "💔",
  screaming: "😱",
  dove: "🕊️",
  praying: "🙏",
  cold_face: "🥶",
  cool: "😎",
};

function levydp(a, b) {
  const matrix = Array(b.length + 1)
    .fill(null)
    .map(() => Array(a.length + 1).fill(null));

  for (let i = 0; i <= a.length; i++) {
    matrix[0][i] = i;
  }
  for (let j = 0; j <= b.length; j++) {
    matrix[j][0] = j;
  }

  for (let j = 1; j <= b.length; j++) {
    for (let i = 1; i <= a.length; i++) {
      const indicator = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[j][i] = Math.min(
        matrix[j][i - 1] + 1,
        matrix[j - 1][i] + 1,
        matrix[j - 1][i - 1] + indicator,
      );
    }
  }

  return matrix[b.length][a.length];
}

const validEmojiChars =
  "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789";

function createEmojiTransform(emoji = emojiSubstitutionList) {
  const emojiNames = Object.keys(emoji);

  function transform(string) {
    let i = 0;
    let state = "DEFAULT";
    let buffer = "";
    let result = "";
    let escaped = false;

    while (i < string.length) {
      let c = string[i];
      switch (state) {
        case "DEFAULT":
          if (!escaped && c === ":") {
            state = "EMOJI";
            buffer = ":";
          } else {
            result += c;
          }
          break;

        case "EMOJI":
          if (!escaped && c === ":") {
            state = "DEFAULT";
            result += emoji[buffer.slice(1)] || buffer + ":";
            buffer = "";
          } else if (!escaped && !validEmojiChars.includes(c)) {
            result += buffer;
            buffer = "";
            state = "DEFAULT";
            i--;
          } else {
            buffer += c;
          }
          break;
      }
      i++;
      escaped = !escaped && c === "\\";
    }

    if (state === "EMOJI") {
      result += `${buffer}`;
    }

    return result;
  }

  function suggest(string, cursor) {
    const workspace = string.slice(0, cursor);
    let i = 0;
    let state = "DEFAULT";
    let buffer = "";
    let escaped = false;

    while (i < workspace.length) {
      let c = workspace[i];

      switch (state) {
        case "DEFAULT":
          if (!escaped && c === ":") {
            state = "EMOJI";
            buffer = ":";
          }
          break;

        case "EMOJI":
          if (!escaped && c === ":") {
            state = "DEFAULT";
            buffer = "";
          } else if (!escaped && !validEmojiChars.includes(c)) {
            state = "DEFAULT";
            buffer = "";
          } else {
            buffer += c;
          }
          break;
      }

      i++;
      escaped = !escaped && c === "\\";
    }

    if (state === "EMOJI") {
      const query = buffer.slice(1);
      const cands = emojiNames.map((name) => {
        return {
          name,
          distance: levydp(query, name),
          isPrefix: name.startsWith(query),
        };
      });

      cands.sort((a, b) => {
        if (a.isPrefix && !b.isPrefix) return -1;
        if (!a.isPrefix && b.isPrefix) return 1;

        if (a.distance !== b.distance) {
          return a.distance - b.distance;
        }

        return a.name.localeCompare(b.name);
      });

      return cands
        .filter((c) => c.isPrefix || c.distance <= 2)
        .map((c) => c.name);
    }

    return [];
  }

  return { transform, suggest };
}

const defaultTransform = createEmojiTransform();
const transform = defaultTransform.transform;
const suggest = defaultTransform.suggest;

const api = {
  createEmojiTransform,
  default: defaultTransform,
  emojiSubstitutionList,
  suggest,
  transform,
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = api;
}

// if in browser then export
try {
  window.suggest = suggest;
  window.transform = transform;
  window.createEmojiTransform = createEmojiTransform;
  window.emojiSubstitutionList = emojiSubstitutionList;
} catch (_) {}
