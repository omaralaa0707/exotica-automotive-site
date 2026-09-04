"""
Precomputes a per-car, per-position HCL colour histogram from Exotica's own
83 sourced photographs, plus a representative cabin hex per car. Run once,
offline; the output is committed as src/data/histogram.json and imported
directly by the 3D piece -- nothing is fetched or computed at runtime.

Bins: 16 hue sectors (22.5deg) x 6 saturation rings (nonuniform, fine at the
bottom since the whole argument lives near S=0) x 8 lightness levels = 768
chromatic cells, plus 8 achromatic-core cells (one per lightness level, S
below the first ring edge) = 776 cells total per position.
"""
import json, math
from PIL import Image

FRAMES = json.load(open("/tmp/st4shots/brief32/exotica-frames.json"))
IMGROOT = "/tmp/st4shots/"

HUE_N = 16
SAT_EDGES = [0.02, 0.05, 0.10, 0.18, 0.30, 0.50, 1.01]
SAT_N = len(SAT_EDGES) - 1
LIGHT_N = 8

def sat_bin(s):
    for i, e in enumerate(SAT_EDGES):
        if s < e:
            return i - 1 if i > 0 else 0
    return SAT_N - 1

def rgb_to_hsl(r, g, b):
    r, g, b = r / 255, g / 255, b / 255
    mx, mn = max(r, g, b), min(r, g, b)
    l = (mx + mn) / 2
    if mx == mn:
        return 0.0, 0.0, l
    d = mx - mn
    s = d / (2 - mx - mn) if l > 0.5 else d / (mx + mn)
    if mx == r:
        h = ((g - b) / d) % 6
    elif mx == g:
        h = (b - r) / d + 2
    else:
        h = (r - g) / d + 4
    h *= 60
    return h, s, l

def cell_index(h, s, l):
    li = min(LIGHT_N - 1, int(l * LIGHT_N))
    if s < SAT_EDGES[0]:
        return li  # achromatic core: cells 0..LIGHT_N-1
    hi = min(HUE_N - 1, int((h % 360) / (360 / HUE_N)))
    si = sat_bin(s)
    return LIGHT_N + li * (HUE_N * SAT_N) + hi * SAT_N + si

def bin_image(path, stride=6):
    im = Image.open(path).convert("RGB")
    im.thumbnail((240, 240))
    px = im.load()
    w, h = im.size
    counts = {}
    total = 0
    for y in range(0, h, 1):
        for x in range(0, w, 1):
            r, g, b = px[x, y]
            hh, ss, ll = rgb_to_hsl(r, g, b)
            idx = cell_index(hh, ss, ll)
            counts[idx] = counts.get(idx, 0) + 1
            total += 1
    return counts, total

VIVID_S = 0.34   # a bold, saturated hide (cognac, red, brick)
WEAK_S = 0.12    # a present but muted hide (cream, bone) -- still a real hue,
                 # just not one a naive "colour vs grey" threshold would catch
MIN_SAMPLES = 300

def _collect(paths, s_lo):
    samples, total = [], 0
    for p in paths:
        im = Image.open(IMGROOT + p).convert("RGB")
        im.thumbnail((200, 200))
        px = list(im.getdata())
        total += len(px)
        for (r, g, b) in px:
            hh, ss, ll = rgb_to_hsl(r, g, b)
            if ss > s_lo and 0.28 < ll < 0.80:
                samples.append((r, g, b))
    return samples, total

def cabin_hex(paths):
    """Representative hide colour for a car's cabin, plus how confidently it
    was measured. Tries a bold-saturation threshold first (a proper cognac or
    red clears it easily); if too few pixels qualify -- Range Rover's ivory
    cabin has 1 in ~80,000 -- falls back to a lower threshold that still
    excludes true neutrals but catches a muted cream/bone leather. A car that
    fails BOTH (i.e. is genuinely achromatic, not just quiet) gets no hex."""
    vivid, total = _collect(paths, VIVID_S)
    if len(vivid) >= MIN_SAMPLES:
        vivid.sort(key=lambda c: rgb_to_hsl(*c)[1])
        med = vivid[len(vivid) // 2]
        return "#%02X%02X%02X" % med, len(vivid), len(vivid) / total, "vivid"
    weak, total2 = _collect(paths, WEAK_S)
    if len(weak) >= MIN_SAMPLES:
        weak.sort(key=lambda c: rgb_to_hsl(*c)[1])
        med = weak[len(weak) // 2]
        return "#%02X%02X%02X" % med, len(weak), len(vivid) / total, "muted"
    return None, len(vivid), (len(vivid) / total if total else 0), "none"

out = {}
CAR_KEYS = [
    "gmc-yukon-denali", "bmw-320i", "bmw-x7-m60i", "bmw-x1-18i",
    "mercedes-gle-450", "range-rover-p530", "mercedes-glc-43",
]

for key in CAR_KEYS:
    v = FRAMES[key]
    frames = v["frames"][:11]  # cap at the 11 canonical positions
    positions = []
    for f in frames:
        counts, total = bin_image(IMGROOT + f["file"])
        cells = sorted(counts.items(), key=lambda kv: -kv[1])[:220]
        maxc = cells[0][1] if cells else 1
        positions.append({
            "pos": f["pos"],
            "mean": f["mean"],
            "cls": f["cls"],
            "cells": [[i, round(c / maxc, 4)] for i, c in cells],
        })
    colour_files = [f["file"] for f in v["frames"] if f["cls"] == "colour"]
    if not colour_files:
        colour_files = [f["file"] for f in v["frames"] if f["cls"] == "near" and f["pos"] >= 5]
    hexval, sampleN, share, tier = cabin_hex(colour_files) if colour_files else (None, 0, 0, "none")
    out[key] = {
        "positions": positions, "cabinHex": hexval, "n": len(frames),
        "chromaShare": round(share, 5), "chromaSamples": sampleN, "chromaTier": tier,
    }

meta = {
    "hueN": HUE_N, "satN": SAT_N, "lightN": LIGHT_N, "satEdges": SAT_EDGES,
}
json.dump({"meta": meta, "cars": out}, open(
    "/Users/omaralaa/Desktop/work/dealership-sites/exotica-automotive/src/data/histogram.json", "w"
), separators=(",", ":"))
print("done")
for k in CAR_KEYS:
    o = out[k]
    print(k, o["cabinHex"], o["chromaTier"], "share:", o["chromaShare"], "samples:", o["chromaSamples"])
