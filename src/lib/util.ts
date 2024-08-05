import type { Classifier, ClassifierSlug, Label, LabelSlug, PortfolioGlobals } from '$types';
import OrdRec, { type OrderedRecord } from '$lib/OrderedRecord';

/** Return a reference to the classifier with the given slug */
export function getClassifier(globals: PortfolioGlobals, classifier: ClassifierSlug): Classifier {
  return OrdRec.fromItems(globals.classifiers).get(classifier);
}

/**
 * Filter the given array of labels based on the selected labels from the given
 * classifier.
 *
 * Labels are only included in the result if they are associated with at least
 * one of the selected labels.
 */
export function filterLabelsByAssociations(labels: Label[], classifier: ClassifierSlug, selectedLabels: LabelSlug[]) {
  return labels
    .filter(p => p.info.associations[classifier].find(l => selectedLabels.includes(l)) !== undefined);
}

/**
 * Returns an array of classifiers associated with the given label.
 *
 * These are ordered by the sort order from the global data.
 */
export function getAssociatedClassifiers(
  globals: PortfolioGlobals,
  label: Label,
): ClassifierSlug[] {
  return OrdRec.fromItems(globals.classifiers).keys().filter(c => c in label.info.associations);
}

/**
 * Returns an OrderedRecord of labels associated with the given label, grouped
 * by classifier.
 *
 * The return format matches the type of the `labels` attr in the `ChipList`
 * component.
 */
export function getAssociatedLabels(
  globals: PortfolioGlobals,
  label: Label,
): OrderedRecord<ClassifierSlug, OrderedRecord<LabelSlug, { label: Label }>> {
  const usedClassifiers = getAssociatedClassifiers(globals, label);
  return OrdRec.fromRecord(
    Object.fromEntries(usedClassifiers.map(
      c => [
        c,
        OrdRec.fromRecord(
          Object.fromEntries(
            label.info.associations[c].map(slug => [
              slug,
              { label: OrdRec.fromItems(OrdRec.fromItems(globals.classifiers).get(c).labels).get(slug) }
            ]),
          ),
          label.info.associations[c],
        ),
      // Another manual type cast because Object.fromEntries is kinda stupid
      ] as [ClassifierSlug, OrderedRecord<LabelSlug, { label: Label}>]
    )),
    usedClassifiers,
  );
}

/**
 * Get a UNIX timestamp.
 * @returns current time. as a UNIX timestamp.
 */
export function unixTime(): number {
  return Math.floor(Date.now() / 1000);
}
