import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { splitChatPrompt, chatImageSystem, IMAGE_SYSTEM, IMAGE_SHOT_RULES, IMAGE_BG_RULES, IMAGE_MULTI_RULES, PERSONA_VOICE_RULES, fieldPolishHint, voicePolishExtra, systemFor, statusBarSkeleton, chatContextBlock, imageApplyRules, imageLengthRules, imageTagBudget, imageWriteMaxTokens } from "./prompts.ts";
import { assignCharTags, presenceFromTags, legacyPresentIds } from "./nai-tags.ts";
import { settleStuckImages, imageFailText, prettyImageError } from "./image-status.ts";
import { emptyCharacter, defaultImageParams } from "./constants.ts";
import type { Chat } from "./types.ts";

function stub(partial: Partial<Chat> = {}): Chat {
  return {
    id: "c1",
    folderId: null,
    name: "青叶",
    remark: "",
    starred: false,
    order: 0,
    createdAt: 0,
    updatedAt: 0,
    grokModelId: "grok-4.6-medium",
    isMulti: false,
    multiMode: "together",
    promptMode: "insert",
    adultBoost: false,
    canGen: true,
    statusBarOn: false,
    statusBar: "",
    overview: "",
    opening: "",
    extras: [],
    memory: "",
    memoryUntil: 0,
    memoryFoldAt: 0,
    memorySnaps: [],
    characters: [emptyCharacter(1)],
    imageParams: defaultImageParams(),
    messages: [],
    scrollTop: 0,
    ...partial,
  };
}

describe("splitChatPrompt", () => {
  it("leaves plain dialogue untouched", () => {
    const s = splitChatPrompt("她坐在沙发上。\n状态栏:\n心情:安静");
    assert.equal(s.started, false);
    assert.equal(s.ended, false);
    assert.equal(s.prompt, null);
    assert.match(s.visible, /沙发/);
  });

  it("cuts tags out of the visible reply", () => {
    const s = splitChatPrompt(
      "她回头看你。\n状态栏:\n姿势:坐着\n<<<PROMPT>>>\nfrom behind, sitting, clothes lift\n<<<END>>>",
    );
    assert.equal(s.started, true);
    assert.equal(s.ended, true);
    assert.equal(s.visible, "她回头看你。\n状态栏:\n姿势:坐着");
    assert.equal(s.prompt, "from behind, sitting, clothes lift");
  });

  it("treats an unclosed marker as tag-failed, dialogue already done", () => {
    const s = splitChatPrompt("对白写完了\n<<<PROMPT>>>\nfrom behind, sitting");
    assert.equal(s.started, true);
    assert.equal(s.ended, false);
    assert.equal(s.visible, "对白写完了");
    assert.match(s.prompt || "", /from behind/);
  });

  it("is case-insensitive and keeps group markers in the dialogue", () => {
    const s = splitChatPrompt(
      "<<<CHAR:青叶>>>\n你好\n<<<NARRATOR>>>\n灯没开\n<<<prompt>>>\n1girl, sitting\n<<<end>>>",
    );
    assert.match(s.visible, /<<<CHAR:青叶>>>/);
    assert.match(s.visible, /<<<NARRATOR>>>/);
    assert.doesNotMatch(s.visible, /1girl/);
    assert.equal(s.prompt, "1girl, sitting");
  });
});

describe("chatImageSystem", () => {
  it("keeps the full lexicon, 本镜 rules, and output order", () => {
    const sys = chatImageSystem(stub());
    assert.match(sys, /tentacles/);
    assert.match(sys, /guro/);
    assert.match(sys, /【本镜】/);
    assert.match(sys, /【背景】/);
    assert.match(sys, /<<<PROMPT>>>/);
    assert.match(sys, /<<<END>>>/);
    assert.ok(sys.includes(IMAGE_SYSTEM));
    assert.ok(sys.includes(IMAGE_SHOT_RULES));
    assert.ok(sys.includes(IMAGE_BG_RULES));
    assert.doesNotMatch(sys, /地牢/);
    assert.doesNotMatch(sys, /水槽/);
  });

  it("tells the model whether adult boost is on", () => {
    assert.match(chatImageSystem(stub({ adultBoost: true })), /【成人提示词加强】开/);
    assert.match(chatImageSystem(stub({ adultBoost: false })), /【成人提示词加强】关/);
  });

  it("caps new tags by selected NAI model, in 组, without the old 22–40 count", () => {
    assert.equal(imageTagBudget("nai-diffusion-4-5-full"), 45);
    assert.equal(imageTagBudget("nai-diffusion-5-full"), 110);
    assert.equal(imageWriteMaxTokens("nai-diffusion-4-5-full"), 500);
    assert.equal(imageWriteMaxTokens("nai-diffusion-5-curated"), 700);

    const v45 = imageLengthRules("nai-diffusion-4-5-full", true);
    assert.match(v45, /组 = 逗号隔开的一段/);
    assert.match(v45, /必须不超过 45 组/);
    assert.match(v45, /25–45 组/);
    assert.match(v45, /够用就停/);
    assert.match(v45, /表情必须 2–3 组/);
    assert.match(v45, /衣服只写变化/);
    assert.match(v45, /场景 1–2 组/);
    assert.doesNotMatch(v45, /可以写到接近/);
    assert.doesNotMatch(v45, /humiliation/);
    assert.doesNotMatch(v45, /residual mess/);
    assert.doesNotMatch(v45, /不超过 110/);
    assert.doesNotMatch(v45, /22–40/);

    const v5 = imageLengthRules("nai-diffusion-5-full", true);
    assert.match(v5, /必须不超过 110 组/);
    assert.match(v5, /40–110 组/);
    assert.doesNotMatch(v5, /不超过 45/);
    assert.doesNotMatch(v5, /25–45/);

    const off = imageLengthRules("nai-diffusion-4-5-full", false);
    assert.match(off, /必须不超过 45 组/);
    assert.doesNotMatch(off, /可以写 25–45/);

    const sys45 = chatImageSystem(stub({ adultBoost: true }));
    assert.match(sys45, /必须不超过 45 组/);
    assert.match(sys45, /25–45 组/);
    assert.doesNotMatch(sys45, /22–40/);
    assert.doesNotMatch(sys45, /写够/);
    assert.doesNotMatch(sys45, /可以写到接近/);
    assert.doesNotMatch(IMAGE_SYSTEM, /22–40/);
    assert.doesNotMatch(IMAGE_SYSTEM, /写够/);

    const sys5 = chatImageSystem(
      stub({
        adultBoost: true,
        imageParams: { ...stub().imageParams, model: "nai-diffusion-5-full" },
      }),
    );
    assert.match(sys5, /必须不超过 110 组/);
    assert.doesNotMatch(sys5, /必须不超过 45 组/);
  });

  it("only forwards extras marked 应用到生图 as writer rules", () => {
    const chat = stub({
      extras: [
        { id: "a", body: "不要画眼镜", applyImage: true },
        { id: "b", body: "这段只给聊天", applyImage: false },
      ],
    });
    const rules = imageApplyRules(chat);
    assert.match(rules, /不要画眼镜/);
    assert.match(rules, /禁止把这段原文抄进 tag/);
    assert.match(rules, /以这里为准/);
    assert.doesNotMatch(rules, /这段只给聊天/);
    assert.match(chatImageSystem(chat), /不要画眼镜/);
    assert.equal(imageApplyRules(stub({ extras: [{ id: "a", body: "x" }] })), "");
  });

  it("labels appearance as chat proofreading, not an image base", () => {
    const block = chatContextBlock(
      stub({ characters: [{ ...emptyCharacter(1), appearance: "pink hair, sailor" }] }),
    );
    assert.match(block, /给正文校对用，不是生图底/);
    assert.doesNotMatch(block, /生图用/);
    assert.match(block, /pink hair/);
  });

  it("keeps 本镜/背景 for everyone, and only hangs 互动 rules on multi chats", () => {
    const single = chatImageSystem(stub({ isMulti: false }));
    assert.ok(single.includes(IMAGE_SHOT_RULES));
    assert.ok(single.includes(IMAGE_BG_RULES));
    assert.doesNotMatch(single, /【多人互动/);
    assert.doesNotMatch(single, /source#kiss/);
    assert.doesNotMatch(single, /source#teasing/);
    assert.doesNotMatch(single, /不要按名单写成 2girls/);
    assert.doesNotMatch(single, /3people/);
    assert.doesNotMatch(single, /不要因为用户在场/);

    const a = emptyCharacter(1);
    const b = emptyCharacter(2);
    a.name = "七实";
    b.name = "雨村";
    const multi = chatImageSystem(
      stub({
        isMulti: true,
        promptMode: "insert",
        characters: [a, b],
      }),
    );
    assert.ok(multi.includes(IMAGE_SHOT_RULES));
    assert.ok(multi.includes(IMAGE_BG_RULES));
    assert.ok(multi.includes(IMAGE_MULTI_RULES));
    assert.match(multi, /source#kiss/);
    assert.match(multi, /target#kiss/);
    assert.match(multi, /mutual#kiss/);
    assert.doesNotMatch(multi, /source#teasing/);
    assert.match(multi, /不要输出 ENABLED/);
    assert.match(multi, /谁在场/);
    assert.match(multi, /不要因为用户在场/);
    assert.match(multi, /2girls, 1boy/);
    assert.match(multi, /禁止有 3people 这种写法/);
    assert.doesNotMatch(multi, /不要按名单写成 2girls/);
    assert.doesNotMatch(multi, /背对我/);
    assert.doesNotMatch(multi, new RegExp(`"${a.id}"`));
    assert.doesNotMatch(multi, new RegExp(`"${b.id}"`));
    assert.match(multi, /七实/);
    assert.match(multi, /雨村/);
  });
});

describe("systemFor chat", () => {
  it("appends the image block last", () => {
    const img = "IMAGE_BLOCK_MARKER";
    const sys = systemFor("chat", "【要求总览】写细", undefined, img);
    assert.ok(sys.endsWith(img));
    assert.match(sys, /要求总览/);
  });

  it("omits image rules when the switch is off", () => {
    const sys = systemFor("chat", "【要求总览】写细");
    assert.doesNotMatch(sys, /<<<PROMPT>>>/);
    assert.doesNotMatch(sys, /tentacles/);
  });
});

describe("statusBarSkeleton", () => {
  it("keeps titles and drops filled values", () => {
    const raw = "状态栏:\n心情:极致惊恐\n身体:失温";
    const out = statusBarSkeleton(raw);
    assert.match(out, /状态栏:/);
    assert.match(out, /心情:/);
    assert.doesNotMatch(out, /极致惊恐/);
    assert.doesNotMatch(out, /失温/);
  });
});

describe("persona voice rules", () => {
  it("stays off the ordinary 人设 hint", () => {
    const hint = fieldPolishHint({ field: "persona", current: "傲娇妹妹", charLabel: "角色「青叶」" });
    assert.match(hint, /傲娇妹妹/);
    assert.doesNotMatch(hint, /【人设·声部写法/);
  });

  it("hangs 声部 rules only when the toggle is on", () => {
    const hint = fieldPolishHint({
      field: "persona",
      current: "傲娇妹妹",
      charLabel: "角色「青叶」",
      voices: true,
    });
    assert.ok(hint.includes(PERSONA_VOICE_RULES));
    assert.match(hint, /声部一·社会/);
    assert.match(hint, /声部三·（自拟标题）/);
    assert.doesNotMatch(hint, /绘理香/);
    assert.doesNotMatch(hint, /贫乳/);
  });

  it("marks only the characters whose toggle is on for whole-card polish", () => {
    const off = voicePolishExtra(stub({ isMulti: true, characters: [emptyCharacter(1), emptyCharacter(2)] }));
    assert.equal(off, "");
    const on = voicePolishExtra(
      stub({
        isMulti: true,
        characters: [{ ...emptyCharacter(1), name: "青叶", personaVoices: true }, emptyCharacter(2)],
      }),
    );
    assert.match(on, /角色1「青叶」/);
    assert.doesNotMatch(on, /角色2/);
    assert.ok(on.includes(PERSONA_VOICE_RULES));
  });

  it("puts 声部 extra onto polish system when the big button runs", () => {
    const extra = voicePolishExtra(stub({ characters: [{ ...emptyCharacter(1), personaVoices: true }] }));
    const sys = systemFor("polish", extra);
    assert.ok(sys.includes(PERSONA_VOICE_RULES));
    assert.match(sys, /本卡唯一角色/);
  });

  it("regen prompt does not mention a previous draft", () => {
    const block = chatContextBlock(stub(), { regen: true });
    assert.match(block, /第一次写/);
    assert.doesNotMatch(block, /上一稿/);
    assert.doesNotMatch(chatContextBlock(stub()), /【重写】/);
  });
});

describe("stuck image + move folder order", () => {
  it("turns in-flight images into 上次生图未完成", () => {
    const before = stub({
      messages: [
        {
          id: "m1",
          role: "assistant",
          content: "hi",
          createdAt: 1,
          images: [
            {
              id: "g1",
              prompt: "",
              negative: "",
              seed: 1,
              model: "nai-diffusion-4-5-full",
              width: 832,
              height: 1216,
              steps: 28,
              sampler: "k_euler_ancestral",
              status: "generating",
              createdAt: 1,
            },
            {
              id: "g2",
              prompt: "ok",
              negative: "",
              seed: 2,
              model: "nai-diffusion-4-5-full",
              width: 832,
              height: 1216,
              steps: 28,
              sampler: "k_euler_ancestral",
              status: "done",
              blobId: "b",
              createdAt: 2,
            },
          ],
        },
      ],
    });
    const after = settleStuckImages(before);
    assert.equal(after.messages[0].images[0].status, "error");
    assert.equal(after.messages[0].images[0].error, "上次生图未完成");
    assert.equal(after.messages[0].images[1].status, "done");
    assert.equal(settleStuckImages(after), after);
  });

  it("maps abort to 已取消 / 生图超时", () => {
    const ac = new AbortController();
    ac.abort();
    assert.equal(imageFailText(new Error("x"), ac.signal), "已取消");
    const timeout = new Error("aborted");
    timeout.name = "AbortError";
    assert.equal(imageFailText(timeout), "生图超时");
  });

  it("shortens 429 json image errors", () => {
    assert.equal(
      prettyImageError('{"message":"Rate limit exceeded (20s interval)","statusCode":429}'),
      "请求太频繁",
    );
    assert.equal(prettyImageError("还没连接 NAI 中转站"), "还没连接 NAI 中转站");
    assert.equal(
      prettyImageError("<html><head><title>Internal Server Error</title></head><body>"),
      "中转站返回了异常页面",
    );
  });
});

describe("multi presence tags", () => {
  const roster = [
    { id: "a", name: "七实" },
    { id: "b", name: "雨村" },
  ];

  it("does not dump leftover tags onto someone who was not named", () => {
    const { mapped, leftover } = assignCharTags({ 七实: "girl, sleepy", extra: "faceless male" }, roster);
    assert.equal(mapped.a, "girl, sleepy");
    assert.equal("b" in mapped, false);
    assert.match(leftover, /faceless male/);
  });

  it("turns the switch set to whoever was actually tagged", () => {
    const present = presenceFromTags(["a", "b"], ["b"]);
    assert.deepEqual(present, { mode: "exact", ids: ["a"] });
    assert.deepEqual(presenceFromTags([], ["b"]), { mode: "off", ids: ["b"] });
    assert.equal(presenceFromTags([], []), undefined);
  });

  it("reads legacy char slots without inventing the missing one", () => {
    assert.deepEqual(legacyPresentIds("bedroom, char1: girl, sleepy", roster), ["a"]);
    assert.equal(legacyPresentIds("bedroom, 1girl", roster), undefined);
  });
});
