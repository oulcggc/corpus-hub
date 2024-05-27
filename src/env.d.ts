/// <reference types="astro/client" />

/**
 * Represents an author.
 */
type Author = {
    /**
     * The name of the author.
     */
    name: Record<string, string>,
    /**
     * The abbreivation of the name.
     */
    abbr: string,
    /**
     * The link to the author's website.
     */
    link: string,
    /**
     * The location of the author.
     */
    location: string,
}

/**
 * Represents a concordancer.
 */
type Concordancer = {
    /**
     * The unique identifier of the concordancer.
     */
    id: string,
    /**
     * The language supported by the concordancer.
     */
    lang: string,
    /**
     * The name of the concordancer.
     */
    name: string,
    /**
     * The author of the concordancer.
     */
    author: Author,
    /**
     * The link to the concordancer's website.
     */
    link: string,
    /**
     * The usage details of the concordancer.
     */
    usage: {
        /**
         * Indicates if the concordancer is available online as a web service.
         */
        online: boolean,
        /**
         * Indicates if the concordancer is free to use or at least has a free tier.
         */
        free: boolean,
        /**
         * Indicates if the concordancer has a freemium model, with free tier but paid upgrades.
         */
        freemium: boolean,
        /**
         * Indicates if registration is required to use the concordancer.
         */
        registration: boolean,
        /**
         * Indicates if human verification is required to use the concordancer.
         */
        application: boolean,
    },
    /**
     * The list of corpora supported by the concordancer.
     */
    corpora: string[],
}
