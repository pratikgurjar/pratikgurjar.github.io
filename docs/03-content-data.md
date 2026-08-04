# 03. Content and data

## One file holds all the text

`src/data.js` (164 lines) holds every piece of text on the page. No text is
hard-coded inside components.

**Why:** to change your job title or add a skill, you edit one file. You never
touch layout or animation code.

## What is exported

| Export | Type | Contains |
|---|---|---|
| `identity` | object | Name, eyebrow line, availability, location, email, GitHub URL, LinkedIn URL, resume path |
| `about` | array of 3 strings | The three About paragraphs |
| `experience` | array of 2 objects | Razorpay and Resultant: company, role, dates, context line, tech chips, bullet points, how many bullets to show before "+ more" |
| `project` | object | TableTalk: name, strap line, tech stack, summary, the three guard layers |
| `skills` | array of 6 objects | Six groups, each with items. Each item has a name and a documentation URL (or null) |
| `recognition` | array of 3 objects | Degree, exam ranks, competition win |
| `certifications` | array of 2 objects | Scaler DSA, Coursera containers |

## Source of the content

All content comes from the resume file:
`~/Downloads/Resume Latest/Pratik_Gurjar_Resume.docx`

Rules followed:
- No number appears on the site that is not in the resume
- No claim appears that is not in the resume
- Company names appear only in the Experience section (facts of employment)
- The Hero and About sections describe the work without naming employers or banks

## Skill chip links

Each skill has an official documentation link. Example:

```js
{ name: 'Java', url: 'https://dev.java/' }
{ name: 'SQL', url: null }        // no official site, stays unlinked
```

- 38 skills have links
- 27 skills have no link (general concepts like "REST APIs", "Canary",
  "Disaster recovery" have no single official website)

**All 38 URLs were checked with a real HTTP request before being added.** Two
needed correction during checking: MySQL blocks automated requests (verified a
different way), and Kafka's main page timed out once (verified on retry).

## Resume PDF

`public/Pratik_Gurjar_Resume.pdf` (83.2 KB) is served by the "View resume"
button. It was created by converting the `.docx` using Apple Pages, because
Microsoft Word is not installed on this machine.

**Important:** when the resume changes, you must replace this PDF manually. It
does not update itself.
