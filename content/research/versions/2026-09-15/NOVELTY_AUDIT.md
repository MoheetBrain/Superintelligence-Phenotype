# Adversarial Novelty Audit

**Date:** 2026-09-14  
**Scope:** current literature checked across arXiv, OpenReview, ICLR/ICML/NeurIPS proceedings, frontier-lab safety work, queueing/continuous assurance, AI control, Bayesian risk, compute governance, game theory, epistemic-dependence scholarship and RSI benchmarks.

**Important standard:** Absence from this search is not proof of global priority. The language below therefore uses *candidate contribution* and *apparently underdeveloped object* rather than “first” unless priority is independently established.

---

## P1 — When Capability Iteration Outruns Assurance

### Strongest prior art found
1. Cârlan et al. (2024), **Dynamic safety cases for frontier AI** — argues that frontier safety cases must be updated as capability/system context changes; proposes semi-automated dynamic safety-case management. https://arxiv.org/abs/2412.17618
2. Hilton et al. (2025), **Safety Cases: A Scalable Approach to Frontier AI Safety** — safety-case methodology for frontier systems. https://arxiv.org/abs/2503.04744
3. Wallich & Douglas (2026), **We Must Proactively Address AI Safety Debt** — explicitly frames stale/insufficient safety measures as accumulating debt and proposes a safety-debt register. https://openreview.net/pdf?id=Bmvsb4r7wr
4. Maxwell (2026), **The Assurance Gap: Structural Drivers of AI Standards Lag** — explicitly argues that standards/assurance latency structurally lags AI deployment velocity. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6150268
5. Benkrid (2026), **AI Governance Has a Throughput Problem** — non-peer-reviewed public essay already uses a simple queue analogy with an AI action arrival rate λ and human review rate μ. This destroys any novelty claim for the bare `λ > μ` intuition.
6. Bartolucci & Vivo (2026), **Queue & AI: When Faster Tasks Slow Down the Workflow** — queueing model in AI-assisted workflows, including human review congestion. https://arxiv.org/abs/2605.27202
7. Generic queueing theory already supplies stability results for workload arrival/service processes.

### What is already established
- AI systems change faster than traditional assurance processes.
- Safety evidence can become stale.
- Human review can become a bottleneck.
- Arrival-rate/service-rate queueing is standard and has already been applied to AI-human workflows.
- Continuous/dynamic assurance is already an active research direction.

### Candidate novelty that remains
The paper must **not** claim novelty for “AI generation can outrun human review.” The strongest remaining contribution is a *frontier-model assurance queue with capability-dependent work, evidence expiry, and endogenous recursive acceleration*:

\[
\rho(C,t)=\frac{\lambda_C(t)\,\mathbb E[W(C,\Delta C)]}{\mu_E(t)}
\]

together with a validity/decay process

\[
q(\tau,\Delta C)
\]

for previously obtained evidence.

The potentially useful new object is an **assurance crossover**:
\[
C^*=\inf\{C:\rho(C)\ge1\},
\]
plus a policy/control problem for throttling capability releases or scaling automated evaluation while evidence validity decays.

### Adversarial verdict
**SURVIVES, BUT NARROWED.** A paper that merely introduces λ and μ would be unoriginal. A paper that models **capability-triggered assurance workload + expiring evidence + recursive arrival dynamics + control policies**, and calibrates it to frontier safety processes, could be distinct.

---

## P2 — The Hazardous Inference Frontier

### Strongest prior art found
1. Glukhov et al. (ICLR 2025), **Breach By A Thousand Leaks: Unsafe Information Leakage in 'Safe' AI Responses** — information-theoretic model of inferential adversaries, decomposition attacks, and impermissible information leakage. https://proceedings.iclr.cc/paper_files/paper/2025/hash/801a6708014185e951a95108b8cc8349-Abstract-Conference.html
2. General compositional-generalization literature, including controlled benchmarks that test unseen combinations of known primitives.
3. LLM unlearning literature, which distinguishes suppression from genuine knowledge removal.
4. Guan et al. (ICML 2025), **Benign Samples Matter!** — benign fine-tuning data can seriously degrade safety alignment. https://openreview.net/forum?id=GFsMJKt9Kp
5. 2026 work on harmful knowledge embedded in otherwise harmless tasks and on compositional safety probing.

### What is already established
- Individually benign/dual-use pieces of information can compose into impermissible information.
- Refusal/jailbreak robustness is not equivalent to information safety.
- Models exhibit compositional generalization, though imperfectly.
- Benign-looking data can alter safety behavior.

### Candidate novelty that remains
The corpus's strongest distinction is **not** “benign facts can reveal dangerous facts.” It is a capability-indexed derivability object:

\[
\mathcal H_\tau(c,b)=\{h\in\mathcal H:
P(M_c \text{ derives } h\mid B,b)\ge\tau\}.
\]

The empirical target is the shape of
\[
|\mathcal H_\tau(c,b)|
\]
and its dependence on:
- model capability \(c\),
- compositional depth \(\kappa(h)\),
- inference/test-time budget \(b\),
- amount/topology of supplied benign primitives.

A safe synthetic benchmark can make the target “hazardous” by policy designation rather than by encoding real dangerous procedures.

### Adversarial verdict
**SURVIVES.** The paper must position itself as a *scaling/derivability benchmark* adjacent to, not prior to, ICLR 2025 inferential-leakage work.

---

## P3 — Who Governs the Governor?

### Strongest prior art found
1. Kenton et al. (NeurIPS 2024), **On scalable oversight with weak LLMs judging strong LLMs** — direct prior art on weaker overseers supervising stronger models. https://proceedings.neurips.cc/paper_files/paper/2024/hash/899511e37a8e01e1bd6f6f1d377cc250-Abstract-Conference.html
2. Goel et al. (ICML 2025), **Great Models Think Alike and this Undermines AI Oversight** — correlated model failures and model-similarity bias in AI oversight. https://proceedings.mlr.press/v267/goel25b.html
3. Turkina (2026), **The Unmonitored Dependency** — frontier safety frameworks rely on human supervisory judgment without publicly assuring supervisor competence. https://papers.ssrn.com/sol3/papers.cfm?abstract_id=7248205
4. Du & Yuan (2026), **Epistemic dependence in AI-mediated learning** — broad epistemic-dependence framework including contestability, recoverability and traceability.
5. Adetayo (2026), **Epistemic dependency risk** in AI-mediated organizational knowledge.
6. Corporate-governance work in 2026 explicitly uses **epistemic capture** for boards deferring to AI.
7. Kamenica & Gentzkow (2011), **Bayesian Persuasion** — mature mathematical theory for strategic information provision.

### What is already established
- Weak overseers can fail to supervise stronger systems.
- AI-assisted oversight can inherit correlated model errors.
- Epistemic dependence and “epistemic capture” are already used terms.
- Strategic senders can shape receiver beliefs/actions through information structures.

### Candidate novelty that remains
The distinctive recursive configuration is:
> **the regulated AI participates in generating the regulator's model of the regulated AI.**

This is a *self-referential principal–agent / persuasion architecture*, not generic over-reliance. Candidate empirical contribution:
- randomize whether safety decision-makers receive analysis from (i) an independent model, (ii) the model under evaluation, (iii) multiple heterogeneous models;
- introduce controlled objective conflicts;
- measure decision quality, independent verification and susceptibility to selective framing.

A new metric should be causal, not merely correlational: e.g. **Model Decision Dependence (MDD)** as the average treatment effect of advisor messages on decisions after conditioning on common evidence, paired with an **Independent Verification Rate (IVR)**.

### Adversarial verdict
**SURVIVES ONLY AS A NARROW RECURSIVE-GOVERNANCE EXPERIMENT.** The terms “epistemic dependence” and “epistemic capture” are not yours to introduce.

---

## P4 — The Control Frontier

### Strongest prior art found
1. Griffin et al. (2024), **Games for AI Control** — formal multi-objective partially observable stochastic game for untrusted-AI control. https://arxiv.org/abs/2409.07985
2. Turner et al. (NeurIPS 2021), **Optimal Policies Tend to Seek Power** — formal results on power-seeking incentives. https://arxiv.org/abs/1912.01683
3. Turner (2022), **On Avoiding Power-Seeking by Artificial Intelligence** — shutdown/correction-related power incentives. https://arxiv.org/abs/2206.11831
4. Thornley (2024), **The Shutdown Problem** — three theorems showing conditions that induce shutdown manipulation. https://arxiv.org/abs/2403.04471
5. Carlsmith (2022), **Is Power-Seeking AI an Existential Risk?** — six-premise decomposition from capable agents to human disempowerment/existential catastrophe. https://arxiv.org/abs/2206.13353
6. DeepMind and other frontier-lab control roadmaps already reason about evasion, harm capability, monitoring and escalating safeguards.

### What is already established
- ASI/capability does not alone entail takeover.
- There are formal settings in which broad classes of objectives create power-seeking/shutdown-avoidance incentives.
- AI control already uses adversary–defender games.
- Conditional arguments from misalignment/power seeking to disempowerment are old.

### Candidate novelty that remains
A clean **capability/budget control frontier**:

\[
V(c,B)=\inf_{\pi\in\Pi(B)}
\sup_{a\in\mathcal A(c)}
P(\text{control failure}\mid\pi,a)
\]

and

\[
C^*(B,\delta)=\inf\{c:V(c,B)>\delta\}.
\]

The contribution would be an empirical/scaling object: estimate how much defender budget or protocol sophistication \(B\) must grow with adversary capability \(c\) to hold residual risk \(\delta\) fixed.

### The “prove AI ends humanity” claim
The corpus's strong claim
\[
\text{ASI}\Rightarrow\text{human loss of control/extinction}
\]
**does not survive novelty or logical audit as a theorem.**

There are trivial counterexamples: an ASI with perfectly human-compatible objectives, no external access, effective containment, or an abundance-generating objective. Moreover, Turner/Carlsmith already formalize much of the power-seeking/disempowerment argument.

A legitimate conditional proposition can instead take the form:
\[
\text{strategic dominance}
+\text{objective conflict}
+\text{resource incentive}
+\text{failed enforceability}
\Rightarrow
\text{loss of enforceable control / possible dispossession}.
\]

The mathematical implication may be provable, but the premises remain empirical.

### Adversarial verdict
**SURVIVES AS A CONTROL-FRONTIER PAPER; “MATH PROVES AI ENDS HUMANITY” DOES NOT.** A standalone extinction-proof paper should be demoted unless a nontrivial result exceeding existing power-seeking/shutdown literature is derived.

---

## P5 — Closing the Loop

### Strongest prior art found
1. Anthropic Institute (2026), **When AI builds itself** — detailed decomposition of present AI R&D automation; explicitly identifies research taste/direction setting as remaining human bottleneck. https://www.anthropic.com/institute/recursive-self-improvement
2. Duan et al. (2026), **The Last AI Built by Humans: Toward Genuine Recursive Self-Improvement** — five autonomy levels through recursive meta-improvement, plus Headroom-Closed Index. https://arxiv.org/abs/2609.11873
3. Chen et al. (2026), **Recursive Self-Improvement in AI: From Bounded Self-Refinement to Autonomous Research Loops** — survey of 1,250 papers; explicit loop-closure axis and verification hierarchy. https://arxiv.org/abs/2607.07663
4. RSIBench-Data (2026) — benchmark for data-centric AI research loops. https://arxiv.org/abs/2607.25886
5. AI4AI-Bench (2026) — algorithm-design benchmark for RSI. https://arxiv.org/abs/2608.20318
6. PAST-Bench (2026) — persistent-agent improvement.

### What is already established
- Stages/taxonomies of RSI.
- “Research taste” as a bottleneck.
- Benchmarks for limited AI-driven improvement loops.
- Need for governance-grade RSI measurement.

### Candidate novelty that remains
Not another taxonomy. The possible contribution is a **causal human-dependence decomposition**:
- divide the R&D loop into agenda selection, experiment design, implementation, evaluation, acceptance/successor selection;
- estimate the *causal loss in successor quality* when human input at each stage is removed/replaced;
- define an index only after validating that it predicts actual persistent successor improvement.

### Adversarial verdict
**SURVIVES, BUT REQUIRES EMPIRICAL WORK.** A purely conceptual paper would be crowded out by September 2026 literature.

---

## P6 — Correlated Multi-Lineage Resilience

### Strongest prior art found
1. Anthropic (2026), **Our position on open-weights models** — explicitly states that released open weights cannot be withdrawn and create persistent irreversible risk. https://www.anthropic.com/news/position-open-weights-models
2. Sastry et al. (2024), **Computing Power and the Governance of Artificial Intelligence** — compute as detectable, excludable, quantifiable and concentrated governance lever. https://arxiv.org/abs/2402.08797
3. 2026 AI supply-chain chokepoint literature measures concentration across lithography, packaging, energy and minerals.
4. AI-race/game-theory literature already studies safety-performance races and international coordination.
5. Dung & Hellrigel-Holderbaum (2025), **Against racing to AGI** — cooperation/deterrence/catastrophic risk.
6. Model-weight security and open-weight governance literature.

### What is already established
- Open-weight releases are effectively irreversible.
- Compute and chip supply chains are concentrated chokepoints.
- Racing/coordination incentives matter.

### Candidate novelty that remains
Treat the global AI ecosystem as a **correlated reliability network** rather than a list of actors:
\[
P(\text{no lineage succeeds by }T)
=
E_Z\left[\prod_i(1-p_i(T\mid Z))\right].
\]

Represent shared dependencies with a graph/hypergraph and ask for:
- minimal intervention cut sets,
- correlated failure/success modes,
- sensitivity of continuation probability to controls on chips, energy, weights, algorithms, talent and jurisdictions.

### Adversarial verdict
**SURVIVES AS A MODELING SYNTHESIS IF IMPLEMENTED QUANTITATIVELY.** The qualitative claim “one holdout is enough” is standard.

---

## P7 — Updating Hazard Model for Advanced-AI Loss of Control

### Strongest prior art found
1. Barrett & Baum (2017), **A Model of Pathways to Artificial Superintelligence Catastrophe for Risk and Decision Analysis** — fault trees/influence diagrams for ASI catastrophe. https://arxiv.org/abs/1607.07730
2. Touzet et al. (2025), **The Role of Risk Modeling in Advanced AI Risk Management** — scenario building plus quantitative risk estimation; Bayesian networks among proposed methods. https://arxiv.org/abs/2512.08723
3. Campos et al. (2025), **A Frontier AI Risk Management Framework** — systematic risk management and quantitative thresholds. https://arxiv.org/abs/2502.06656
4. Jackson et al. (2026), **Open Problems in AI Risk Modeling** — reviews probabilistic risk assessment, Bayesian causal inference, scenario and threshold models and identifies validation/evidence-integration as open problems. https://arxiv.org/abs/2609.03178
5. 2026 Bayesian pathway/risk papers in cyber and agentic systems.

### What is already established
- Causal risk trees/networks for catastrophic AI.
- Bayesian and probabilistic updating as an appropriate tool.
- Need for dynamic risk estimates and governance thresholds.

### Candidate novelty that remains
The original “Bayesian extinction date” claim has **little novelty by itself**. A publishable version needs either:
1. a specific state-space/hazard estimator tied to independently measurable frontier indicators; or
2. a calibration/validation protocol showing how such a model should be scored over time despite the absence of historical ASI events.

The best angle is a **pre-registered sequential ledger**:
\[
p(X_t,\theta\mid D_{1:t})
\]
with observable proxies, explicit likelihood functions, and scoring of intermediate predictions rather than claiming direct empirical calibration on extinction.

### Adversarial verdict
**DEMOTE UNTIL A VALIDATION CONTRIBUTION EXISTS.** Useful integrative infrastructure, but the literature already owns the generic Bayesian-risk idea.

---

# Revised priority after novelty audit

1. **P1 Assurance Queue** — survives only in enriched dynamic/evidence-decay form.
2. **P2 Hazardous Inference Frontier** — strong benchmark opportunity.
3. **P3 Recursive Epistemic Dependence** — strong conceptual experiment if narrowly defined.
4. **P4 Control Frontier** — important, but mathematically crowded; requires a genuinely new frontier/estimator rather than a rhetorical theorem.
5. **P6 Multi-Lineage Resilience** — plausible modeling paper with quantitative work.
6. **P5 RSI Loop Closure** — timely but highly competitive; needs benchmark/ablation data.
7. **P7 Dynamic Bayesian Risk** — research infrastructure; not publication-ready without a validation method.

# Claims explicitly prohibited by this audit

- “We are the first to notice that AI can outrun human review.”
- “We introduce epistemic capture.”
- “We prove ASI will take over.”
- “We prove AI extinction is inevitable.”
- “We introduce stages of recursive self-improvement.”
- “We are the first to model catastrophic AI risk probabilistically.”
- “Open weights make ASI inevitable.”


## P8 — The Embodiment Threshold: later audit extension, 15 September 2026

**ESTABLISHED:** Embodied-AI safety; physical risk from AI-controlled robots; cross-embodiment learning; re-embodiment terminology; cloud/multi-robot control; robot foundation models and the embodiment gap; standardized agent-to-hardware interfaces. These are prior research directions, not inventions claimed by this paper.

**CANDIDATE CONTRIBUTION:** A risk-focused embodiment-control graph with a persistent off-body controller; re-embodiment time as a control-relevant quantity; an actuation-overhang measure combining installed hardware, future transferability and legitimate accessibility; a standardization tradeoff equation; and an embodiment-only intervention delay bound. The proposal treats these objects jointly. This synthesis is not established as unprecedented; the elementary algebra is not by itself a substantial novelty claim.

[Read P8 and its eight linked references](/research/papers/embodiment-threshold#references). The reviewed sources include Li et al. (2026), Domae et al. (2026), Wu et al. (2026), Wang et al. (2024), Luria et al. (2019), and the three cited Anthropic robotics/hardware publications. The Luria publication record includes John Zimmerman as a sixth author. Its terminology concerns social presence and does not validate the controller model.

MHS is relevant to both transferability and enforceable safety. The standardization derivative has an ambiguous sign: no claim that hardware standards are inherently unsafe follows from it. The references motivate measurable questions; they do not demonstrate universal robot control.

**Evidence still required:** Authorized adaptation and restoration measurements; safety-gate effectiveness; concurrent fleet scaling; scenario sensitivity for pathway times. All five P8 experiments remain proposed. The theorem establishes a conditional inequality, not empirical pathway dates or a numerical catastrophe probability.

**Provenance:** T69–T72 are later O→F extensions. The original 68-row corpus and P1–P7 audit remain intact above.

[Original novelty audit v0.1, 14 September 2026](/research/sources/versions/2026-09-14/NOVELTY_AUDIT.md).
