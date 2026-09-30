/**
 * The مَجلِس table — drawn, seen from above.
 *
 * The brief was a business template for a freelancer, and the body the owner
 * asked for was the meeting. The catalogue is full of meeting illustrations
 * and not one of them can be used, for the reason that keeps recurring here:
 * **they already contain people.** Drop a portrait next to a drawing of four
 * strangers around a table and the portrait is a fifth stranger. The only way
 * the person can be AT the table is to draw the table.
 *
 * Second pass (2026-09-30), after «زبطو ودقق بالباك قراوند واعطيه جماليات»:
 * the first table was a small grey ellipse with grey blobs for chairs, which
 * is a diagram. This one is furniture — a long walnut boardroom table with a
 * shadow on the floor, chairs with backs turned to face it, and what a real
 * meeting leaves on a table: a laptop, notepads, cups, a folder, a phone.
 *
 * The HEAD of the table is its short end, not the middle of a long side, so
 * the empty head seat is at the start end and the portrait is placed over it
 * in the layout. In RTL the whole drawing is mirrored (it is static) so the
 * head stays at inline-start.
 *
 * Static: painted once, never animated. The only moving thing in this hero is
 * the handshake on the table.
 */

const W = 260
const H = 170
const CX = 130
const CY = 85

/** Chairs: [cx, cy, rotation]. Back is at -y before rotation, so 0 = a chair on
 *  the far long side facing down, 180 = the near side, ±90 = the two ends. */
const CHAIRS: readonly (readonly [number, number, number])[] = [
  [86, 33, 0],
  [130, 33, 0],
  [174, 33, 0],
  [86, 137, 180],
  [130, 137, 180],
  [174, 137, 180],
  [237, 85, 90], // the foot
  [23, 85, -90], // the head — the portrait sits here
]

function Chair({ x, y, a }: { x: number; y: number; a: number }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${a})`}>
      {/* The back, a little wider than the seat. */}
      <rect className="table-seat-back" x={-10.5} y={-10.5} width={21} height={5} rx={2.5} />
      {/* The seat. */}
      <rect className="table-seat" x={-9} y={-6.5} width={18} height={14} rx={4} />
    </g>
  )
}

export function MeetingTable() {
  return (
    <svg className="table-plan" viewBox={`0 0 ${W} ${H}`} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="table-wood" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" className="table-wood-a" />
          <stop offset="1" className="table-wood-b" />
        </linearGradient>
        <filter id="table-soft" x="-10%" y="-20%" width="120%" height="150%">
          <feGaussianBlur stdDeviation="3.5" />
        </filter>
      </defs>

      {/* The shadow the table throws on the floor. */}
      <rect className="table-shadow" x={44} y={56} width={172} height={70} rx={35} filter="url(#table-soft)" />

      {/* The chairs, behind the table so its edge overlaps them. */}
      {CHAIRS.map(([x, y, a], i) => (
        <Chair key={i} x={x} y={y} a={a} />
      ))}

      {/* The table: a long stadium, walnut, with a lit rim. */}
      <rect className="table-top" x={44} y={50} width={172} height={70} rx={35} fill="url(#table-wood)" />
      <rect className="table-edge" x={44} y={50} width={172} height={70} rx={35} />
      {/* A grain line or two, so it reads as wood and not as paint. */}
      <path className="table-grain" d="M66 70 Q 130 64, 194 72" />
      <path className="table-grain" d="M60 100 Q 130 106, 200 98" />

      {/* What is on it, from the head down: a laptop at the head seat, a
          notepad and cup on each side, a folder in the template's own colour
          near the foot, a phone face-down. */}
      <g transform={`translate(${CX} ${CY})`}>
        {/* Laptop at the head, screen toward the head seat. */}
        <rect className="table-laptop" x={-72} y={-9} width={15} height={20} rx={1.5} />
        <rect className="table-screen" x={-70.5} y={-7} width={5} height={16} rx={0.8} />
        {/* Notepads. */}
        <rect className="table-pad" x={-40} y={-26} width={16} height={11} rx={1} transform="rotate(-6 -32 -20)" />
        <rect className="table-pad" x={18} y={15} width={16} height={11} rx={1} transform="rotate(7 26 20)" />
        <line className="table-pen" x1={-38} y1={-17} x2={-26} y2={-19} />
        <line className="table-pen" x1={21} y1={26} x2={33} y2={24} />
        {/* Cups, one on each side. */}
        <circle className="table-cup" cx={-12} cy={-22} r={3.6} />
        <circle className="table-cup-handle" cx={-7.6} cy={-22} r={2} />
        <circle className="table-cup" cx={44} cy={22} r={3.6} />
        <circle className="table-cup-handle" cx={48.4} cy={22} r={2} />
        {/* The folder, closed, near the foot. */}
        <rect className="table-folder" x={46} y={-24} width={24} height={16} rx={1.5} />
        <rect className="table-folder-tab" x={46} y={-26} width={9} height={3} rx={1} />
        {/* A phone, face down. */}
        <rect className="table-phone" x={-52} y={16} width={7} height={12} rx={1.5} />
      </g>
    </svg>
  )
}
