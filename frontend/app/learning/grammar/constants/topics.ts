// frontend/app/learning/grammar/constants/topics.ts

import { GrammarTopic } from "../types";

export const TOPICS: GrammarTopic[] = [
  // ── Basic ──
  {
    id: "pronouns",
    title: "Pronoun Cases",
    level: "basic",
    description:
      "I / me / my — when to use subject, object, and possessive forms",
    hint: { "zh-TW": "主格、受格、所有格 — 人稱代名詞三種形態的使用場合" },
    index: 1,
  },
  {
    id: "countability",
    title: "Countable & Uncountable Nouns",
    level: "basic",
    description:
      "water vs. a bottle of water — determines articles and verb agreement",
    hint: { "zh-TW": "可數 & 不可數名詞 — 決定冠詞與動詞數的關鍵" },
    index: 2,
  },
  {
    id: "articles",
    title: "Articles & Quantifiers",
    level: "basic",
    description:
      "a / an / the / Ø / few / much — specifying and quantifying nouns",
    hint: { "zh-TW": "冠詞與數量詞 — 限定名詞範圍的完整工具組" },
    index: 3,
  },
  {
    id: "modification",
    title: "Modification & Word Classes",
    level: "basic",
    description:
      "adjectives modify nouns, adverbs modify verbs/adjectives — modification drives meaning",
    hint: { "zh-TW": "詞性修飾 — adj 修飾 n，adv 修飾 v/adj" },
    index: 4,
  },
  {
    id: "transitivity",
    title: "Transitive & Intransitive Verbs",
    level: "basic",
    description:
      "whether a verb takes a direct object — shapes the entire sentence structure",
    hint: { "zh-TW": "及物 & 不及物動詞 — 動詞後面能不能直接接受詞" },
    index: 5,
  },
  {
    id: "auxiliary-verbs",
    title: "Auxiliary Verbs",
    level: "basic",
    description:
      "can / will / should / must — core tools for expressing mood and modality",
    hint: { "zh-TW": "助動詞 — 語氣與情態的核心工具" },
    index: 6,
  },
  {
    id: "conjunctions",
    title: "Conjunctions",
    level: "basic",
    description:
      "and / but / or / so — coordinating conjunctions that link clauses and sentences",
    hint: { "zh-TW": "連接詞 — 句子與句子的橋梁" },
    index: 7,
  },
  {
    id: "imperatives",
    title: "Imperatives",
    level: "basic",
    description:
      "commands, suggestions, invitations — direct expression starting with a base verb",
    hint: { "zh-TW": "祈使句 — 動詞原形開頭的直接表達" },
    index: 8,
  },
  {
    id: "tenses",
    title: "Tenses",
    level: "basic",
    description:
      "all 12 tenses — simple, continuous, perfect, and perfect continuous",
    hint: { "zh-TW": "時態 — 12 種時態完整解析" },
    index: 9,
  },
  {
    id: "prepositions",
    title: "Prepositions",
    level: "basic",
    description:
      "in / on / at / by — the positioning system for time, place, and manner",
    hint: { "zh-TW": "介系詞 — 時間、地點、方式的定位系統" },
    index: 10,
  },
  {
    id: "to-usage",
    title: "Uses of 'to'",
    level: "basic",
    description:
      "infinitive vs. preposition — the key to using two verbs in one sentence",
    hint: { "zh-TW": "to 的用法 — 不定詞 vs 介系詞，一句用兩個動詞的關鍵法寶" },
    index: 11,
  },

  // ── Intermediate ──
  {
    id: "comparatives",
    title: "Comparatives & Superlatives",
    level: "intermediate",
    description:
      "bigger / the biggest / as...as — high-frequency structures in IELTS writing",
    hint: { "zh-TW": "比較級、最高級 — IELTS 寫作高頻句型" },
    index: 12,
  },
  {
    id: "appositives",
    title: "Appositives",
    level: "intermediate",
    description:
      "a noun phrase placed beside another to rename or describe it — adds detail without a new clause",
    hint: { "zh-TW": "同位語 — 緊鄰名詞旁補充說明的名詞片語" },
    index: 13,
  },
  {
    id: "causatives",
    title: "Causative Verbs",
    level: "intermediate",
    description:
      "make / let / have / get — four ways to express getting someone to do something",
    hint: { "zh-TW": "使役動詞 — 讓別人做某事的四種方式" },
    index: 14,
  },
  {
    id: "conditionals",
    title: "Conditionals",
    level: "intermediate",
    description:
      "If... — zero through third conditionals, from facts to counterfactuals",
    hint: { "zh-TW": "條件句 — 從事實到反事實的四種 If 句型" },
    index: 15,
  },
  {
    id: "subjunctive",
    title: "Subjunctive Mood",
    level: "intermediate",
    description:
      "If I were... / I wish... — expressing hypotheticals, wishes, and unreal situations",
    hint: { "zh-TW": "虛擬語氣 — 表達假設、願望與非真實情境" },
    index: 16,
  },
  {
    id: "dummy-subject-object",
    title: "Dummy Subject & Object",
    level: "intermediate",
    description:
      "It is important to... / I find it hard to... — placeholder pronouns that delay the real subject or object",
    hint: { "zh-TW": "虛主詞／虛受詞 — 用 it 佔位，讓真正的主詞或受詞後移" },
    index: 17,
  },
  {
    id: "ving-pp",
    title: "–ing vs Past Participle (Feelings)",
    level: "intermediate",
    description:
      "interesting vs. interested — the line between causing and experiencing a feeling",
    hint: { "zh-TW": "令人感到 vs 感到 — 主動感受與被動感受的分野" },
    index: 18,
  },
  {
    id: "passive",
    title: "Passive Voice",
    level: "intermediate",
    description:
      "be + past participle — emphasise the object, de-emphasise the agent",
    hint: { "zh-TW": "被動語態 — 強調受詞、弱化主詞，學術寫作必備" },
    index: 19,
  },
  {
    id: "adverbial-clauses",
    title: "Adverbial Clauses",
    level: "intermediate",
    description:
      "because / although / when / if — subordinate clauses that express time, reason, contrast, and condition",
    hint: { "zh-TW": "副詞子句 — 表示時間、原因、對比、條件的從屬子句" },
    index: 20,
  },
  {
    id: "noun-clauses",
    title: "Noun Clauses",
    level: "intermediate",
    description:
      "that / what / whether — clauses that function as subjects or objects",
    hint: { "zh-TW": "名詞子句 — 擔任主詞或受詞的子句" },
    index: 21,
  },
  {
    id: "adjective-clauses",
    title: "Adjective Clauses (Relative Clauses)",
    level: "intermediate",
    description:
      "who / which / that / whose / where / when / why — clauses that modify nouns, using relative pronouns or adverbs",
    hint: {
      "zh-TW":
        "形容詞子句 — 修飾名詞的子句，分為關係代名詞（who / which / that）與關係副詞（where / when / why）",
    },
    index: 22,
  },

  {
    id: "nominalisation",
    title: "Nominalisation",
    level: "intermediate",
    description:
      "turning verbs and adjectives into nouns — a key feature of formal and academic English",
    hint: { "zh-TW": "名詞化 — 將動詞或形容詞轉為名詞，學術寫作的核心技巧" },
    index: 23,
  },

  // ── Advanced ──
  {
    id: "participial-phrases",
    title: "Participial Phrases",
    level: "advanced",
    description:
      "opening with –ing or p.p. — condensing adverbial clauses into elegant phrases",
    hint: { "zh-TW": "分詞構句 — 簡化副詞子句，讓句子更精煉" },
    index: 24,
  },
  {
    id: "adverbial-clause-reduction",
    title: "Adverbial Clause Reduction",
    level: "advanced",
    description:
      "reducing because / when / although clauses — concise, formal alternatives to full subordinate clauses",
    hint: { "zh-TW": "副詞子句縮減 — 將副詞子句精簡為片語的高階技巧" },
    index: 25,
  },
  {
    id: "inversion",
    title: "Inversion",
    level: "advanced",
    description:
      "Not only...but also / Rarely... — advanced structures for emphasis and formality",
    hint: { "zh-TW": "倒裝句 — 強調語氣的高階句型" },
    index: 26,
  },
  {
    id: "cleft-sentences",
    title: "Cleft Sentences",
    level: "advanced",
    description:
      "It is... that / What... is — splitting a sentence to put focus on one element",
    hint: { "zh-TW": "強調句 — 用分裂句結構突出句中特定成分" },
    index: 27,
  },
];
