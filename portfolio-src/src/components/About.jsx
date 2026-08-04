import { about } from '../data.js'
import { useReveal } from '../hooks.js'

// Synthetic ledger lines, obviously fake, streamed in the empty right column.
const TAPE = [
  'AUTH   4021 **** 8814   ₹2,150.00   OK',
  'TOKEN  91XX **** F2     REFRESH     OK',
  '3DS    CHALLENGE        OTP         OK',
  'SETTLE BATCH 0047       T+1         OK',
  'ROUTE  GW-2             RETRY       OK',
  'RECON  DAY CLOSE        MATCHED     OK',
  'EMI    PLAN 06M         APPLIED     OK',
  'AUTH   5310 **** 0042   ₹640.00     OK',
  'CAPTURE                 ₹12,499.00  OK',
  'DR     FAILOVER DRILL   REGION-2    OK',
]

export default function About() {
  const ref = useReveal()
  return (
    <section className="section about-section" id="about" ref={ref}>
      <div className="tape" aria-hidden="true">
        <div className="tape-scroll">
          {[...TAPE, ...TAPE].map((l, i) => (
            <p className="tape-line" key={i}>
              {l}
            </p>
          ))}
        </div>
      </div>
      <div className="section-head rv">
        <p className="section-eyebrow">
          01 · About <span className="stamp">INITIATE</span>
        </p>
        <h2 className="section-title">The short version</h2>
      </div>
      <div className="about">
        {about.map((p, i) => (
          <p className="about-p rv" style={{ '--d': `${i * 0.08}s` }} key={p.slice(0, 24)}>
            {p}
          </p>
        ))}
      </div>
    </section>
  )
}
