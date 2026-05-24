# emoji-shortcode-transform

Transform emoji shortcodes like `:thumbs_up:` into emoji characters.

## Install

```sh
npm install @dev-kas/emoji-shortcode-transform
```

## Usage

### CommonJS

```js
const { transform, suggest } = require("@dev-kas/emoji-shortcode-transform");

transform("ship it :thumbs_up:");
// "ship it 👍"

suggest("ship it :thu", 12);
// ["thumbs_up", "thumbs_down"]
```

### ESM

```js
import { transform, suggest } from "@dev-kas/emoji-shortcode-transform";

transform("that is :fire:");
// "that is 🔥"

suggest("that is :fi", 11);
// ["fire"]
```

### Custom emoji

Use `createEmojiTransform` when you want to provide your own shortcode map
instead of the built-in one.

```js
import { createEmojiTransform } from "@dev-kas/emoji-shortcode-transform";

const emoji = createEmojiTransform({
  party: "🎉",
  ship: "🚢",
});

emoji.transform("release :party:");
// "release 🎉"

emoji.suggest("release :shi", 12);
// ["ship"]
```

### Browser

The CommonJS build also exposes browser globals when loaded with a script tag.

```html
<script src="./index.js"></script>
<script>
  window.transform("nice :cool:");
  window.suggest("nice :co", 8);
</script>
```

## API

### `transform(input)`

Returns a string with complete known shortcodes replaced by emoji. Unknown,
escaped, and incomplete shortcodes are preserved.

### `suggest(input, cursor)`

Returns shortcode names that match the active `:shortcode` before `cursor`.
Prefix matches are ranked first, then close fuzzy matches.

### `createEmojiTransform(emojiMap)`

Returns `{ transform, suggest }` functions backed by `emojiMap`.

## Tests

```sh
npm test
```

## License

ISC. In practical terms, the ISC license is a permissive open source license:
you can use, copy, modify, and distribute the software, including in proprietary
projects, as long as the copyright notice and license text are included. It also
disclaims warranties and liability from the author. See [LICENSE](./LICENSE) for
the full legal text.
