import { makePage } from '@keystatic/astro/ui';
// Same virtual config as official Keystatic Astro page
// @ts-expect-error virtual module provided by keystatic-ui integration
import config from 'virtual:keystatic-config';

export const Keystatic = makePage(config);
