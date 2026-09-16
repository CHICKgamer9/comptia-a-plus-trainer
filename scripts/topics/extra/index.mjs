import { TECH_VOLUME } from "./tech.mjs";
import { MATHS_VOLUME } from "./maths.mjs";
import { SCIENCE_VOLUME } from "./science.mjs";
import { HISTORY_VOLUME } from "./history.mjs";
import { ENGLISH_VOLUME } from "./english.mjs";
import { GEOGRAPHY_VOLUME } from "./geography.mjs";
import { CODING_VOLUME } from "./coding.mjs";
import { BUSINESS_VOLUME } from "./business.mjs";
import { HEALTH_VOLUME } from "./health.mjs";
import { MUSIC_VOLUME } from "./music.mjs";
import { ART_VOLUME } from "./art.mjs";
import { CIVICS_VOLUME } from "./civics.mjs";
import { LANGUAGES_VOLUME } from "./languages.mjs";
import { LOGIC_VOLUME } from "./logic.mjs";
import { DIGITAL_VOLUME } from "./digital.mjs";
import { MORE_SEEDS } from "./more/index.mjs";

export const VOLUME_SEEDS = [
  ...TECH_VOLUME,
  ...MATHS_VOLUME,
  ...SCIENCE_VOLUME,
  ...HISTORY_VOLUME,
  ...ENGLISH_VOLUME,
  ...GEOGRAPHY_VOLUME,
  ...CODING_VOLUME,
  ...BUSINESS_VOLUME,
  ...HEALTH_VOLUME,
  ...MUSIC_VOLUME,
  ...ART_VOLUME,
  ...CIVICS_VOLUME,
  ...LANGUAGES_VOLUME,
  ...LOGIC_VOLUME,
  ...DIGITAL_VOLUME,
  ...MORE_SEEDS,
];
