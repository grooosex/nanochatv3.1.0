import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  CONTINUE_USER,
  OPENING_USER,
  formatUserForChat,
  formatUserForImage,
  needsMarkupFormat,
  parseUserMarkup,
  previousRoundImagePrompt,
  shotAndResidual,
  latestUserBefore,
} from "./user-markup.ts";

describe("parseUserMarkup", () => {
  it("splits actions, directives and leftover", () => {
    const p = parseUserMarkup("(屁眼插入阴茎)《阴茎也画出来》");
    assert.deepEqual(p.facts, ["屁眼插入阴茎"]);
    assert.deepEqual(p.directives, ["阴茎也画出来"]);
    assert.equal(p.rest, "");
  });

  it("handles fullwidth parens and mixed speech", () => {
    const p = parseUserMarkup("（小玉脸红）今天好累《写详细一点》");
    assert.deepEqual(p.facts, ["小玉脸红"]);
    assert.deepEqual(p.directives, ["写详细一点"]);
    assert.equal(p.rest, "今天好累");
  });

  it("keeps spoken content inside facts", () => {
    const p = parseUserMarkup("(小声说喜欢你)");
    assert.deepEqual(p.facts, ["小声说喜欢你"]);
    assert.equal(p.rest, "");
  });
});

describe("formatUserForChat", () => {
  it("leaves normal sentences alone", () => {
    const s = "今天天气真好，要不要出去走走？";
    assert.equal(formatUserForChat(s), s);
    assert.equal(needsMarkupFormat(s), false);
  });

  it("leaves the opening cue alone", () => {
    assert.equal(formatUserForChat(OPENING_USER), OPENING_USER);
  });

  it("turns blank sends into a continue cue", () => {
    assert.equal(formatUserForChat(""), CONTINUE_USER);
    assert.equal(formatUserForChat("   "), CONTINUE_USER);
    assert.match(CONTINUE_USER, /没有发言/);
    assert.doesNotMatch(CONTINUE_USER, /不能替/);
  });

  it("labels facts and forbids hearing them as orders", () => {
    const out = formatUserForChat("(屁眼插入阴茎)《阴茎也画出来》");
    assert.match(out, /【已发生】/);
    assert.match(out, /屁眼插入阴茎/);
    assert.match(out, /没有台词/);
    assert.match(out, /【作者指令】/);
    assert.match(out, /阴茎也画出来/);
    assert.match(out, /听不见/);
    assert.doesNotMatch(out, /^\(屁眼插入阴茎\)/);
  });

  it("treats short bare verbs as markup", () => {
    const out = formatUserForChat("摸头");
    assert.match(out, /【用户其余原文】摸头/);
    assert.match(out, /短动词优先当动作/);
  });
});

describe("formatUserForImage", () => {
  it("sends insertion as already happened and drawing as image-only", () => {
    const out = formatUserForImage("(屁眼插入阴茎)《阴茎也画出来》");
    assert.match(out, /用户已发生/);
    assert.match(out, /屁眼插入阴茎/);
    assert.match(out, /作者指令/);
    assert.match(out, /画面有关/);
  });

  it("drops the opening cue", () => {
    assert.equal(formatUserForImage(OPENING_USER), "");
  });
});

describe("shotAndResidual", () => {
  it("uses this reply as 本镜 and the previous four as residual only", () => {
    const messages = [
      { id: "u1", role: "user", content: "你好" },
      { id: "a1", role: "assistant", characterName: "青叶", content: "坐在沙发上" },
      { id: "u2", role: "user", content: "(从后面掀衣服)" },
      { id: "a2", role: "assistant", characterName: "青叶", content: "她回头看你，衣服被掀到腰。" },
    ];
    const { shot, residual } = shotAndResidual(messages, "a2");
    assert.equal(shot, "她回头看你，衣服被掀到腰。");
    assert.match(residual, /你好/);
    assert.match(residual, /坐在沙发上/);
    assert.doesNotMatch(residual, /衣服被掀到腰/);
  });

  it("lets an override replace 本镜 (combined-stream fallback)", () => {
    const messages = [
      { id: "u1", role: "user", content: "在吗" },
      { id: "a1", role: "assistant", content: "旁白收束" },
    ];
    const { shot, residual } = shotAndResidual(messages, "a1", "<<<CHAR:青叶>>>\n她坐着\n<<<NARRATOR>>>\n灯没开");
    assert.match(shot, /她坐着/);
    assert.match(residual, /在吗/);
    assert.doesNotMatch(residual, /旁白收束/);
  });

  it("presence uses the latest user line, not the opening cue", () => {
    const messages = [
      { id: "u0", role: "user", content: OPENING_USER },
      { id: "a0", role: "assistant", content: "七实在玄关等你" },
      { id: "u1", role: "user", content: "雨村今天不来" },
      { id: "a1", role: "assistant", content: "七实把枕头压上来" },
    ];
    assert.match(latestUserBefore(messages, "a1"), /雨村今天不来/);
    assert.equal(latestUserBefore(messages, "a0"), "");
  });
});

describe("previousRoundImagePrompt", () => {
  it("takes only the previous assistant's last successful image", () => {
    const messages = [
      {
        id: "a0",
        role: "assistant",
        images: [{ status: "done", prompt: "indoors, living room" }],
      },
      { id: "u1", role: "user" },
      {
        id: "a1",
        role: "assistant",
        images: [{ status: "done", prompt: "outdoors, street" }],
      },
      { id: "u2", role: "user" },
      { id: "a2", role: "assistant", images: [] },
    ];
    assert.equal(previousRoundImagePrompt(messages, "a2"), "outdoors, street");
  });

  it("does not walk further if the previous round has no image", () => {
    const messages = [
      {
        id: "a0",
        role: "assistant",
        images: [{ status: "done", prompt: "indoors" }],
      },
      { id: "u1", role: "user" },
      { id: "a1", role: "assistant", images: [] },
      { id: "u2", role: "user" },
      { id: "a2", role: "assistant", images: [] },
    ];
    assert.equal(previousRoundImagePrompt(messages, "a2"), "");
  });
});
