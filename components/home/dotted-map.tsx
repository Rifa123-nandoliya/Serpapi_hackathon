import { CursorTag } from "@/components/marketing/cursor-tag";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// A dotted world map computed once at module load (deterministic, no images).
// Grid covers lon −170…190, lat 80…−58 at 5° × 4° per dot.
// ---------------------------------------------------------------------------

const COLS = 72;
const ROWS = 35;
const STEP = 10;
const WIDTH = COLS * STEP;
const HEIGHT = ROWS * STEP;

type Blob = [lon: number, lat: number, rLon: number, rLat: number, rotationDeg: number];

// Rough continent shapes as rotated ellipses.
const LAND: Blob[] = [
  [-105, 52, 36, 16, -12], [-122, 64, 26, 8, 0], [-96, 33, 17, 9, -25], [-102, 21, 9, 7, -40],
  [-85, 12, 6, 4, -45], [-42, 72, 12, 7, 0], [-75, 50, 10, 9, 0],
  [-60, -8, 16, 17, 15], [-67, -33, 7, 15, 10],
  [12, 50, 16, 8, 0], [22, 62, 10, 7, 20], [-3, 54, 3, 5, 0], [30, 45, 12, 6, 0],
  [18, 6, 20, 17, 0], [14, 22, 24, 9, 0], [28, -20, 11, 13, 0], [46, -19, 3, 6, 15],
  [90, 52, 48, 15, 0], [105, 35, 22, 11, 0], [78, 21, 7, 11, 0], [137, 38, 4, 8, 30],
  [101, 15, 7, 8, 0], [115, -2, 14, 5, -10], [48, 27, 11, 8, 0], [140, 60, 18, 9, 0],
  [134, -25, 16, 10, 0], [147, -6, 5, 3, 0],
];

function isLand(lon: number, lat: number): boolean {
  return LAND.some(([cx, cy, rx, ry, rot]) => {
    const t = (rot * Math.PI) / 180;
    const dx = lon - cx;
    const dy = lat - cy;
    const x = dx * Math.cos(t) + dy * Math.sin(t);
    const y = -dx * Math.sin(t) + dy * Math.cos(t);
    return (x * x) / (rx * rx) + (y * y) / (ry * ry) <= 1;
  });
}

const DOTS: { x: number; y: number }[] = [];
for (let row = 0; row < ROWS; row += 1) {
  for (let col = 0; col < COLS; col += 1) {
    const lon = -170 + col * 5;
    const lat = 80 - row * 4;
    if (isLand(lon, lat)) DOTS.push({ x: col * STEP + STEP / 2, y: row * STEP + STEP / 2 });
  }
}

function project(lon: number, lat: number) {
  return {
    left: `${(((lon + 170) / 5) * STEP + STEP / 2) / WIDTH * 100}%`,
    top: `${(((80 - lat) / 4) * STEP + STEP / 2) / HEIGHT * 100}%`,
  };
}

type Pin = {
  label: string;
  initials: string;
  lon: number;
  lat: number;
  tone: string;
  pointer: "left" | "right";
  /** Tag above or below the avatar. */
  tagSide: "above" | "below";
  className?: string;
};

const PINS: Pin[] = [
  { label: "Bean Theory · Mumbai", initials: "BT", lon: 72.8, lat: 19, tone: "bg-orange-100 text-orange-700", pointer: "right", tagSide: "above" },
  { label: "StudyGrid · Singapore", initials: "SG", lon: 103.8, lat: 1.3, tone: "bg-emerald-100 text-emerald-700", pointer: "left", tagSide: "below", className: "hidden sm:block" },
  { label: "Notewise · London", initials: "NW", lon: -0.1, lat: 51.5, tone: "bg-violet-100 text-violet-700", pointer: "left", tagSide: "below", className: "hidden sm:block" },
  { label: "FocusForge · San Francisco", initials: "FF", lon: -122.4, lat: 37.8, tone: "bg-rose-100 text-rose-700", pointer: "left", tagSide: "below", className: "hidden sm:block" },
  { label: "PrepPath · São Paulo", initials: "PP", lon: -46.6, lat: -23.5, tone: "bg-sky-100 text-sky-700", pointer: "left", tagSide: "below", className: "hidden md:block" },
];

export function DottedMap() {
  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden" style={{ containerType: "size" }}>
      <div className="absolute inset-x-0 top-0 bottom-0 [mask-image:linear-gradient(to_bottom,black_70%,transparent)]">
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          preserveAspectRatio="xMidYMin meet"
          className="h-full w-full text-neutral-400 dark:text-neutral-600"
        >
          {DOTS.map((d) => (
            <circle key={`${d.x}-${d.y}`} cx={d.x} cy={d.y} r={1.7} fill="currentColor" />
          ))}
        </svg>
      </div>

      {/* Pins share the SVG's box: "xMidYMin meet" = contain, centred horizontally, top-aligned. */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2"
        style={{
          width: `min(100cqw, calc(100cqh * ${WIDTH} / ${HEIGHT}))`,
          height: `min(100cqh, calc(100cqw * ${HEIGHT} / ${WIDTH}))`,
        }}
      >
        {PINS.map((pin) => (
          <div
            key={pin.label}
            className={cn("absolute -translate-x-1/2 -translate-y-1/2", pin.className)}
            style={project(pin.lon, pin.lat)}
          >
            <div className="relative flex flex-col items-center">
              {pin.tagSide === "above" && <CursorTag label={pin.label} pointer={pin.pointer} className="mb-2" />}
              <span
                className={cn(
                  "flex size-9 items-center justify-center rounded-full text-xs font-semibold shadow-[0_4px_12px_-2px_rgb(0_0_0/0.25)] ring-2 ring-white dark:ring-neutral-900",
                  pin.tone,
                )}
              >
                {pin.initials}
              </span>
              {pin.tagSide === "below" && <CursorTag label={pin.label} pointer="none" className="mt-2" />}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
