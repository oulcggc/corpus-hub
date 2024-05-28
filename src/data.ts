export const AUTHORS: Record<string, Author> = {
  ninjal: {
    name: {
      ja: "国立国語研究所",
      en: "National Institute for Japanese Language and Linguistics",
    },
    abbr: "NINJAL",
    link: "https://www.ninjal.ac.jp/",
    location: "Tokyo, Japan",
  },
};

export const CONCORDANCERS: Concordancer[] = [
  {
    id: "ja@ninjal/shonagon",
    lang: "ja",
    name: {
      ja: "少納言",
      en: "Shonagon",
    },
    author: AUTHORS.ninjal,
    link: "https://shonagon.ninjal.ac.jp",
    usage: {
      online: true,
      free: true,
      freemium: false,
      registration: false,
      application: false,
    },
    corpora: ["ja@ninjal/bccwj"],
  },
  {
    id: "ja@ninjal/chunagon",
    lang: "ja",
    name: {
      ja: "中納言",
      en: "Chunagon",
    },
    author: AUTHORS.ninjal,
    link: "https://chunagon.ninjal.ac.jp/",
    usage: {
      online: true,
      free: true,
      freemium: false,
      registration: true,
      application: true,
    },
    corpora: ["ja@ninjal/bccwj", "ja@ninjal/chj"],
  },
  {
    id: "ja@ninjal/himawari",
    lang: "ja",
    name: {
      ja: "ひまわり",
      en: "Himawari",
    },
    author: AUTHORS.ninjal,
    link: "https://csd.ninjal.ac.jp/lrc/index.php",
    usage: {
      online: false,
      free: true,
      freemium: false,
      registration: false,
      application: false,
    },
    corpora: [],
  },
];

export const CORPORA = [
  {
    id: "ja@ninjal/bccwj",
    lang: "ja",
    tags: ["written", "comtemporary", "japanese"],
    author: AUTHORS.ninjal,
    name: {
      ja: "現代日本語書き言葉均衡コーパス",
      en: "Balanced Corpus of Contemporary Written Japanese",
    },
    abbr: "BCCWJ",
    link: "https://clrd.ninjal.ac.jp/bccwj/",
  },
  {
    id: "ja@ninjal/chj",
    lang: "ja",
    author: AUTHORS.ninjal,
    tags: [
      "historical",
      "diachronic",
      "japanese",
      "middle japanese",
      "old japanese",
      "classical japanese",
    ],
    name: {
      ja: "日本語歴史コーパス",
      en: "Corpus of Historical Japanese",
    },
    link: "https://clrd.ninjal.ac.jp/chj/index.html",
  },
];
