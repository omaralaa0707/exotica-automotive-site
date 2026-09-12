import type { ExoticaContent } from "./schema-ext";
import { PROFILE } from "./media";

export const en: ExoticaContent = {
  locale: "en",
  dir: "ltr",

  brand: {
    name: "Exotica Automotive",
    shortName: "Exotica",
    tagline: "The Key of Luxury",
  },

  nav: [
    { label: "The loop", href: "#loop" },
    { label: "The solid", href: "#solid" },
    { label: "The roster", href: "#roster" },
    { label: "Visit", href: "#contact" },
  ],

  hero: {
    eyebrow: "New Cairo · ChillOut AUC, South Teseen",
    headline: "Eleven positions. Ten photographs.",
    sub: "Every car they sell is shot from the same eleven fixed positions, in the same grey room, in the same order — and published with a rule that never breaks: the outside is black and white, the inside is in colour. This page is a measuring instrument pointed at both.",
    primaryCta: "Call the showroom",
    secondaryCta: "See the loop",
    finding: "Their eleventh slide is not a new photograph. It is the first one, republished.",
    counts: [
      { value: PROFILE.posts, label: "posts on Instagram" },
      { value: PROFILE.rendering, label: "render logged out" },
      { value: PROFILE.following, label: "account they follow" },
      { value: "8/9", label: "spec fields on average" },
    ],
  },

  about: { heading: "Exotica Automotive", body: [] },
  services: { heading: "The roster", items: [] },
  gallery: { heading: "The roster", items: [] },

  loop: {
    eyebrow: "The loop",
    heading: "Their carousel has eleven slots and ten pictures",
    intro:
      "Compared pixel by pixel at 160×107 in 8-bit luminance, position 0 (their first slide) and position 10 (their eleventh and last) are the same file — not a re-shoot from the same tripod mark, a re-upload. Across all seven photographed posts the difference is 0.49–0.52 RMSE with a maximum single-pixel gap of 2–4 grey levels out of 255: JPEG re-encoding noise, and nothing else. The BMW X7's post goes further — its twelfth slide repeats its ninth, not its first, so the carousel loops twice in one post.",
    method:
      "Method: both files resized to 160×107, converted to 8-bit luminance, compared pixel by pixel. RMSE below ~1.0 level is re-encoding noise; a genuinely re-shot frame from the same spot would differ by tens of levels from shutter noise and reflection change alone.",
    columns: { car: "Car", rmse: "RMSE (0–255)", note: "Note" },
  },

  solid: {
    eyebrow: "The colour solid",
    heading: "Where their camera puts colour, rendered as a real object",
    intro:
      "Every one of the 78 real photographs behind this page was converted to a histogram of hue, saturation and lightness at build time — nothing here is computed live from an image. Step through a car's eleven positions and watch the object: on the exterior it collapses to a bare grey column standing on the achromatic axis; the moment their camera enters the cabin, a coloured mass grows off that axis, sized to exactly how much of the frame carries colour. Drag the slider to set a saturation threshold and watch every instance outside it turn grey — the exterior column never moves, because there is nothing off-axis to cut.",
    carLabel: "Car",
    positionLabel: "Position",
    caliperLabel: "Saturation threshold",
    caliperReadout: "{pct}% of this frame's pixels clear the threshold",
    emptyRox: "No photograph exists for the ROX 01 VIP. This solid has nothing to render.",
    legendCore: "Achromatic axis — every grey in the room",
    legendChroma: "Chromatic cells — one instance per hue·saturation·lightness bin actually present in the frame",
  },

  positions: {
    eyebrow: "The protocol",
    heading: "The same eleven positions, car after car, without exception",
    intro:
      "Front 3/4, front, rear, rear 3/4, one wheel — five monochrome exterior positions — then dashboard, infotainment, steering wheel, front seats, rear seats — five in full colour — then a closing exterior frame, back to monochrome. Bars below are each position's measured mean saturation, averaged across the seven photographed cars.",
    exceptionLabel: "The one measured exception",
    exceptionNote:
      "The GMC Yukon's position 5 is not the dashboard. It is a second wheel shot, and it stays monochrome (mean saturation 0.0005) — the colour boundary moves one position later for this car alone. The rule is enforced by subject, not by slot.",
    boundaryLabel: "exterior → interior",
  },

  cabins: {
    eyebrow: "The cabins",
    heading: "Seven interiors, measured, not eyeballed",
    intro:
      "Their camera never shows a car's paint in colour. It always shows the seats. Below is each photographed car's own cabin — a swatch built from the median of that car's own saturated, mid-lit pixels, at build time, from its own colour-slide photographs.",
    method:
      "Method: a bold-saturation threshold (S>0.34) is tried first; if fewer than 300 pixels clear it, a lower one (S>0.12) is tried; if neither clears it, no colour is assigned rather than one derived from a handful of outlier pixels.",
    tierVivid: "Vivid hide",
    tierMuted: "Muted hide",
    tierNone: "No reliable hide",
    noneNote: "Only {pct} of this frame's pixels are saturated enough to measure — the flattest cabin on the floor.",
  },

  roster: {
    eyebrow: "The roster",
    heading: "Eight cars, every published figure kept as published",
    intro:
      "The densest specification sheet in the account: displacement, power, torque, 0–100, transmission, drivetrain, mileage — most cars carry six or seven of nine fields. The one field all eight share is the model year. A blank means their caption did not say it, not that the value is zero.",
    exteriorLabel: "Exterior — monochrome, as published",
    interiorLabel: "Interior — colour, as published",
    specLabels: {
      year: "Model year",
      mileage: "Mileage",
      displacement: "Displacement",
      power: "Power",
      torque: "Torque",
      zeroToHundred: "0–100 km/h",
      transmission: "Transmission",
      drivetrain: "Drivetrain",
      price: "Price",
    },
    notStated: "Not stated",
    frameCountNote: "Carousel runs to {n} slides, not eleven.",
  },

  money: {
    eyebrow: "The only price",
    heading: "ROX 01 VIP — the one car with a price, and the one with no photograph",
    intro:
      "Every other listing in this account is a photograph with a specification and no price. This one is the reverse: 3,550,000 EGP, quoted as published, and five slides of designed poster artwork — not a single photograph of the actual car. Per this series' own rule against reproducing designed creative as if it were a camera's record, the artwork is not shown here.",
    featuresLabel: "Listed features, quoted as published",
    noPhotoNote: "No photograph was sourced for this listing, because none exists. The five slides published are poster art with the price printed on them.",
    limitedOffer: "Limited-time offer",
  },

  wall: {
    eyebrow: "The wall",
    heading: "What is on their wall and what is in their writing are different things",
    straplineNote: "This line is painted on their showroom's white faceted wall. It appears in no caption and nowhere in their bio.",
    bioLabel: "Bio, in full",
    followsLabel: "The one account they follow",
    highlightsLabel: "Story highlights, in order",
    highlightsFootnote: "Five of these nine highlights — Porsche, BYD, Cadillac, Toyota, AVATR — name marques that appear in nothing rendering logged out. Noted here as a footnote, not the point: this account's floor-versus-highlights gap is smaller than the pattern this series has already made its spine twice.",
    languagesLabel: "Two languages, two jobs",
    languagesNote: "Six captions are in English and carry a full specification with no price. Two are in Arabic, and those two are the only captions carrying a price or an offer.",
  },

  contact: {
    heading: "Visit",
    addressLabel: "Address",
    address: PROFILE.address,
    addressNote: "New Cairo — the second dealer in this series outside the Nasr City / Heliopolis / Mohandessin cluster.",
    phoneLabel: "Phone",
    phones: [PROFILE.phone],
    mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent("ChillOut AUC South Teseen New Cairo Exotica Automotive")}`,
    instagramUrl: PROFILE.instagram,
    cta: "Call the showroom",
  },

  footer: {
    rights: "© Exotica Automotive. All rights reserved.",
  },

  a11y: {
    toggleLanguage: "التبديل إلى العربية",
    openMenu: "Open menu",
    closeMenu: "Close menu",
  },
};
