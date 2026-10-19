# 03. Content and data

## Career content in one file

`src/data.js` holds career details, projects, skills, recognition, and
certifications. Some interface copy lives in components and metadata.

**Why:** to change your job title or add a skill, you edit one file. You never
touch layout or animation code.

## What is exported

| Export | Type | Contains |
|---|---|---|
| `identity` | object | Name, eyebrow line, availability, location, email, GitHub URL, LinkedIn URL, resume path |
| `about` | array of 3 strings | The three About paragraphs |
| `experience` | array of 2 objects | Razorpay and Resultant: company, role, dates, context line, tech chips, bullet points, how many bullets to show before "+ more" |
| `projects` | array of 2 objects | TableTalk and Switchboard: names, stack, summaries, and key points |
| `skills` | array of 6 objects | Six groups, each with items. Each item has a name and a documentation URL (or null) |
| `recognition` | array of 3 objects | Degree, exam ranks, competition win |
| `certifications` | array of 2 objects | AWS Generative AI Developer Advanced, IBM containers |

## Source of the content

Career content follows the latest `Pratik_Gurjar_Resume.pdf`.

Career-content rules:
- Career metrics and claims follow the resume
- Decorative transaction examples are synthetic, not resume claims
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

`public/Pratik_Gurjar_Resume.pdf` is served by the "View resume" button.

**Important:** when the resume changes, you must replace this PDF manually. It
does not update itself.
