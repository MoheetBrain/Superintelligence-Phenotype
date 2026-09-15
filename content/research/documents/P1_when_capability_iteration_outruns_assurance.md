# When Capability Iteration Outruns Assurance: A Queueing Model of Frontier-AI Safety

**Moheet Khawaja**  
Working paper v0.1 — 14 September 2026  
Independent research programme / University of Westminster  

> **Epistemic and provenance note.** The motivating claim—*if capability-changing AI iterations arrive faster than humans and evaluators can establish current safety evidence, governance can lose temporal control*—originated in the author's prior exploratory work (**O→F; thesis 16**). The use of ordinary queueing notation \(\lambda,\mu\) for AI-review throughput is **not claimed as original**: closely related public commentary and prior assurance work already exist. The candidate contribution of this paper is narrower: a capability-conditioned assurance-workload model with evidence staleness, refresh work, heterogeneous safety evidence, and endogenous capability acceleration. All numerical work below is **proposed**, not reported empirical evidence.

## Abstract

Frontier-AI assurance is usually framed as a question of whether a model satisfies a safety threshold. This paper studies a different failure mode: whether the process used to establish safety can remain dynamically current while the underlying system changes. I model materially safety-relevant capability changes as arrivals that induce heterogeneous assurance workloads, while evaluation, red-teaming, interpretability, safety-case construction, external review, and mitigation validation form a finite service process. Prior evidence can be partially reusable but may lose validity as capabilities, deployment conditions, or safeguards change. This yields an **assurance load** \(\rho_t\), an **assurance reserve** that can decay, and a capability-dependent **assurance crossover** at which required validated work outpaces effective assurance capacity. Elementary propositions show that positive excess workload causes expected backlog to diverge, that differential exponential scaling creates a finite crossover, and that evidence refresh can destabilize assurance even when new-change workload alone appears subcritical. These results do not show that any current laboratory is unsafe or that catastrophe is inevitable. They provide a measurement framework and a falsifiable question: do safety-relevant changes, including AI-assisted R&D acceleration, create assurance demand faster than validated assurance capacity and evidence reuse can compensate? The paper specifies a proposed public-data calibration, simulation programme, falsifiers, and policy interventions that act on either side of the queue.

## 1. Introduction

A safety claim about a frontier AI system is made at a time, for a system state, in an operating environment, with a body of evidence. None of those objects is necessarily stationary. Model weights change. Agent scaffolds change. Tool access changes. Safeguards change. Deployment volumes change. Threat actors adapt. New elicitation methods reveal previously hidden capabilities. New evaluations may invalidate an earlier belief that a model is below a capability threshold.

This creates a process problem distinct from the usual static safety question.

Let the ordinary question be:

\[
\text{Is system }M_t\text{ acceptably safe under evidence }E_t?
\]

The process question is:

\[
\boxed{
\text{Can credible evidence }E_t\text{ be produced, checked, and refreshed fast enough to remain current as }M_t\text{ changes?}
}
\]

The distinction matters because a perfectly designed evaluation regime can still fail operationally if the volume, complexity, or expiration rate of required assurance work exceeds the capacity available to perform it. Conversely, rapid model iteration need not be dangerous if evidence is highly reusable, evaluation automates reliably, or deployment is throttled when assurance is incomplete.

The paper therefore does **not** assume that capability growth implies loss of control. It asks for a measurable stability condition on the process that mediates capability growth and deployment.

### 1.1 Research question

> **Under what measurable conditions does the rate and complexity of safety-relevant frontier-model change exceed the capacity of an organisation, evaluator ecosystem, or regulator to generate, validate, and maintain current safety evidence?**

### 1.2 Claimed contribution

The contribution is deliberately narrower than the phrase “AI governance has a throughput problem.” That throughput analogy already exists in public commentary, while dynamic safety cases, safety debt, and standards lag all identify adjacent forms of assurance obsolescence.

This paper instead proposes a joint model containing four objects that are often treated separately:

1. **capability-conditioned arrivals** of materially safety-relevant changes;
2. **heterogeneous assurance workloads** induced by those changes;
3. **finite validated-assurance capacity** rather than raw testing volume;
4. **evidence depreciation and refresh work**, so completed safety work may re-enter the queue when its supporting assumptions become stale.

The model is then extended to the case in which AI-assisted AI R&D increases the arrival rate of material changes.

### 1.3 What the paper does not establish

Nothing in the analysis proves:

- that current frontier developers have unstable assurance processes;
- that a particular evaluation package is sufficient;
- that an AI system is misaligned;
- that recursive self-improvement will occur;
- that a queue crossing implies catastrophe;
- or that slowing capability development is always the welfare-maximising policy.

The propositions establish implications **conditional on explicit process assumptions**.

## 2. Related work

### 2.1 Safety cases and dynamic assurance

Buhl et al. argue for safety cases as structured, evidence-backed arguments that frontier systems are sufficiently safe in context. Hilton et al. further develop safety cases as a scalable mechanism for implementing frontier safety commitments. Cârlan et al. explicitly address the need to update safety cases as capabilities, operating conditions, and evidence change, proposing a Dynamic Safety Case Management System. These works motivate treating safety assurance as a maintained process rather than a one-off document.

The present paper does not compete with safety cases. It asks whether the **work required to keep such a case current** can remain within available validated-assurance capacity.

### 2.2 Safety debt and assurance lag

Wallich and Douglas introduce **AI safety debt**: unresolved gaps between the safety approach a system has and the approach it needs. Crucially, they emphasize that evidence can degrade as capability regimes shift. Maxwell's **Assurance Gap** analyzes structural lag between rapid model deployment and slower standards, accreditation, and conformity-assessment processes. Both are close neighbours.

The contribution here is a process model that makes accumulation, refresh work, and capacity constraints explicit and produces a stability condition.

### 2.3 Human-review throughput

Public commentary has already applied the elementary queue analogy \(\lambda\) = AI actions and \(\mu\) = human review rate to AI governance. The present paper therefore **does not claim novelty for the inequality \(\lambda>\mu\)**. Its unit of arrival is different: not every AI action, but a **material change to the evidence obligations of a frontier safety claim**. Its service unit is also stricter: assurance is completed only when evidence satisfies a pre-specified validation standard.

### 2.4 AI-assisted AI R&D

Recent frontier-lab evidence indicates that AI systems already perform substantial fractions of implementation, experimentation, and code review in AI development. Anthropic explicitly distinguishes current AI-assisted development from full recursive self-improvement and identifies human direction-setting as a remaining bottleneck. This makes an endogenous increase in iteration frequency a plausible scenario to model without assuming closed-loop RSI.

### 2.5 Queueing theory

The mathematical backbone is conventional queueing and workload theory. This is a strength rather than a novelty claim: the purpose is to import a mature language for stability, backlog, service capacity, heavy-tailed workloads, priority scheduling, abandonment, and admission control into a specific frontier-assurance setting.

## 3. Formal model

### 3.1 Capability state

Let

\[
C_t\in\mathcal C
\]

be the safety-relevant state of a frontier system at time \(t\). It may be scalar for a toy model, but the intended object is a vector containing, for example, autonomous task horizon, cyber capability, persuasion, self-replication, tool access, deployment scale, and safeguard state.

A model version change is not automatically a safety-relevant arrival. Define a materiality function

\[
m(C_{t^-},C_t,Z_t)\in\{0,1\},
\]

where \(Z_t\) is operating context. An arrival occurs only when \(m=1\): the change requires new evidence, revalidation, or a decision about whether old evidence remains applicable.

Let

\[
N(t)
\]

be the counting process of material change episodes and

\[
\lambda_C(t)
\]

the associated conditional intensity.

### 3.2 Assurance workload

Material episode \(i\) induces a random workload

\[
W_i\ge 0.
\]

\(W_i\) is not simply person-hours. It is an abstract amount of **validated assurance work**. Depending on the implementation it can be measured in evaluator-hours, calendar days on a critical path, compute-normalized test work, or a composite unit.

Its expected magnitude may depend on capability and the size/type of the change:

\[
\mathbb E[W_i\mid C_i,\Delta C_i,Z_i]
=
 w(C_i,\Delta C_i,Z_i).
\]

A key empirical question is whether

\[
\frac{\partial w}{\partial C}>0,
\]

for at least some capability dimensions. More capable models may require more adversarial testing, more secure environments, stronger monitors, more external review, or broader test coverage. That relationship is a hypothesis, not a theorem.

### 3.3 Effective service capacity

Let

\[
\mu_E(t)>0
\]

be the rate at which the assurance system can complete **validated** work. Raw model-generated evaluations do not automatically count as service. If an automated evaluator is fast but systematically shares the target model's blind spots, its effective contribution to \(\mu_E\) should be discounted.

One implementation is

\[
\mu_E(t)
=
\sum_{j=1}^{J} r_j(t)\,q_j(t),
\]

where \(r_j\) is raw evaluation throughput of channel \(j\) and \(q_j\in[0,1]\) is an empirically justified quality/reliability multiplier. The decomposition is optional; the model only requires finite effective capacity.

### 3.4 Backlog

In discrete periods, let \(A_t\) be assurance workload arriving and \(S_t\) workload successfully completed. Define backlog

\[
B_{t+1}
=
\max\{0,B_t+A_t-S_t\}.
\tag{1}
\]

A high \(B_t\) need not imply unsafe deployment if the organisation automatically blocks affected capabilities until assurance is complete. It does imply either a growing delay, rejected work, or pressure to change the evidence/deployment standard.

### 3.5 Evidence validity and refresh work

Completed evidence is not necessarily permanent. Let an item of evidence \(e\) have age \(\tau\) and face capability/context change \(\Delta C\). Define retained validity

\[
q_e(\tau,\Delta C)\in[0,1],
\qquad
q_e(0,0)=1.
\tag{2}
\]

This function is claim-specific. A formal proof about a fixed algorithm may have slow depreciation; a behavioural evaluation of an earlier model may depreciate quickly after a major model or scaffold change.

Let \(\lambda_R(t)\) denote the rate at which old evidence requires refresh, and \(W_R\) its workload. Total offered assurance workload is then

\[
L(t)
=
\lambda_C(t)\mathbb E[W_C(t)]
+
\lambda_R(t)\mathbb E[W_R(t)].
\tag{3}
\]

### 3.6 Assurance load and crossover

Define utilization/offered load

\[
\rho(t)
=
\frac{L(t)}{\mu_E(t)}.
\tag{4}
\]

For a scalar capability index \(C\), define the **assurance crossover**

\[
C^*
=
\inf\left\{
C:
\rho(C)\ge 1
\right\}.
\tag{5}
\]

This is not asserted to exist in reality. It is a diagnostic threshold whose existence and location are empirical questions.

### 3.7 Assurance reserve

An alternative state variable is an assurance reserve \(R(t)\): the amount of current, decision-relevant evidence above a minimum required standard. A toy continuous model is

\[
\dot R(t)
=
\mu_E(t)
-
\lambda_C(t)w(C_t)
-
\delta_E(t)R(t),
\tag{6}
\]

where \(\delta_E\) is an evidence-depreciation rate. Equation (6) deliberately compresses heterogeneous claims into one scalar and should therefore be used only for qualitative phase analysis unless a defensible aggregation rule is supplied.

## 4. Assumptions

The main assumptions are:

- **A1 — Materiality.** There exists an operational rule for determining which changes materially affect safety evidence.
- **A2 — Positive assurance work.** Material changes induce nonzero expected validated-assurance workload.
- **A3 — Finite effective capacity.** \(\mu_E(t)<\infty\) over the relevant horizon.
- **A4 — Possible staleness.** Some safety evidence can lose applicability after system or context change.
- **A5 — Quality discipline.** Work counts as service only if it satisfies a declared validation criterion; speed cannot be increased merely by lowering the assurance standard without recording that change.
- **A6 — Admission policy is explicit.** If deployment is blocked whenever affected assurance is incomplete, that policy is modeled as throttling/admission control rather than ignored.
- **A7 — Optional recursive acceleration.** AI-assisted R&D can increase \(\lambda_C\), reduce inter-arrival times, increase change magnitude, or some combination of these. The paper does not assume full RSI.

## 5. Analytical propositions

### Proposition 1 — Positive excess workload produces unbounded expected backlog

Consider (1). Suppose \((A_t,S_t)\) have finite expectations, and for all \(t\),

\[
\mathbb E[A_t-S_t]\ge \varepsilon>0.
\]

Then

\[
\mathbb E[B_T]
\ge
B_0+T\varepsilon,
\]

so expected backlog diverges at least linearly.

#### Proof

Since \(\max(0,x)\ge x\),

\[
B_{t+1}
\ge
B_t+A_t-S_t.
\]

Iterating,

\[
B_T
\ge
B_0+
\sum_{t=0}^{T-1}(A_t-S_t).
\]

Taking expectations gives

\[
\mathbb E[B_T]
\ge
B_0+
\sum_{t=0}^{T-1}\mathbb E[A_t-S_t]
\ge
B_0+T\varepsilon.
\]

Therefore \(\mathbb E[B_T]\to\infty\). \(\square\)

**Interpretation.** This is a workload accounting result, not an AI-catastrophe theorem. If an organisation accepts more required assurance work than it validates, it must eventually accumulate delay, reject/defer work, add capacity, reuse evidence, or relax requirements.

### Proposition 2 — Differential exponential scaling yields a finite assurance crossover

Suppose new assurance demand and service capacity scale as

\[
L(t)=ae^{rt},
\qquad
\mu_E(t)=be^{st},
\]

with \(0<a<b\) and \(r>s\). Then a unique positive crossover occurs at

\[
t^*
=
\frac{\ln(b/a)}{r-s}.
\tag{7}
\]

#### Proof

Set \(L(t)=\mu_E(t)\):

\[
ae^{rt}=be^{st}.
\]

Hence

\[
e^{(r-s)t}=\frac ba,
\]

and therefore (7). Positivity follows from \(b>a\) and \(r>s\). Uniqueness follows from monotonicity of \(e^{(r-s)t}\). \(\square\)

**Interpretation.** Even an initially comfortable assurance margin can vanish if required workload scales persistently faster than effective assurance throughput. Whether real processes follow exponential scaling is an empirical question.

### Proposition 3 — Refresh work can create instability below the nominal new-change threshold

Let

\[
L_C=\lambda_C\mathbb E[W_C]
\]

be new-change workload and

\[
L_R=\lambda_R\mathbb E[W_R]
\]

refresh workload. Suppose

\[
L_C<\mu_E
\]

but

\[
L_C+L_R>\mu_E.
\]

Then the total process satisfies the condition of Proposition 1 even though a monitor that tracks only new-change work reports apparent spare capacity.

#### Proof

Set \(A_t=A^C_t+A^R_t\). Under the stated mean inequalities,

\[
\mathbb E[A_t-S_t]
=
L_C+L_R-\mu_E>0.
\]

Apply Proposition 1. \(\square\)

**Interpretation.** An assurance system can look well provisioned if it counts only new evaluations while ignoring revalidation caused by staleness.

### Proposition 4 — Sufficient admission control can stabilize workload at the cost of deployment delay

Suppose a controller can admit at most workload \(\bar A_t\) each period and chooses

\[
\mathbb E[\bar A_t]\le \mathbb E[S_t]-\eta
\]

for some \(\eta>0\). Under standard regularity assumptions for the resulting queue, offered load can be kept below one. The cost is that non-admitted capability/deployment changes wait upstream.

**Status.** This is an ordinary admission-control insight, included to avoid a common misinterpretation: \(\rho>1\) is not fate. It identifies the amount of throttling/capacity expansion/evidence reuse required to restore stability.

## 6. Recursive-acceleration extension

A minimal endogenous model is

\[
\lambda_C(t)
=
\lambda_0\exp\{\alpha K_t\},
\tag{8}
\]

where \(K_t\in[0,1]\) measures the degree to which AI contributes to the AI-R&D loop. Let

\[
\dot K_t=g(C_t,K_t,H_t),
\]

where \(H_t\) represents remaining human bottlenecks.

Equation (8) is a modelling assumption, not an empirical finding. It captures a family of scenarios in which more automated R&D shortens the interval between material system changes.

Assurance can also automate:

\[
\mu_E(t)=\mu_0\exp\{\beta J_t\},
\tag{9}
\]

where \(J_t\) is automation of trustworthy evaluation. The safety-process question becomes comparative:

\[
\frac{d\log L(t)}{dt}
\quad\text{versus}\quad
\frac{d\log\mu_E(t)}{dt}.
\tag{10}
\]

The dangerous process regime is not “AI improves quickly” by itself. It is

\[
\boxed{
\frac{d\log L}{dt}
>
\frac{d\log\mu_E}{dt}
\quad\text{for long enough that reserve is depleted or backlog becomes decision-relevant.}
}
\]

This framing also makes a positive possibility explicit: if automated evaluation and formal verification become reliable enough that \(\mu_E\) scales at least as quickly as required workload, capability acceleration need not create an assurance crisis.

## 7. Proposed empirical programme

**No empirical study has yet been run for this manuscript. Everything in this section is a proposed experiment/data-collection plan.**

### 7.1 Unit of analysis

The appropriate unit is a **material assurance episode**, not every public model release. Candidate episodes include:

- a system crossing a published capability threshold;
- a deployment change that materially expands tool/network access;
- discovery of a previously unknown capability;
- a safeguard change that invalidates earlier testing;
- a new elicitation technique causing a prior “inability” claim to be revisited;
- a major agent scaffold change;
- a model update that triggers independent re-evaluation.

### 7.2 Proposed public dataset

For each episode, record:

| Variable | Proposed operationalisation |
|---|---|
| `event_date` | date material change became known |
| `capability_family` | cyber, autonomy, persuasion, bio, self-replication, etc. |
| `delta_C_proxy` | standardized benchmark/evaluation change |
| `assurance_start` | first documented re-evaluation/safety-case work |
| `assurance_complete` | date a declared assurance package was complete |
| `independent_review_date` | external validation if present |
| `reused_evidence_fraction` | proportion of previous evidence accepted without rerun |
| `refresh_trigger` | reason prior evidence was reopened |
| `deployment_status` | blocked, limited, unchanged, expanded |
| `source_quality` | primary / evaluator / secondary |

The dataset should use immutable source snapshots and a coding manual with inter-rater checks.

### 7.3 Estimands

Estimate:

\[
\hat\lambda_C(t),
\qquad
\hat w(C,\Delta C),
\qquad
\hat\mu_E(t),
\qquad
\hat q(\tau,\Delta C),
\qquad
\hat\rho(t).
\]

Calendar duration should not automatically be treated as workload. A survival/competing-risk model can distinguish active evaluation time from waiting for compute, external review, policy approval, or undisclosed causes when such distinctions are observable.

### 7.4 Proposed identification strategy

Causal identification will be difficult because faster-moving labs may also invest more heavily in evaluation. The first paper should therefore be descriptive/mechanistic rather than claiming a clean causal effect of capability acceleration on assurance lag.

Potential quasi-experimental comparisons include:

- the same evaluation family repeated across successive model generations;
- internal versus external review latency for the same safety claim;
- threshold-triggered assurance requirements before and after framework changes;
- episodes in which evidence was reused versus substantially regenerated.

### 7.5 Proposed simulations

Simulate four model classes:

1. **M/G/c queue** with heterogeneous assurance workloads;
2. **self-exciting arrival process** for clustered capability discoveries;
3. **evidence-expiry queue** in which completed claims probabilistically return as refresh jobs;
4. **controlled queue** with deployment admission, evaluator scaling, and risk-priority scheduling.

For every simulation publish the full parameter grid rather than one illustrative trajectory.

## 8. Baselines and model comparison

The enriched model should be compared against:

1. simple \(\lambda/\mu\) throughput;
2. fixed-cadence safety review;
3. a safety-debt ledger without explicit dynamics;
4. dynamic safety-case maintenance without a capacity constraint;
5. proportional evaluator-budget scaling;
6. an idealized formal-verification case with near-perfect evidence persistence.

A useful contribution exists only if the richer model changes a decision-relevant conclusion under plausible parameter ranges—for example, if evidence expiry creates a crossover that the simple \(\lambda/\mu\) model misses.

## 9. Falsification and sensitivity analysis

The substantive thesis should be weakened if empirical work shows any of the following robustly:

1. material safety-relevant changes arrive much more slowly than validated assurance completion;
2. most safety evidence remains valid across frontier capability updates;
3. trustworthy automated evaluation scales faster than capability-induced workload;
4. independent evaluation adds little critical-path delay;
5. deployment is automatically throttled before high assurance utilization;
6. material changes become easier, rather than harder, to assure as capability rises.

Sensitivity analysis should vary:

- workload-tail index;
- evaluator parallelism;
- evidence reuse;
- false-negative tolerance;
- arrival acceleration;
- reliability discount on AI evaluators;
- independent-review latency;
- admission-control policy;
- risk-priority scheduling;
- correlation between capability novelty and evaluation complexity.

## 10. Failure modes of the model

### 10.1 Subjective materiality

If “material safety-relevant change” is defined after observing delays, the model can manufacture its own conclusion. Materiality criteria must be pre-specified and dual-coded.

### 10.2 Quantity is not assurance quality

A laboratory can raise nominal \(\mu\) by running more benchmarks without improving confidence. This motivates the effective-capacity distinction but does not solve its measurement problem.

### 10.3 Public data understate internal work

A public-data calibration can measure observable assurance lag but may badly underestimate internal evaluator capacity. Claims about particular developers should therefore be avoided without direct access.

### 10.4 Evidence obligations are heterogeneous

A single queue collapses cyber evaluations, interpretability, model-weight security, governance review, and safety cases. A serious implementation should use a multiclass queue/network.

### 10.5 Endogenous stopping

Developers may react to backlog by delaying deployment. That is not a failure of the model; it changes the outcome from “unassured deployment” to “capability/deployment queue.” But the policy must be modeled explicitly.

## 11. Policy and research implications

The model reframes several policy tools as interventions on identifiable terms.

### 11.1 Reduce assurance arrivals

Capability or deployment pacing reduces \(\lambda_C\), but only if it targets **material safety changes** rather than arbitrary calendar releases.

### 11.2 Reduce workload per change

Standardized evaluations, reusable formal components, modular architectures, and better evidence traceability can reduce \(w\) or increase evidence reuse.

### 11.3 Increase effective service capacity

More independent evaluators, automated testing, formal verification, better interpretability, and continuous monitoring can increase \(\mu_E\)—provided reliability scales with throughput.

### 11.4 Reduce staleness

Architectures and claims designed for evidence persistence can reduce \(\lambda_R\) or \(\delta_E\).

### 11.5 Use explicit admission control

If \(\rho\) approaches one, a safety framework can make the response mechanical: affected capability deployment pauses until reserve/backlog returns to a declared range.

This suggests a governance metric more operational than “spend X% on safety”:

\[
\boxed{
\text{Maintain a pre-specified assurance reserve or load margin for each critical risk class.}
}
\]

The correct margin is an empirical and normative policy question, not supplied by this paper.

## 12. Discussion

The model's main conceptual claim is modest. Fast capability progress and good safety work are not mutually exclusive. What matters is the **relative dynamics** of system change and validated evidence production.

This distinction becomes especially important in a world of partial AI-R&D automation. A system can accelerate implementation before it can choose research agendas autonomously. That already shortens iteration cycles. Yet assurance can also benefit from AI. The scientific question is therefore not whether “AI beats humans” but whether the joint process remains inside a stable operating region.

A useful analogy is not a runaway train but a high-throughput engineering system with an assurance budget. If every design revision invalidates substantial certification evidence and revisions arrive faster than certification can be updated, either design output must wait, assurance must scale, evidence must become more reusable, or certification ceases to be current. Frontier AI makes this familiar process problem unusually important because both the system and the tools used to evaluate the system may be improving simultaneously.

The paper intentionally stops short of converting a queueing condition into a claim about existential risk. A backlog is a governance state. Catastrophe requires further premises concerning deployment, capability, objectives, control failures, and harm pathways. Those questions belong in separate models.

## 13. Limitations

1. The model abstracts away the epistemic quality of assurance into a difficult-to-measure effective service rate.
2. Material changes and evidence reuse may be domain-specific enough that no single scalar \(\rho\) is meaningful.
3. Public data may not permit reliable empirical calibration.
4. Queue stability does not imply semantic correctness of the underlying safety case.
5. Queue instability does not imply deployment: responsible admission control can move the backlog upstream.
6. Recursive acceleration is represented parametrically; the paper does not establish that it will occur.
7. Security-sensitive internal data may be exactly the data needed for strong validation.

## 14. Minimum publishable result

A credible first release should contain at least:

1. the formal model and clearly separated claim types;
2. a complete proof of the workload propositions;
3. an evidence-expiry simulation demonstrating a decision-relevant difference from a plain \(\lambda/\mu\) queue;
4. a coding protocol for a public assurance-episode dataset;
5. robustness to multiple workload distributions and admission policies;
6. no claims about current lab instability unless supported by collected data.

Until items 3–5 are completed, this document should be labelled **working paper / theory proposal**, not empirical evidence.

## 15. Conclusion

Frontier-AI safety is not only a question of whether an evaluation or safety case can be constructed. It is also a question of whether such evidence can remain synchronized with a changing system.

This paper formalizes that synchronization problem as an assurance workload process. The model separates material capability-change arrivals, workload per change, effective validated-assurance capacity, evidence staleness, and admission control. Under explicit assumptions, excess workload produces an unbounded expected backlog; differential scaling can create a finite assurance crossover; and refresh work can push a superficially subcritical process into overload.

The empirical question is therefore concrete and falsifiable:

\[
\boxed{
\text{Does validated assurance capacity scale at least as fast as the safety-relevant workload created by frontier-AI change?}
}
\]

If the answer is yes, the proposed instability mechanism is weakened. If the answer is no, the model identifies the available responses: reduce material change rate, reduce evidence workload, improve evidence reuse, increase trustworthy assurance capacity, or throttle deployment. The framework is intended to make that tradeoff measurable before it becomes a crisis.

---

## Planned figures and tables

**Still to generate; no figure is claimed as an empirical result.**

1. **Figure 1:** Frontier-assurance flow: material change → evidence obligations → assurance servers → decision/deployment.
2. **Figure 2:** Phase diagram for \(\rho=L/\mu_E\) with stable, near-capacity, and overloaded regions.
3. **Figure 3:** Evidence-expiry loop showing completed claims returning as refresh work.
4. **Figure 4:** *Proposed simulation* of backlog trajectories under different R&D/evaluation scaling exponents.
5. **Figure 5:** *Proposed simulation* of admission control versus unrestricted arrivals.
6. **Table 1:** Observable proxies for \(\lambda_C,w,\mu_E,q\).
7. **Table 2:** Comparison with dynamic safety cases, safety debt, standards lag, and simple throughput models.

## Reproducible-code requirements

Suggested repository:

`github.com/moheetkhawaja/superintelligence-research-atlas/tree/main/p1-assurance-queue`

Minimum structure:

```text
p1-assurance-queue/
├── README.md
├── pyproject.toml
├── src/
│   ├── queues.py
│   ├── evidence_decay.py
│   ├── policies.py
│   └── metrics.py
├── simulations/
│   ├── configs/
│   └── run_grid.py
├── data/
│   ├── README.md
│   ├── raw/
│   └── processed/
├── notebooks/
│   └── reproduce_figures.ipynb
└── tests/
    ├── test_queue_drift.py
    └── test_crossover.py
```

Every released figure should be generated from committed code/configuration. Raw public-source snapshots should be hashed; manual episode coding should have a versioned codebook.

## Suggested publication URLs and metadata

Suggested canonical page:

`https://superintel.site/research/assurance-queue`

Suggested PDF:

`https://superintel.site/papers/when-capability-iteration-outruns-assurance.pdf`

```html
<meta name="citation_title" content="When Capability Iteration Outruns Assurance: A Queueing Model of Frontier-AI Safety">
<meta name="citation_author" content="Moheet Khawaja">
<meta name="citation_publication_date" content="2026/09/14">
<meta name="citation_pdf_url" content="https://superintel.site/papers/when-capability-iteration-outruns-assurance.pdf">
```

### Publications-page description

A theory and measurement proposal for frontier-AI assurance as a dynamic capacity problem. The paper models safety-relevant capability changes as arrivals, validated evaluations and safety-case work as finite service capacity, and prior evidence as potentially expiring after material system change. It defines an assurance-load ratio and capability-dependent assurance crossover, proves elementary workload results, and specifies a public-data and simulation programme for testing whether assurance can remain current as AI-assisted development accelerates. It does **not** assume recursive self-improvement or claim that any present lab is beyond control.

## References

1. Buhl, M. D., Sett, G., Koessler, L., Schuett, J., & Anderljung, M. (2024). *Safety cases for frontier AI*. arXiv:2410.21572. https://arxiv.org/abs/2410.21572
2. Hilton, B., Buhl, M. D., Korbak, T., & Irving, G. (2025). *Safety Cases: A Scalable Approach to Frontier AI Safety*. arXiv:2503.04744. https://arxiv.org/abs/2503.04744
3. Cârlan, C., Gomez, F., Mathew, Y., Krishna, K., King, R., Gebauer, P., & Smith, B. R. (2024). *Dynamic safety cases for frontier AI*. arXiv:2412.17618. https://arxiv.org/abs/2412.17618
4. Wallich, P., & Douglas, R. (2026). *We Must Proactively Address AI Safety Debt*. ICLR 2026 Workshop on Agents in the Wild. https://openreview.net/pdf?id=Bmvsb4r7wr
5. Maxwell, O. (2026). *The Assurance Gap: Structural Drivers of AI Standards Lag*. SSRN 6150268. https://ssrn.com/abstract=6150268
6. Barrett, S., Campos Zabala, F. J., Fillingham, S. P., Siddique, U., Walpole, J., Bloomfield, R., & Papadatos, H. (2026). *Lessons from External Review of DeepMind's Scheming Inability Safety Case*. arXiv:2604.21964. https://arxiv.org/abs/2604.21964
7. Anthropic Institute. (2026). *When AI builds itself: Our progress toward recursive self-improvement, and its implications*. https://www.anthropic.com/institute/recursive-self-improvement
8. Goel, S., Strüber, J., Auzina, I. A., Chandra, K. K., Kumaraguru, P., Kiela, D., Prabhu, A., Bethge, M., & Geiping, J. (2025). Great Models Think Alike and this Undermines AI Oversight. *Proceedings of the 42nd International Conference on Machine Learning*, PMLR 267, 19621–19678. https://proceedings.mlr.press/v267/goel25b.html
9. Benkrid, K. (2026). *AI Governance Has a Throughput Problem*. LinkedIn article, 20 March 2026. [Non-peer-reviewed prior-art neighbour; cited only to disclaim novelty of the bare \(\lambda/\mu\) analogy.]
