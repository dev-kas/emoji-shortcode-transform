const assert = require("node:assert/strict");
const test = require("node:test");

const emojiTransform = require("../index.js");

test("transforms builtin emoji shortcodes", () => {
  assert.equal(
    emojiTransform.transform("Ship it :thumbs_up: :fire:"),
    "Ship it 👍 🔥",
  );
  assert.equal(emojiTransform.transform("keep :unknown:"), "keep :unknown:");
});

test("keeps escaping and incomplete shortcode behavior", () => {
  assert.equal(emojiTransform.transform("yo \\:fire:"), "yo \\:fire:");
  assert.equal(emojiTransform.transform("start :fire"), "start :fire");
});

test("suggests builtin emoji names", () => {
  assert.deepEqual(emojiTransform.suggest("try :sku", 8), [
    "skull",
    "skull_crossbones",
  ]);
  assert.deepEqual(emojiTransform.suggest("try :thumbs", 11), [
    "thumbs_up",
    "thumbs_down",
  ]);
});

test("supports a user-provided emoji map", () => {
  const custom = emojiTransform.createEmojiTransform({
    party: "🎉",
    ship: "🚢",
  });

  assert.equal(custom.transform("release :party:"), "release 🎉");
  assert.equal(custom.transform("builtin :fire:"), "builtin :fire:");
  assert.deepEqual(custom.suggest("release :shi", 12), ["ship"]);
});

test("supports esm imports", async () => {
  const mod = await import("../index.mjs");

  assert.equal(mod.transform("nice :cool:"), "nice 😎");
  assert.equal(mod.default.transform("nice :cool:"), "nice 😎");
});
