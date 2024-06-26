import { any, array, boolean, defaulted, define, enums, number, object, record, string, type Infer } from 'superstruct';
import type { Label, LabelSlug } from './label';
import type { RecordItems } from '$lib/OrderedRecord';

/** The slug referring to a classifier, unique within a data-set */
export type ClassifierSlug = string & { __classifier_slug: string };
/** The slug referring to a classifier, unique within a data-set */
export const ClassifierSlugStruct = define<ClassifierSlug>('ClassifierSlug', v => typeof v === 'string');

/**
 * How to display associations:
 *
 * * `"chip"`: use a chip
 * * `"card"`: use a card
 */
export const AssociationOptionsDisplayStruct = enums(['chip', 'card']);

/**
 * How to display associations:
 *
 * * `"chip"`: use a chip
 * * `"card"`: use a card
 */
export type AssociationOptionsDisplay = Infer<typeof AssociationOptionsDisplayStruct>;

/**
 * Information about how to display associations.
 *
 * By default, the name of the classifier will be used, and it will be shown as
 * a list of chips.
 *
 * If the classifier is the same as the current label, by default it will be
 * named "See also" and displayed as cards.
 */
const AssociationOptionsStruct = object({
  /** Title to use when displaying the associations under this classifier. */
  title: string(),
  /** Display options. Use `"chip"` or `"card"`. */
  display: AssociationOptionsDisplayStruct,
  /** Whether to display the labels that associate here, rather than labels that we associate to */
  reverseLookup: defaulted(boolean(), false),
});

/** Information about how to display associations */
export type AssociationOptions = Infer<typeof AssociationOptionsStruct>;

/**
 * Visibility of the classifier. One of:
 *
 * * `'visible'`: classifier is visible in all locations
 * * `'unlisted'`: classifier is not displayed in site menu
 * * `'private'`: classifier is not accessible anywhere on the site.
 */
const ClassifierVisibility = enums(['visible', 'unlisted']);

/** Represents information contained within a classifier's info.json */
export const ClassifierInfo = object({
  /** User-facing name of the classifier */
  name: string(),

  /** Short description of the classifier */
  description: string(),

  /** Color */
  color: string(),

  /** Ordering - higher values are placed earlier in lists */
  sort: defaulted(number(), 0),

  /**
   * Classifier IDs whose labels should be used for filtering on this classifier
   */
  filterClassifiers: defaulted(array(ClassifierSlugStruct), () => ([])),

  /** Visibility of this classifier */
  visibility: defaulted(ClassifierVisibility, 'visible'),

  /**
   * How to display associations for labels in this classifier.
   *
   * Any classifiers not included in this array are displayed as chips.
   */
  associations: defaulted(
    record(ClassifierSlugStruct, AssociationOptionsStruct),
    () => ({}),
  ),

  // TODO: implement this
  /** Extra properties that can be used by labels within this classifier */
  extras: defaulted(record(string(), any()), () => ({})),
});

export type Classifier = {
  /** Slug of classifier */
  slug: ClassifierSlug,

  /** Info about the classifier, loaded from `info.json` */
  info: Infer<typeof ClassifierInfo>

  /** `README.md` of classifier */
  readme: string,

  /** Labels within this classifier */
  labels: RecordItems<LabelSlug, Label>,
};
