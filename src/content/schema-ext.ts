import type { SiteContent } from "@/i18n/schema";
import { useContent } from "@/i18n/locale-provider";
import type { CarId } from "./media";

export type CarCopy = {
  note?: string;
};

export type ExoticaContent = SiteContent & {
  hero: SiteContent["hero"] & {
    counts: { value: string; label: string }[];
    finding: string;
  };
  loop: {
    eyebrow: string;
    heading: string;
    intro: string;
    method: string;
    columns: { car: string; rmse: string; note: string };
  };
  solid: {
    eyebrow: string;
    heading: string;
    intro: string;
    carLabel: string;
    positionLabel: string;
    caliperLabel: string;
    /** Contains "{pct}" -- interpolated by the caller, kept a plain string so
     *  the dictionary can cross the server/client boundary as a prop. */
    caliperReadout: string;
    emptyRox: string;
    legendCore: string;
    legendChroma: string;
  };
  positions: {
    eyebrow: string;
    heading: string;
    intro: string;
    exceptionLabel: string;
    exceptionNote: string;
    boundaryLabel: string;
  };
  cabins: {
    eyebrow: string;
    heading: string;
    intro: string;
    method: string;
    tierVivid: string;
    tierMuted: string;
    tierNone: string;
    /** Contains "{pct}". */
    noneNote: string;
  };
  roster: {
    eyebrow: string;
    heading: string;
    intro: string;
    exteriorLabel: string;
    interiorLabel: string;
    specLabels: Record<string, string>;
    notStated: string;
    /** Contains "{n}". */
    frameCountNote: string;
  };
  money: {
    eyebrow: string;
    heading: string;
    intro: string;
    featuresLabel: string;
    noPhotoNote: string;
    limitedOffer: string;
  };
  wall: {
    eyebrow: string;
    heading: string;
    straplineNote: string;
    bioLabel: string;
    followsLabel: string;
    highlightsLabel: string;
    highlightsFootnote: string;
    languagesLabel: string;
    languagesNote: string;
  };
  contact: SiteContent["contact"] & {
    addressNote: string;
  };
};

export function useExotica() {
  return useContent() as ExoticaContent;
}

export type { CarId };
