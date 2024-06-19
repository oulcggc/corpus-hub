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
  "zh@blcu/bcc": {
    lang: "zh",
    name: {
      zh: "BCC语料库网站",
    },
    abbr: {
      zh: "BCC",
      en: "BCC",
    },
    authorId: "CN@blcu",
    link: "https://bcc.blcu.edu.cn/",
    usage: {
      online: true,
      free: true,
      freemium: false,
      registration: false,
      application: false,
    },
    corpora: ["zh@blcu/bcc"],
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
      zh: "CCL (现代)",
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
      zh: "CCL (古代)",
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
      zh: "CCL (汉英)",
    },
    link: "http://ccl.pku.edu.cn:8080/ccl_corpus/CCLCorpus_Readme.html",
  },
  "zh@blcu/bcc": {
    lang: "zh",
    tags: ["chinese", "comtemporary", "modern chinese", "mandarin"],
    authorId: "CN@blcu",
    name: {
      zh: "BCC现代汉语语料库",
    },
    abbr: {
      en: "BCC",
      zh: "BCC",
    },
    link: "https://bcc.blcu.edu.cn/help",
  },
} as const;

// https://astro.build/db/seed
export default async function seed() {
  return await s(AUTHORS, CONCORDANCERS, CORPORA);
}
