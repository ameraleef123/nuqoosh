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
 * So: an ellipse seen from above, seats set around it on the ellipse's own
 * geometry, and the head seat left empty — that is where the portrait goes,
 * placed over this drawing in the layout. The remaining seats are the people
 * who are not you, which on a freelancer's page is the client.
 *
 * Static: painted once, never animated. The only moving thing in this hero is
 * the handshake on the table.
 */

const SEATS = 7
const CX = 100
const CY = 74
const RX = 74
const RY = 40

/** Seats are placed on the table's own ellipse and turned to face it, so they
 *  sit at the edge the way chairs actually do rather than on a circle that
 *  happens to be near it. */
function seats() {
  const out: { x: number; y: number; a: number }[] = []
  for (let i = 1; i < SEATS; i++) {
    // Start a step past the head seat and go the whole way round.
    const t = -Math.PI / 2 + (i * 2 * Math.PI) / SEATS
    const x = CX + (RX + 15) * Math.cos(t)
    const y = CY + (RY + 13) * Math.sin(t)
    out.push({ x, y, a: (t * 180) / Math.PI + 90 })
  }
  return out
}

export function MeetingTable() {
  return (
    <svg className="table-plan" viewBox="0 0 200 148" aria-hidden="true" focusable="false">
      {/* The seats, behind the table so the table edge overlaps them. */}
      {seats().map((s, i) => (
        <rect
          key={i}
          className="table-seat"
          x={s.x - 9}
          y={s.y - 7}
          width={18}
          height={14}
          rx={4}
          transform={`rotate(${s.a.toFixed(1)} ${s.x.toFixed(1)} ${s.y.toFixed(1)})`}
        />
      ))}

      {/* The table. */}
      <ellipse className="table-top" cx={CX} cy={CY} rx={RX} ry={RY} />
      <ellipse className="table-edge" cx={CX} cy={CY} rx={RX} ry={RY} />

      {/* What is on it: a laptop at the head, a couple of pads, a cup. */}
      <rect className="table-thing" x={CX - 13} y={CY - 26} width={26} height={16} rx={2} />
      <rect className="table-thing" x={CX - 40} y={CY + 6} width={17} height={12} rx={2} />
      <rect className="table-thing" x={CX + 24} y={CY + 4} width={17} height={12} rx={2} />
      <circle className="table-thing" cx={CX + 46} cy={CY - 12} r={4} />
    </svg>
  )
}
