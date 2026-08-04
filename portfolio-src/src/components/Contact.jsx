import { useState } from 'react'
import { identity } from '../data.js'
import { useReveal, copyToClipboard } from '../hooks.js'
// Imported (not referenced from /public) so the build content-hashes the file:
// a changed QR can never be served from a stale cache.
import qrUrl from '../assets/contact-qr.svg'

// The rail terminates here: the transaction settles and prints a receipt.
export default function Contact() {
  const ref = useReveal()
  const [copied, setCopied] = useState(false)

  const copy = () => {
    copyToClipboard(identity.email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <section className="section contact" id="contact" ref={ref}>
      <p className="section-eyebrow rv">
        08 · Contact <span className="stamp">SETTLED</span>
      </p>
      <h2 className="contact-title rv">Let's talk payments.</h2>
      <p className="contact-sub rv" style={{ '--d': '0.08s' }}>
        The transaction settled. The receipt is yours.
      </p>
      <div className="receipt rv" style={{ '--d': '0.16s' }}>
        <p className="receipt-head">* TRANSACTION RECEIPT *</p>
        <div className="receipt-line rv" style={{ '--d': '0.28s' }}>
          <span>STATUS</span>
          <span className="fill" />
          <span className="ok">SETTLED ✓</span>
        </div>
        <div className="receipt-line rv" style={{ '--d': '0.36s' }}>
          <span>AVAILABILITY</span>
          <span className="fill" />
          <span>{identity.availability.toUpperCase()}</span>
        </div>
        <div className="receipt-line rv" style={{ '--d': '0.44s' }}>
          <span>LOCATION</span>
          <span className="fill" />
          <span>{identity.location.toUpperCase()}</span>
        </div>
        <div className="receipt-line rv" style={{ '--d': '0.52s' }}>
          <span>AMOUNT DUE</span>
          <span className="fill" />
          <span>ONE EMAIL</span>
        </div>
        <p className="rv" style={{ '--d': '0.6s' }}>
          <button className="email-btn" onClick={copy} aria-label={`Copy email address ${identity.email}`}>
            {identity.email}
            <span className="copy-state" aria-live="polite">
              {copied ? 'copied ✓' : ''}
            </span>
          </button>
        </p>
        <div className="contact-links rv" style={{ '--d': '0.68s' }}>
          <a href={`mailto:${identity.email}`}>Write instead</a>
          <a href={identity.github} target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href={identity.linkedin} target="_blank" rel="noreferrer">
            LinkedIn
          </a>
          <a href={identity.resume} target="_blank" rel="noreferrer">
            Resume
          </a>
        </div>
        <div className="qr rv" style={{ '--d': '0.76s' }}>
          <img src={qrUrl} alt="" width="128" height="128" loading="lazy" />
          <span className="qr-cap">scan to save my contact</span>
        </div>
        <p className="receipt-foot rv" style={{ '--d': '0.84s' }}>
          thank you · come again
        </p>
      </div>
      <div className="receipt-tear" aria-hidden="true" />
    </section>
  )
}
