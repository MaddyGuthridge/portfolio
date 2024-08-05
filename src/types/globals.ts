import { object, string, type Infer } from 'superstruct';
import { ClassifierSlugStruct, type Classifier, type ClassifierSlug } from './classifier';
import type { RecordItems } from '$lib/OrderedRecord';

/** Global information about the portfolio */
export type PortfolioGlobals = {
  /** Configuration of the site */
  config: PortfolioConfig

  /** Top-level `README.md` of the site */
  readme: string

  /** Mapping of all classifiers */
  classifiers: RecordItems<ClassifierSlug, Classifier>
}
