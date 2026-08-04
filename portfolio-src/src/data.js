// Single source of truth: Pratik_Gurjar_Resume.docx. No numbers or claims beyond it.

export const identity = {
  name: 'Pratik Gurjar',
  eyebrow: 'Backend · Payments infrastructure',
  availability: 'Open to new roles',
  location: 'Indore, India',
  email: 'pratikgurjar66@gmail.com',
  github: 'https://github.com/pratikgurjar',
  linkedin: 'https://www.linkedin.com/in/pratik-gurjar',
  resume: '/Pratik_Gurjar_Resume.pdf',
}

export const about = [
  'Backend engineer, five years in Java, Spring and Go. Most of that time inside payments infrastructure: card authentication, tokenization, routing and settlement reconciliation. The systems that move money and are not allowed to go down.',
  'I have taken issuer-side products live for multiple banks, run on-call for a multi-service authentication stack, led test-coverage drives held in place by merge gates, and spent a satisfying amount of time making slow batch jobs fast and incidents boring. Before payments, I built claims and benefits platforms used by a national veterans agency.',
  'Lately that includes applied AI: an LLM agent that turns natural language into SQL that is safe to run against a live database, and agent-tooling work inside the platform I work on. I like problems where correctness is non-negotiable and the interesting part is proving it.',
]

export const experience = [
  {
    company: 'Razorpay',
    role: 'Product Development Engineer II',
    period: 'Jul 2024 to present',
    context:
      'Card payments in Java, Spring Boot and Go: issuer-side tokenization (TokenHQ) and 3-D Secure (ACS), acquirer-side optimizer.',
    tech: ['Java', 'Spring Boot', 'Go', 'Kubernetes', 'Spinnaker', 'ISO 8583', 'PCI DSS', 'Grafana'],
    bullets: [
      'Owned the EMI rollout on the ACS, taking it live for Yes Bank and staging it for SBI Cards, behind a per-issuer config layer that leaves non-EMI banks untouched.',
      'Fixed a recurring P0 in end-of-day settlement reconciliation by batching per-record Hibernate queries and writes, cutting an 8,000-transaction run from 7-8 minutes to 20 seconds.',
      'Took a merchant live on Pine Labs card EMI: offer discovery and refund-cap handling in the Go gateway adapter, plus the plan-ingestion diagnosis that unblocked the rollout.',
      'Built Spinnaker canary and disaster-recovery pipelines for the five-service 3-D Secure stack on Kubernetes across two issuer banks, with cross-region DR failover.',
      'On-call for the 3-D Secure stack: improved monitoring and alerting, wrote the 42-scenario incident runbook covering HSM, BIN lookup and OTP delivery.',
      'Worked across ISO 8583 transaction processing (jPOS) and the Spring Boot REST portals for TokenHQ, onboarding issuer banks to live traffic.',
      'Escalation point for bank production incidents; ran vulnerability remediation and auditor walkthroughs for PCI DSS recertification.',
      'Led the test-coverage drive across four services from under 26% to over 90%, with a JaCoCo/SonarQube merge gate blocking regressions.',
      'Developed end-to-end test suites for the authentication server and the payment optimizer across five gateways, weighted toward failure paths.',
      'Contributed to the internal agent-skills platform, scoping agent-readiness and integration-test requirements for the 3-D Secure service.',
    ],
    collapsedCount: 5,
  },
  {
    company: 'Resultant Technologies',
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
      'A tool-calling LLM agent retrieves the database schema and generates SQL. Three guard layers make the result safe to execute against a live database.',
    points: [
      { name: 'AST guard', detail: 'JSqlParser parses every generated statement before it runs' },
      { name: 'Read-only transaction', detail: 'Queries execute inside a read-only transaction' },
      { name: 'Statement timeout', detail: 'A hard timeout bounds every execution' },
    ],
    github: 'https://github.com/pratikgurjar/TableTalk',
  },
  {
    name: 'Switchboard',
    strap: 'Never pay the expensive model for a cheap question',
    stack: ['Go', 'React', 'SQLite', 'Prometheus'],
    summary:
      'An OpenAI-compatible gateway that scores each prompt and routes it to the cheapest model tier that can answer it. Benchmark workloads run 35% below a single-model baseline, and every token is accounted for.',
    points: [
      { name: 'Complexity routing', detail: 'Weighted signals score each prompt and pick a tier' },
      { name: 'Confidence escalation', detail: 'A hedged cheap answer re-runs on the premium model' },
      { name: 'Budget caps', detail: 'Per-key spend pressure downgrades routing before the cap' },
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
      { name: 'Ollama', url: 'https://ollama.com/' },
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
  { title: 'Data Structures and Algorithms', detail: 'Scaler · 2023' },
  { title: 'Containers with Docker, Kubernetes and OpenShift', detail: 'Coursera · 2022' },
]
