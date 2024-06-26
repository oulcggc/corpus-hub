/// <reference path="../.astro/db-types.d.ts" />
/// <reference types="astro/client" />

/**
 * Represents a string that is localized in multiple languages.
 */
type LocalizedString = Record<string, string>; // TODO: Limit the keys to supported languages

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

/**
 * Represents a concordancer.
 */
type Concordancer = {
  /**
   * The unique identifier of the concordancer.
   */
  id: string;
  /**
   * The language supported by the concordancer.
   */
  lang: string;
  /**
   * The name of the concordancer.
   */
  name: LocalizedString;
  /**
   * The abbreviation of the concordancer's name.
   */
  abbr: LocalizedString;
  /**
   * The author of the concordancer.
   */
  author: Author;
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
  corpora: Corpus[];
};

/**
 * Represents a corpus.
 */
type Corpus = {
  /**
   * The unique identifier of the corpus.
   */
  id: string;
  /**
   * The language of the corpus.
   */
  lang: string;
  /**
   * The name of the corpus.
   */
  name: LocalizedString;
  /**
   * The abbreviation of the corpus name.
   */
  abbr: LocalizedString;
  /**
   * The author of the corpus.
   */
  author: Author;
  /**
   * The link to the corpus website.
   */
  link: string;
  /**
   * The tags associated with the corpus.
   */
  tags: string[];
};
