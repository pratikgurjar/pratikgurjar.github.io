# 04. The payment lifecycle concept

## The core idea

The website is not a list of sections. It is one card payment travelling
through its life. Scrolling the page moves the payment forward.

## The seven stages

| # | Stage | What happens in real payments | Which section carries it |
|---|---|---|---|
| 1 | INITIATE | Payment is created and validated | About |
| 2 | ROUTE | A gateway or terminal is chosen | Experience |
| 3 | AUTHENTICATE | The cardholder proves identity (3-D Secure) | Project |
| 4 | AUTHORIZE | The bank approves and holds the money | Skills |
| 5 | CAPTURE | The merchant claims the approved money | Recognition |
| 6 | CLEAR | Banks exchange the transaction in a batch | Certifications |
| 7 | SETTLED | Money actually moves | Contact |

The Writing section sits between CLEAR and SETTLED and has no stage. It is
reading material, not part of the payment.

## Where this order came from

The order was taken from the payment documentation in the interview-prep corpus
(`docs/04-services/PAYMENTS_CARD_INTERVIEW_PREP.md` and
`docs/05-domain/PAYMENT_AND_REFUND_FLOW.md` on the Desktop). Those files
describe the real service flow:

```
Validate (create) -> Initiate (includes gateway selection)
-> Authentication / 3DS -> Callback -> Authorize -> Capture
```

**No content from those internal documents is on the website.** They were used
only to confirm the order and the correct words. The lifecycle itself is public
industry knowledge (EMVCo and card network standards).

## A mistake that was corrected

The first version used: `INIT, AUTH, ROUTE, CAPTURE, CLEAR, BATCH, SETTLED`.

Two things were wrong:

1. **"AUTH" meant two different things.** In card payments, *authentication*
   (proving who you are) and *authorization* (the bank approving money) are
   separate steps. Using one word for both was incorrect. The proof: the
   article had to label a section "AUTH, again" because there was no word left.

2. **ROUTE was in the wrong place.** Choosing a gateway happens during
   initiation, before authentication. It was placed after.

Also `BATCH` was removed, because clearing already happens in batches. It was a
duplicate of `CLEAR`.

## Where the stages appear on screen

| Place | How it appears |
|---|---|
| Hero wire | Seven tick marks with labels, visible when the mouse is near the line |
| Section headings | A small stamp chip, e.g. `01 · About  [INITIATE]` |
| Rail | A dot for each station; it fills in as the pulse passes |
| Blip | Speaks the stage name when riding past it |
| Article | Section tags matching the same seven names |

## Replay

Scroll down: stamps appear one by one, in order.
Scroll back up: stamps disappear in reverse.

This is deliberate. The journey can be replayed any number of times. It is
driven by the position of the rail pulse, not by a one-time reveal animation.
