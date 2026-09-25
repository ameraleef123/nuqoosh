/**
 * The فن marks — one drawn family for the arts that have no curtain.
 *
 * The template's brief was "all the arts in one place", and a collection is
 * exactly the kind of abstraction that has sunk templates here before: a list
 * of subjects is not an object. The place that actually gathers them is a
 * STAGE — drama happens on it, music is played on it, the set behind it is
 * painted, and the light on it is its own craft. So the stage is the body, and
 * these are the crafts standing on it.
 *
 * They are drawn rather than fetched for one reason: four separate catalogue
 * icons would arrive in four different line weights and four different
 * personalities, and would read as a sticker sheet. Drawn together they are
 * one hand. Each carries its own pigment, which is the only place in the set
 * where a template uses more than one colour — and they are decoration only,
 * never behind text, so no measurement depends on them.
 */

/** A quaver: the note everyone draws when they mean music. */
export function MarkMusic() {
  return (
    <svg className="art-mark" data-art-mark="music" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M9 18V5l10-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="16" cy="16" r="3" />
    </svg>
  )
}

/** A loaded brush, mid-stroke. */
export function MarkPaint() {
  return (
    <svg className="art-mark" data-art-mark="paint" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M17 3l4 4-9 9-4-4z" />
      <path d="M8 12l-3 3c-1 1-1 3 0 4s3 1 4 0l3-3" />
      <path d="M4 21c1.5 0 2-1 2-2" />
    </svg>
  )
}

/** A frame of film: cinema, and the newest of them. */
export function MarkFilm() {
  return (
    <svg className="art-mark" data-art-mark="film" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <rect x="2.5" y="5" width="19" height="14" rx="2" />
      <path d="M7 5v14M17 5v14" />
      <path d="M2.5 12h19" />
    </svg>
  )
}

/** A pen nib: writing, which is the art the others are usually about. */
export function MarkWord() {
  return (
    <svg className="art-mark" data-art-mark="word" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path d="M12 2l5 9-5 11-5-11z" />
      <path d="M7 11h10" />
      <circle cx="12" cy="13.5" r="1.4" />
    </svg>
  )
}

const MARKS = [MarkMusic, MarkPaint, MarkFilm, MarkWord] as const

/** The set, for the stage floor: the crafts standing together. */
export function ArtMarks() {
  return (
    <div className="art-marks" aria-hidden="true">
      {MARKS.map((Mark, i) => (
        <Mark key={i} />
      ))}
    </div>
  )
}

/** One mark, cycling by index — each card on the page carries a different
 *  craft, so a list of projects reads as a programme. */
export function ArtMarkAt({ index }: { index: number }) {
  const Mark = MARKS[index % MARKS.length]
  return <Mark />
}
