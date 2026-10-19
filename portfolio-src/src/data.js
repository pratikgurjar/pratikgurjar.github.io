// Career content follows the latest Pratik_Gurjar_Resume.pdf.

export const identity = {
  name: 'Pratik Gurjar',
  eyebrow: 'Backend · Payments infrastructure',
  availability: 'Immediate Joiner',
  location: 'Indore, India',
  email: 'pratikgurjar66@gmail.com',
  github: 'https://github.com/pratikgurjar',
  linkedin: 'https://www.linkedin.com/in/pratik-gurjar',
  resume: '/Pratik_Gurjar_Resume.pdf',
}

export const about = [
  'Backend engineer with five years in Java, Spring and Go, including card payments infrastructure: authentication, tokenization, routing and settlement reconciliation. The systems that move money and are not allowed to go down.',
  'I have taken issuer-side products live for multiple banks, run on-call for a multi-service authentication stack, led test-coverage drives held in place by merge gates, and spent a satisfying amount of time making slow batch jobs fast and incidents boring. Before payments, I built claims and benefits platforms used by a national veterans agency.',
  'My projects include an LLM agent that turns natural language into SQL with an AST guard, a read-only transaction and a statement timeout. I also contributed to an internal agent-skills platform. I like problems where correctness is non-negotiable and the interesting part is proving it.',
]

export const experience = [
  {
    company: 'Razorpay',
    role: 'Product Development Engineer II',
    period: 'Jul 2024 to Sep 2026',
    context:
      'Card payments in Java, Spring Boot and Go: issuer-side tokenization (TokenHQ) and 3-D Secure (ACS), acquirer-side optimizer.',
    tech: ['Java', 'Spring Boot', 'Go', 'Kubernetes', 'Spinnaker', 'ISO 8583', 'PCI DSS', 'Grafana'],
    bullets: [
      'Owned the EMI rollout on the ACS, taking it live for Yes Bank and staging it for SBI Cards, behind a per-issuer config layer that leaves non-EMI banks untouched.',
      'Fixed a recurring P0 in end-of-day settlement reconciliation by batching per-record Hibernate queries and writes, cutting an 8,000-transaction run from 7-8 minutes to 20 seconds.',
      'Took a merchant live on Pine Labs card EMI, building offer discovery and refund-cap handling in the Go gateway adapter.',
      'Built Spinnaker canary and disaster-recovery pipelines for the five-service 3-D Secure stack on Kubernetes across two issuer banks, with cross-region DR failover.',
      'On-call for the 3-D Secure stack: improved monitoring and alerting, wrote the 42-scenario incident runbook covering HSM, BIN lookup and OTP delivery.',
      'Worked across ISO 8583 transaction processing (jPOS) and the Spring Boot REST portals for TokenHQ, onboarding issuer banks to live traffic.',
      'Escalation point for bank production incidents; ran vulnerability remediation and auditor walkthroughs for PCI DSS recertification.',
      'Led the test-coverage drive across four services from under 26% to over 90%, with code review and a JaCoCo/SonarQube merge gate blocking regressions.',
      'Developed end-to-end test suites for the authentication server and the payment optimizer across five gateways, weighted toward failure paths.',
      'Contributed to the internal agent-skills platform, scoping agent-readiness and integration-test requirements for the 3-D Secure service.',
    ],
    collapsedCount: 5,
  },
  {
    company: 'Resultant Technologies Pvt Ltd',
    role: 'Software Engineer',
    period: 'Jul 2021 to Jun 2024',
    context: 'US Dept of Veterans Affairs claims and benefits platforms (VBMS).',
    tech: ['Java', 'Spring Boot', 'Redis', 'REST'],
    bullets: [
      'Redesigned exam-request and contention processing on the veterans claims platform, cutting processing time 20%, and built payment-method management.',
      'Introduced Redis caching for read-heavy claims lookups, cutting p95 latency on those endpoints 30%.',
      'Integrated a hospitalization reporting app with the Claims Evidence API in VBMS, giving case workers direct access to adjustment claims.',
    ],
    collapsedCount: 3,
  },
]

// Each project renders as one card. `points` are the three ideas the card
// leads with, shown as the boxed row.
export const projects = [
  {
    name: 'TableTalk',
    strap: 'Natural language to SQL, made safe to run',
    stack: ['Java 21', 'Spring Boot 3', 'React', 'TypeScript'],
    summary:
      'A tool-calling LLM agent retrieves the database schema and generates SQL. An AST guard, a read-only transaction and a statement timeout protect execution. Covered by 74 tests.',
    points: [
      { name: 'AST guard', detail: 'JSqlParser parses every generated statement before it runs' },
      { name: 'Read-only transaction', detail: 'Queries execute inside a read-only transaction' },
      { name: 'Statement timeout', detail: 'A hard timeout bounds every execution' },
    ],
    github: 'https://github.com/pratikgurjar/TableTalk',
  },
  {
    name: 'Switchboard',
    strap: 'Cost-optimizing LLM gateway',
    stack: ['Go', 'React'],
    summary:
      'An OpenAI-compatible gateway in Go routes prompts by complexity to the cheapest capable model tier. A golden-set evaluation measured 40% lower spend at 86% routing accuracy and gates deploys.',
    points: [
      { name: 'Complexity routing', detail: 'Prompts route to the cheapest capable tier' },
      { name: 'Measured spend', detail: '40% lower spend on the golden-set evaluation' },
      { name: 'Deployment gate', detail: 'The evaluation gates deploys at 86% routing accuracy' },
    ],
    github: 'https://github.com/pratikgurjar/switchboard',
  },
]

// Chips link to the official home or primary docs. Links verified 1 Aug 2026.
// Plain-concept skills (no canonical site) stay unlinked on purpose.
export const skills = [
  {
    group: 'Languages',
    items: [
      { name: 'Java', url: 'https://dev.java/' },
      { name: 'Go', url: 'https://go.dev/' },
      { name: 'SQL', url: null },
      { name: 'JavaScript', url: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript' },
    ],
  },
  {
    group: 'Frameworks',
    items: [
      { name: 'Spring Boot', url: 'https://spring.io/projects/spring-boot' },
      { name: 'Spring MVC', url: 'https://docs.spring.io/spring-framework/reference/web/webmvc.html' },
      { name: 'REST APIs', url: null },
      { name: 'Hibernate', url: 'https://hibernate.org/' },
      { name: 'JPA', url: 'https://jakarta.ee/specifications/persistence/' },
      { name: 'React', url: 'https://react.dev/' },
      { name: 'Node.js', url: 'https://nodejs.org/' },
      { name: 'JUnit', url: 'https://junit.org/' },
      { name: 'Mockito', url: 'https://site.mockito.org/' },
    ],
  },
  {
    group: 'Data & messaging',
    items: [
      { name: 'PostgreSQL', url: 'https://www.postgresql.org/' },
      { name: 'MySQL', url: 'https://dev.mysql.com/doc/' },
      { name: 'MongoDB', url: 'https://www.mongodb.com/' },
      { name: 'Redis', url: 'https://redis.io/' },
      { name: 'Kafka', url: 'https://kafka.apache.org/' },
      { name: 'SQS', url: 'https://aws.amazon.com/sqs/' },
    ],
  },
  {
    group: 'Cloud & DevOps',
    items: [
      { name: 'AWS (EKS, Lambda, S3)', url: 'https://aws.amazon.com/' },
      { name: 'Kubernetes', url: 'https://kubernetes.io/' },
      { name: 'Docker', url: 'https://www.docker.com/' },
      { name: 'Spinnaker', url: 'https://spinnaker.io/' },
      { name: 'Jenkins', url: 'https://www.jenkins.io/' },
      { name: 'GitHub Actions', url: 'https://github.com/features/actions' },
      { name: 'Canary', url: null },
      { name: 'Blue-green', url: null },
      { name: 'Disaster recovery', url: null },
    ],
  },
  {
    group: 'Payments & observability',
    items: [
      { name: 'EMV 3-D Secure', url: 'https://www.emvco.com/emv-technologies/3-d-secure/' },
      { name: 'ACS', url: 'https://www.emvco.com/emv-technologies/3-d-secure/' },
      { name: 'Tokenization', url: 'https://www.emvco.com/emv-technologies/payment-tokenisation/' },
      { name: 'ISO 8583', url: 'https://www.iso.org/standard/79451.html' },
      { name: 'EMI', url: null },
      { name: 'Reconciliation', url: null },
      { name: 'PCI DSS', url: 'https://www.pcisecuritystandards.org/' },
      { name: 'PGP/SFTP', url: 'https://www.openpgp.org/' },
      { name: 'Grafana', url: 'https://grafana.com/' },
      { name: 'PromQL', url: 'https://prometheus.io/docs/prometheus/latest/querying/basics/' },
      { name: 'Coralogix', url: 'https://coralogix.com/' },
      { name: 'Zenduty', url: 'https://www.zenduty.com/' },
      { name: 'SonarQube', url: 'https://www.sonarsource.com/products/sonarqube/' },
      { name: 'JaCoCo', url: 'https://www.jacoco.org/jacoco/' },
    ],
  },
  {
    group: 'AI/ML',
    items: [
      { name: 'LLM agents', url: null },
      { name: 'Claude', url: 'https://claude.com/' },
      { name: 'OpenAI', url: 'https://openai.com/' },
      { name: 'Gemini', url: 'https://gemini.google.com/' },
      { name: 'MLOps', url: null },
      { name: 'Model deployment', url: null },
      { name: 'GenAI', url: null },
    ],
  },
]

export const recognition = [
  { title: 'MCA, NIT Tiruchirappalli', detail: '7.67 CGPA · 2021' },
  { title: 'AIR 77 · BIT MCA, AIR 82 · NIMCET, AIR 99 · KIITEE', detail: 'MCA entrance exams · 2018' },
  { title: '1st place, Innovision, ACCUMEN’19', detail: 'ACM Student Chapter, NIT Trichy' },
]

export const certifications = [
  { title: 'AWS Generative AI Developer Advanced', detail: 'AWS · 2026' },
  { title: 'Containers with Docker, Kubernetes and OpenShift', detail: 'IBM · 2022' },
]
