type IsPlural<T extends string> =
    // Regular plurals ending in 's' (but not words that naturally end in 's')
    T extends `${infer Base}s`
    ? Base extends `${string}s` | `${string}ss` | `${string}us` | `${string}is` | `${string}as` | `${string}os`
    ? false // Words ending in ss, us, is, as, os are likely not plurals
    : Base extends ""
    ? false // Single 's' is not plural
    : true
    // Words ending in 'ies' (e.g., companies, flies)
    : T extends `${string}ies`
    ? true
    // Words ending in 'ves' (e.g., leaves, knives)  
    : T extends `${string}ves`
    ? true
    // Words ending in 'es' (e.g., boxes, wishes, classes)
    : T extends `${string}es`
    ? T extends `${string}ses` | `${string}shes` | `${string}ches` | `${string}xes` | `${string}zes`
    ? true
    : false
    // Irregular plurals
    : T extends "children" | "people" | "men" | "women" | "feet" | "teeth" | "mice" | "geese" | "deer" | "sheep" | "fish" | "oxen" | "criteria" | "phenomena" | "data" | "media" | "alumni" | "fungi" | "cacti" | "nuclei" | "radii" | "syllabi" | "analyses" | "bases" | "crises" | "diagnoses" | "hypotheses" | "oases" | "parentheses" | "syntheses" | "theses" | "appendices" | "indices" | "matrices" | "vertices" | "formulae" | "antennae" | "larvae" | "algae"
    ? true
    // Latin/Greek plurals
    : T extends `${string}a`
    ? T extends "bacteria" | "criteria" | "data" | "media" | "phenomena" | "schema" | "dogma" | "drama" | "extra" | "idea" | "area" | "arena"
    ? true
    : false
    : T extends `${string}i`
    ? T extends "alumni" | "fungi" | "cacti" | "nuclei" | "radii" | "syllabi" | "stimuli" | "termini"
    ? true
    : false
    : T extends `${string}ae`
    ? true
    : false;


type ToSingular<T extends string> =
    // Irregular plurals - handle these first
    T extends "children" ? "child"
    : T extends "people" ? "person"
    : T extends "men" ? "man"
    : T extends "women" ? "woman"
    : T extends "feet" ? "foot"
    : T extends "teeth" ? "tooth"
    : T extends "mice" ? "mouse"
    : T extends "geese" ? "goose"
    : T extends "deer" ? "deer"
    : T extends "sheep" ? "sheep"
    : T extends "fish" ? "fish"
    : T extends "oxen" ? "ox"
    : T extends "criteria" ? "criterion"
    : T extends "phenomena" ? "phenomenon"
    : T extends "data" ? "datum"
    : T extends "media" ? "medium"
    : T extends "alumni" ? "alumnus"
    : T extends "fungi" ? "fungus"
    : T extends "cacti" ? "cactus"
    : T extends "nuclei" ? "nucleus"
    : T extends "radii" ? "radius"
    : T extends "syllabi" ? "syllabus"
    : T extends "stimuli" ? "stimulus"
    : T extends "termini" ? "terminus"
    : T extends "analyses" ? "analysis"
    : T extends "bases" ? "basis"
    : T extends "crises" ? "crisis"
    : T extends "diagnoses" ? "diagnosis"
    : T extends "hypotheses" ? "hypothesis"
    : T extends "oases" ? "oasis"
    : T extends "parentheses" ? "parenthesis"
    : T extends "syntheses" ? "synthesis"
    : T extends "theses" ? "thesis"
    : T extends "appendices" ? "appendix"
    : T extends "indices" ? "index"
    : T extends "matrices" ? "matrix"
    : T extends "vertices" ? "vertex"
    : T extends "formulae" ? "formula"
    : T extends "antennae" ? "antenna"
    : T extends "larvae" ? "larva"
    : T extends "algae" ? "alga"
    : T extends "bacteria" ? "bacterium"
    : T extends "schema" ? "schema"
    : T extends "dogma" ? "dogma"
    : T extends "drama" ? "drama"
    : T extends "extra" ? "extra"
    : T extends "idea" ? "idea"
    : T extends "area" ? "area"
    : T extends "arena" ? "arena"
    // Words ending in 'ies' -> 'y'
    : T extends `${infer Base}ies`
    ? `${Base}y`
    // Words ending in 'ves' -> 'f' or 'fe'
    : T extends `${infer Base}ves`
    ? Base extends `${infer Root}l` | `${infer Root}r` | `${infer Root}a` | `${infer Root}e` | `${infer Root}i` | `${infer Root}o` | `${infer Root}u`
    ? `${Base}f`  // leaves -> leaf, knives -> knife
    : `${Base}fe` // wives -> wife, lives -> life
    // Words ending in specific 'es' patterns
    : T extends `${infer Base}ses`
    ? `${Base}s`   // glasses -> glass, classes -> class
    : T extends `${infer Base}shes`
    ? `${Base}sh`  // wishes -> wish, dishes -> dish
    : T extends `${infer Base}ches`
    ? `${Base}ch`  // watches -> watch, churches -> church
    : T extends `${infer Base}xes`
    ? `${Base}x`   // boxes -> box, foxes -> fox
    : T extends `${infer Base}zes`
    ? `${Base}z`   // quizzes -> quiz, buzzes -> buzz
    // Words ending in 'oes' -> 'o'
    : T extends `${infer Base}oes`
    ? `${Base}o`   // tomatoes -> tomato, heroes -> hero
    // Regular 's' removal (but avoid words that naturally end in 's')
    : T extends `${infer Base}s`
    ? Base extends `${string}s` | `${string}ss` | `${string}us` | `${string}is` | `${string}as` | `${string}os`
    ? T // Don't change words ending in ss, us, is, as, os
    : Base extends ""
    ? T // Don't change single 's'
    : Base
    // If no pattern matches, return as is
    : T;

export type { IsPlural, ToSingular }