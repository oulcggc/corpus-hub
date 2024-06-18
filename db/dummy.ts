/**
 * Represents an author.
 */
type Author = {
  /**
   * The name of the author.
   */
  name: LocalizedString;
  /**
   * The abbreivation of the name.
   */
  abbr: LocalizedString;
  /**
   * The link to the author's website.
   */
  link: string;
  /**
   * The location of the author.
   */
  location: string;
};

// Organization vs Individual
// Organizations only for now... later add individuals

export const AUTHORS: Record<string, Author> = {
  "JP@ninjal": {
    name: {
      ja: "国立国語研究所",
      en: "National Institute for Japanese Language and Linguistics",
    },
    abbr: { ja: "国語研", en: "NINJAL" },
    link: "https://www.ninjal.ac.jp/",
    // location: "Tokyo, Japan",
    location: "JP",
  },
} as const;

// {
//   id: "JP@ninjal",
//   location: "JP",
// },

type AuthorID = keyof typeof AUTHORS;

/**
 * Represents a concordancer.
 */
type Concordancer = {
  /**
   * The language supported by the concordancer.
   */
  lang: string;
  /**
   * The name of the concordancer.
   */
  name: LocalizedString;
  /**
   * The abbreivation of the name.
   */
  abbr: LocalizedString;
  /**
   * The author of the concordancer.
   */
  authorId: AuthorID;
  /**
   * The link to the concordancer's website.
   */
  link: string;
  /**
   * The usage details of the concordancer.
   */
  usage: {
    /**
     * Indicates if the concordancer is available online as a web service.
     */
    online: boolean;
    /**
     * Indicates if the concordancer is free to use or at least has a free tier.
     */
    free: boolean;
    /**
     * Indicates if the concordancer has a freemium model, with free tier but paid upgrades.
     */
    freemium: boolean;
    /**
     * Indicates if registration is required to use the concordancer.
     */
    registration: boolean;
    /**
     * Indicates if human verification is required to use the concordancer.
     */
    application: boolean;
  };
  /**
   * The list of corpora supported by the concordancer.
   */
  corpora: string[];
};

export const CONCORDANCERS: Record<string, Concordancer> = {
  "ja@ninjal/shonagon": {
    lang: "ja",
    name: {
      ja: "KOTONOHA「現代日本語書き言葉均衡コーパス」　少納言",
      en: "Online Reference Tool “Shonagon”",
    },
    abbr: {
      ja: "少納言",
      en: "Shonagon",
    },
    authorId: "JP@ninjal",
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
  "ja@ninjal/chunagon": {
    lang: "ja",
    name: {
      ja: "コーパス検索アプリケーション「中納言」",
      en: "Online Reference Tool “Chunagon”",
    },
    abbr: {
      ja: "中納言",
      en: "Chunagon",
    },
    authorId: "JP@ninjal",
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
  "ja@ninjal/himawari": {
    lang: "ja",
    name: {
      ja: "全文検索システム『ひまわり』",
      en: "Full-Text Search System “Himawari”",
    },
    abbr: {
      ja: "ひまわり",
      en: "Himawari",
    },
    authorId: "JP@ninjal",
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
} as const;

type ConcordancerID = keyof typeof CONCORDANCERS;

/**
 * Represents a corpus.
 */
type Corpus = {
  /**
   * The language of the corpus.
   */
  lang: string;
  /**
   * The tags of the corpus.
   */
  tags: string[];
  /**
   * The author of the corpus.
   */
  authorId: AuthorID;
  /**
   * The name of the corpus.
   */
  name: LocalizedString;
  /**
   * The author of the corpus.
   */
  abbr: LocalizedString;
  /**
   * The link to the corpus's website.
   */
  link: string;
};

export const CORPORA: Record<string, Corpus> = {
  "ja@ninjal/bccwj": {
    lang: "ja",
    tags: ["written", "comtemporary", "japanese"],
    authorId: "JP@ninjal",
    name: {
      ja: "現代日本語書き言葉均衡コーパス",
      en: "Balanced Corpus of Contemporary Written Japanese",
    },
    abbr: {
      en: "BCCWJ",
      ja: "BCCWJ",
    },
    link: "https://clrd.ninjal.ac.jp/bccwj/",
  },
  "ja@ninjal/chj": {
    lang: "ja",
    authorId: "JP@ninjal",
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
    abbr: {
      en: "BCCWJ",
      ja: "BCCWJ",
    },
    link: "https://clrd.ninjal.ac.jp/chj/index.html",
  },
} as const;

type CorpusID = keyof typeof CORPORA;
