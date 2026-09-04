/**
 * Exotica Automotive by Hassan Sabry publish every car they sell as an
 * identical eleven-slide carousel, shot in the same grey showroom, in the
 * same fixed order: front 3/4, front straight-on, rear straight-on, rear 3/4,
 * one wheel, dashboard, infotainment, steering wheel & cluster, front seats,
 * rear seats, a closing exterior 3/4. Measured across the 83 sourced frames
 * on disk, position 10 (their eleventh slide) is not a new photograph — it is
 * position 0 (their first) republished at a larger size: luminance RMSE of
 * 0.49-0.52 on an 8-bit 160x107 comparison, max single-pixel difference 2-4
 * levels, across all seven photographed posts without exception. The system
 * has eleven slots and ten pictures.
 *
 * Colour is issued on a fixed schedule inside that loop: positions 0-4 and 10
 * are the exterior, published in black and white (several are true greyscale
 * files); positions 5-9 are the interior, published in full colour. The one
 * measured exception is the GMC Yukon, whose position 5 is a second wheel
 * shot and stays monochrome — the rule holds by subject, not by slot.
 *
 * Every figure below is quoted verbatim from their own captions. Nothing is
 * invented; a blank means the caption did not say.
 */

export type CarId =
  | "yukon-denali"
  | "bmw-320i"
  | "bmw-x7-m60i"
  | "bmw-x1-18i"
  | "rox-01-vip"
  | "gle-450"
  | "range-rover-p530"
  | "glc-43-amg";

/** Maps a CarId to the key used in the sourced frames / histogram data. */
export const HISTOGRAM_KEY: Record<CarId, string | null> = {
  "yukon-denali": "gmc-yukon-denali",
  "bmw-320i": "bmw-320i",
  "bmw-x7-m60i": "bmw-x7-m60i",
  "bmw-x1-18i": "bmw-x1-18i",
  "rox-01-vip": null,
  "gle-450": "mercedes-gle-450",
  "range-rover-p530": "range-rover-p530",
  "glc-43-amg": "mercedes-glc-43",
};

export type Spec = {
  year: string;
  mileage?: string;
  displacement?: string;
  power?: string;
  torque?: string;
  zeroToHundred?: string;
  transmission?: string;
  drivetrain?: string;
  price?: string;
};

export type Car = {
  id: CarId;
  marque: string;
  model: string;
  captionLang: "ar" | "en";
  spec: Spec;
  /** Number of carousel frames actually sourced (11 for most; 12 for the X7,
   *  whose 12th slide repeats its 9th; 5 poster slides for the ROX, none of
   *  them photographs). */
  frameCount: number;
  hasPhotos: boolean;
  quotes?: { ar?: string; en?: string }[];
  features?: string[];
};

export const CARS: Car[] = [
  {
    id: "yukon-denali",
    marque: "GMC",
    model: "Yukon Denali — Black Edition",
    captionLang: "ar",
    spec: {
      year: "2024",
      mileage: "6,000 KM",
      displacement: "6,200cc V8 EcoTec3",
      power: "420 HP",
      transmission: undefined,
      drivetrain: undefined,
    },
    frameCount: 11,
    hasPhotos: true,
    quotes: [
      { ar: "مش مجرد SUV… دي هيبة أمريكية على أربع عجلات" },
      { en: "V8 POWER. DENALI LUXURY. BLACK EDITION PRESENCE." },
    ],
  },
  {
    id: "bmw-320i",
    marque: "BMW",
    model: "320i",
    captionLang: "en",
    spec: {
      year: "2026",
      displacement: "1,600cc TwinPower Turbo 4-cyl",
      power: "170 HP",
      torque: "250 Nm",
      zeroToHundred: "~8.6 s",
      transmission: "7-speed automatic",
      drivetrain: "Rear-wheel drive",
    },
    frameCount: 11,
    hasPhotos: true,
  },
  {
    id: "bmw-x7-m60i",
    marque: "BMW",
    model: "X7 M60i xDrive",
    captionLang: "en",
    spec: {
      year: "2026",
      displacement: "4,395cc TwinPower Turbo V8, 48V mild hybrid",
      power: "530 HP",
      torque: "750 Nm",
      zeroToHundred: "4.7 s",
      transmission: "8-speed automatic",
      drivetrain: "xDrive AWD",
    },
    frameCount: 12,
    hasPhotos: true,
  },
  {
    id: "bmw-x1-18i",
    marque: "BMW",
    model: "X1 sDrive 18i",
    captionLang: "en",
    spec: {
      year: "2025",
      mileage: "6,500 KM",
      displacement: "1,500cc turbo 3-cyl",
      power: "156 HP",
      torque: "230 Nm",
      zeroToHundred: "~9.0–9.7 s",
      transmission: "7-speed dual-clutch (Steptronic)",
      drivetrain: "Front-wheel drive",
    },
    frameCount: 11,
    hasPhotos: true,
  },
  {
    id: "rox-01-vip",
    marque: "ROX",
    model: "01 VIP",
    captionLang: "ar",
    spec: { year: "2026", price: "3,550,000 EGP" },
    frameCount: 5,
    hasPhotos: false,
    quotes: [{ ar: "عرض لفترة محدودة" }],
    features: [
      "Electric running boards",
      "Built-in kitchen",
      "VIP cabin",
      "Driver-assist and safety systems",
    ],
  },
  {
    id: "gle-450",
    marque: "Mercedes-Benz",
    model: "GLE 450 4MATIC",
    captionLang: "en",
    spec: {
      year: "2026",
      mileage: "Zero KM",
      displacement: "3,000cc turbo inline-6, 48V mild hybrid",
      power: "381 HP (+20 HP EQ Boost)",
      transmission: "9G-TRONIC",
      drivetrain: "4MATIC AWD",
    },
    frameCount: 11,
    hasPhotos: true,
  },
  {
    id: "range-rover-p530",
    marque: "Range Rover",
    model: "Vogue P530 Long Wheelbase",
    captionLang: "en",
    spec: {
      year: "2025",
      mileage: "6,000 KM",
      displacement: "4.4L twin-turbo V8, mild hybrid",
      power: "530 HP",
      transmission: "8-speed automatic",
      drivetrain: "AWD, LWB",
    },
    frameCount: 11,
    hasPhotos: true,
  },
  {
    id: "glc-43-amg",
    marque: "Mercedes-Benz",
    model: "GLC 43 AMG",
    captionLang: "en",
    spec: {
      year: "2026",
      mileage: "Zero KM",
      displacement: "2.0L turbo 4-cyl, 48V mild hybrid",
      power: "421 HP (+ up to 14 HP from the integrated starter-generator)",
      transmission: "AMG SPEEDSHIFT MCT 9-speed",
      drivetrain: "AMG Performance 4MATIC AWD",
    },
    frameCount: 11,
    hasPhotos: true,
  },
];

/** Their fixed eleven-slide sequence, in publication order. Position index
 *  matches the frame filename suffix (00/01 .. 10). */
export const POSITIONS = [
  { key: "front34", en: "Front 3/4", ar: "أمامي ٣/٤" },
  { key: "front", en: "Front straight-on", ar: "أمامي مباشر" },
  { key: "rear", en: "Rear straight-on", ar: "خلفي مباشر" },
  { key: "rear34", en: "Rear 3/4", ar: "خلفي ٣/٤" },
  { key: "wheel", en: "One wheel", ar: "جنط واحد" },
  { key: "dash", en: "Dashboard / console", ar: "التابلوه" },
  { key: "infotainment", en: "Infotainment screen", ar: "شاشة الترفيه" },
  { key: "steering", en: "Steering wheel & cluster", ar: "الدركسون وعداد السرعة" },
  { key: "frontSeats", en: "Front seats", ar: "المقاعد الأمامية" },
  { key: "rearSeats", en: "Rear seats", ar: "المقاعد الخلفية" },
  { key: "closing", en: "Closing exterior 3/4", ar: "ختامي خارجي ٣/٤" },
] as const;

export const MEDIA_BASE = "/media";

export function framePath(carId: CarId, pos: number): string {
  const key = HISTOGRAM_KEY[carId];
  return `${MEDIA_BASE}/${key}-${String(pos).padStart(2, "0")}.jpg`;
}

export const PROFILE = {
  handle: "exoticaautomotive",
  instagram: "https://www.instagram.com/exoticaautomotive/",
  bioName: "Exotica Automotive By Hassan Sabry",
  bio: "By Businessman & Chairman @hassanautomotors",
  followers: "45K",
  following: "1",
  posts: "240",
  rendering: "8",
  phone: "+20 120 429 9993",
  phoneHref: "tel:+201204299993",
  address: "ChillOut AUC – South Teseen, New Cairo",
  addressCity: "New Cairo",
  follows: "@hassanautomotors",
  strapline: "EXOTICA AUTOMOTIVE / THE KEY OF LUXURY",
  highlights: [
    "PORSCHE",
    "MERCEDES",
    "SOLD!",
    "BMW",
    "BYD",
    "CADILLAC",
    "TOYOTA",
    "AVATR",
    "⚡️EV⚡️",
  ],
} as const;

/** The room's own measured achromatic values, sampled from their frames. */
export const ROOM = {
  wallPanel: "#BDBDBD",
  facetedWall: "#DFDFDF",
  floorNear: "#292929",
  floorMid: "#474747",
  panelDark: "#242424",
  overallMeanSaturation: 0.086,
} as const;

export const LOOP_EVIDENCE = [
  { carId: "glc-43-amg" as CarId, rmse: 0.512, maxDiff: 3 },
  { carId: "range-rover-p530" as CarId, rmse: 0.486, maxDiff: 4 },
  { carId: "gle-450" as CarId, rmse: 0.521, maxDiff: 3 },
  { carId: "bmw-x1-18i" as CarId, rmse: 0.497, maxDiff: 3 },
  { carId: "bmw-x7-m60i" as CarId, rmse: 0.493, maxDiff: 3, note: "1↔11" },
  { carId: "bmw-320i" as CarId, rmse: 0.513, maxDiff: 4 },
  { carId: "yukon-denali" as CarId, rmse: 0.513, maxDiff: 2 },
] as const;
