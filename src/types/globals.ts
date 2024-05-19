import { object, string, type Infer } from 'superstruct';
import type { Classifier } from './classifier';

/** Main configuration for the portfolio, `config.json` */
export const PortfolioConfigJson = object({
  /** Name of the person to use within the website. */
  name: string(),
});

export type PortfolioConfig = Infer<typeof PortfolioConfigJson>;

/** Global information about the portfolio */
export type PortfolioGlobals = {
  /** Configuration of the site */
  config: PortfolioConfig

  /** Top-level `README.md` of the site */
  readme: string

  /** Mapping of all classifiers */
  classifiers: Record<string, Classifier>

  /** Array of classifier slugs, used to order all classifiers */
  classifierOrder: string[]
}
