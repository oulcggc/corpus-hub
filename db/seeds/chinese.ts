import { seed as s } from ".";

export const AUTHORS = {
  "CN@ccl": {
    name: {
      zh: "北京大学 中国语言学研究中心",
      en: "Center of Chinese Linguistics, Peking University",
    },
    abbr: { zh: "北大", en: "Peking Univ." },
    link: "https://ccl.pku.edu.cn/",
    location: "CN",
  },
  "CN@blcu": {
    name: {
      zh: "北京语言大学 语言智能研究院",
    },
    abbr: {
      zh: "北语",
    },
    link: "https://ai.blcu.edu.cn/",
    location: "CN",
  },
} as const;

export const CONCORDANCERS = {
  "zh@ccl/ccl": {
    lang: "zh",
    name: {
      zh: "CCL语料库检索系统（网络版）",
    },
    // TODO: Add Tags
    abbr: {
      zh: "CCL",
      en: "CCL",
    },
    authorId: "CN@ccl",
    link: "http://ccl.pku.edu.cn:8080/ccl_corpus/index.jsp",
    usage: {
      online: true,
      free: true,
      freemium: false,
      registration: false,
      application: false,
      // TODO: Add allow commercial?
    },
    corpora: ["zh@ccl/ccl", "zh@ccl/ccl-classical", "zh@ccl/ccl-bi"],
  },
} as const;

export const CORPORA = {
  "zh@ccl/ccl": {
    lang: "zh",
    tags: [
      "chinese",
      "comtemporary",
      "modern chinese",
      "mandarin",
      "untokenized",
    ],
    authorId: "CN@ccl",
    name: {
      zh: "北京大学CCL语料库（现代汉语）",
      en: "Peking University CCL Online Corpus (Modern Chinese)",
    },
    abbr: {
      en: "CCL (modern)",
      ja: "CCL (modern)",
    },
    link: "http://ccl.pku.edu.cn:8080/ccl_corpus/CCLCorpus_Readme.html",
  },
  "zh@ccl/ccl-classical": {
    lang: "lzh",
    tags: [
      "chinese",
      "classical",
      "old chinese",
      "classical chinese",
      "untokenized",
    ],
    authorId: "CN@ccl",
    name: {
      zh: "北京大学CCL语料库（古代汉语）",
      en: "Peking University CCL Online Corpus (Classical Chinese)",
    },
    abbr: {
      en: "CCL (old)",
      ja: "CCL (old)",
    },
    link: "http://ccl.pku.edu.cn:8080/ccl_corpus/CCLCorpus_Readme.html",
  },
  "zh@ccl/ccl-bi": {
    lang: "zh", // TODO: Add multiple languages
    tags: ["chinese", "bilingual", "parallel", "mandarin", "english"],
    authorId: "CN@ccl",
    name: {
      zh: "北京大学CCL语料库（汉英双语）",
      en: "Peking University CCL Online Corpus (Chinese-English Bilingual)",
    },
    abbr: {
      en: "CCL (bi)",
      ja: "CCL (bi)",
    },
    link: "http://ccl.pku.edu.cn:8080/ccl_corpus/CCLCorpus_Readme.html",
  },
} as const;

// https://astro.build/db/seed
export default async function seed() {
  return await s(AUTHORS, CONCORDANCERS, CORPORA);
}
