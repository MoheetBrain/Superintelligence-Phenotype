# Publication Programme Overview

**Author:** Moheet Khawaja  
**Version:** v0.2 — 15 September 2026 (original v0.1 retained below and in the version archive)  
**Scope:** 8 Core Technical Papers: the original seven-paper programme distilled from 68 thesis/proposal records, plus P8 and later extensions T69–T72.

## Programme design rule

The programme clusters ideas by shared causal mechanism, mathematical object, empirical identification strategy, and nearest literature. It deliberately leaves weaker/speculative theses in research-note clusters rather than forcing every idea into a manuscript.

| Priority | Paper | Central research question | Primary thesis IDs | Candidate contribution after novelty audit | Principal prior-art pressure | Core machinery | Required evidence | Tractability | Why separate? |
|---:|---|---|---|---|---|---|---|---|---|
| **1** | **When Capability Iteration Outruns Assurance: A Queueing Model of Frontier-AI Safety** | Under what conditions does safety-assurance workload accumulate faster than credible evaluation can discharge it? | 16, 28, 29 | A capability-conditioned assurance queue with heterogeneous workload, evidence expiry/staleness, recursive acceleration in arrival intensity, and explicit release/admission policies. The bare `lambda > mu` analogy is not claimed as new. | Safety cases; scalable safety cases; AI safety debt; Assurance Gap; existing public AI-governance throughput analogy. | Queueing theory, workload processes, fluid limits, evidence-decay dynamics, simulation. | Model-release/update chronology; evaluation/safety-case duration; materiality coding; proposed simulations. | **High** | It studies the *institutional temporal bottleneck* of verification, not AI control itself or RSI autonomy. |
| **2** | **The Hazardous Inference Frontier: Measuring Capability-Dependent Derivation of Dangerous Knowledge** | How does the set of restricted conclusions derivable from fixed benign premises change with model capability and reasoning depth? | 1–5 | A capability-indexed derivability object `H_tau(c,b)`, derivational-depth measure, and safe synthetic capability × depth benchmark. | *Breach by a Thousand Leaks*; WMDP; hazardous-knowledge/unlearning and benign-finetuning literature. | Probability, latent/ordinal capability measures, synthetic logic environments, GLMs/scaling analysis. | Safe synthetic benchmark; multiple model families; contamination controls; preregistered analysis. | **High–medium** | It studies *what can be inferred*, not governance throughput, control protocols, or human dependence. |
| **3** | **Who Governs the Governor? Recursive Epistemic Dependence in Frontier-AI Oversight** | What changes when the system being governed also supplies the analysis used to govern it? | 6, 7, 9, 10, 26, 35 | A same-system recursive principal–agent/persuasion experiment, with causal Model Decision Dependence and Independent Verification Rate rather than inventing the terms “epistemic dependence/capture.” | Bayesian persuasion; weak-to-strong oversight; correlated-model oversight failures; epistemic-dependence scholarship; *The Unmonitored Dependency*. | Bayesian decision theory, causal inference, randomized experiments, information structures. | Synthetic governance cases; randomized advisor assignment; expert/technical participants; power analysis. | **Medium** | It concerns *human epistemic independence* rather than adversarial technical containment. |
| **4** | **The Control Frontier: A Minimax Model of Strategic Superiority, Oversight, and Conditional Loss of Control** | How does best-achievable worst-case control failure change with adversary capability and defender resources? | 11–15, 19–21, 23–25 | An empirically estimable capability/budget control frontier `V(c,B)`, crossover `C*(B,delta)`, and minimum defense budget `B_min(c,delta)`. The elementary monotonicity results are not sufficient novelty by themselves. | AI-Control Games; AI control empirical work; power-seeking theorems; shutdown-problem results; Carlsmith's premise decomposition. | Minimax/stochastic games, order theory, robust control, empirical protocol evaluation. | Control benchmarks spanning capability and defense budgets, or a materially stronger theorem. | **Medium–low until data** | It is the correct home for the “can math prove loss of control?” question; merging it into P1 would conflate control efficacy with assurance throughput. |
| **5** | **Closing the Loop: Measuring Human Causal Dependence in Recursive AI R&D** | At which R&D stages does successor improvement still causally depend on human judgment? | 17, 18, 40 | A stage-wise causal human-dependence estimator across agenda selection, experiment design, implementation, evaluation, and successor selection; any scalar loop-closure index is conditional on predictive validation. | Anthropic *When AI builds itself*; *The Last AI Built by Humans*; RSI surveys; PAST-Bench; RSIBench-Data; AI4AI-Bench. | Causal ablations, factorial experiments, Amdahl-style bottleneck analysis, repeated improvement loops. | Multi-round safe R&D environment; human baselines; stage replacement/ablation; successor-quality metric. | **Medium** | It measures *how closed the R&D loop is*; P1 instead assumes an arrival process and asks whether assurance keeps up. |
| **6** | **Can Advanced AI Development Be Stopped? A Correlated-Reliability Model of Distributed Capability Lineages** | How resilient is continued advanced-AI development when lineages share correlated global dependencies? | 22, 30–34 | A correlated reliability/dependency-graph formulation with common factors, probabilistic cut sets, and intervention sensitivity. “Open weights are irreversible” is treated as established background. | Open-weight governance; compute governance; supply-chain concentration; AI-race/game-theory literature. | Reliability theory, graphical models/hypergraphs, correlated Bernoulli/factor models, cut-set optimization, Monte Carlo. | Public dependency graph; operational threshold/horizon; calibrated or elicited probabilities; substitution sensitivity. | **Medium** | It studies *system resilience across actors and dependencies*, distinct from single-system control or deployment assurance. |
| **7** | **An Updating Hazard Model for Advanced-AI Loss of Control: A Pre-Registered Risk Ledger** | Can a dynamic AI-risk model earn trust by making and scoring intermediate predictions before being used for catastrophic-tail estimates? | 36–39, 41 | A version-preserving, preregistered, model-averaged risk ledger whose credibility is updated via proper scores on resolved intermediate forecasts. Generic Bayesian x-risk modeling is not claimed as new. | ASI pathway/fault-tree models; frontier-AI risk management; Bayesian risk models; 2026 open-problems literature on validation/evidence integration. | State-space/Bayesian models, survival/hazard analysis, Bayesian model averaging, proper scoring/calibration. | 20–50 preregistered intermediate forecasts; baselines; resolved outcomes; versioned update log. | **Medium over time** | It is the programme's *integration/forecast-validation layer*, not a substitute for mechanism-specific papers. |
| **8 — later extension** | **[The Embodiment Threshold](/research/papers/embodiment-threshold)** | When does a persistent digital controller gain replaceable physical agency? | 69–72 (later extension) | Embodiment-control graph, re-embodiment time, actuation overhang, standardization tradeoff and embodiment-only delay bound. | Embodied-AI safety; cross-embodiment transfer; the embodiment gap; agent-hardware standards. | Time-varying bipartite graph, illustrative waiting-time model, conditional delay inequality. | Authorized adaptation/restoration measurements, fleet and safety tests; scenario analysis. All proposed. | **Theory/model v0.1; empirical work pending** | Physical interfaces for a persistent controller, distinct from P4 strategic control and P6 development-lineage resilience. |


## Duplicated mechanisms that were deliberately merged

1. **Strategic superiority, control, resource acquisition, containment, and “ASI takes over”** were merged into **P4**. Splitting them would create several papers that differ rhetorically but share the same adversary–defender mechanism.
2. **Generalization, hazardous derivation, human vulnerability, causal harm, and attribution** were merged into **P2** because their core empirical question is whether latent/compositional inference expands with capability.
3. **AI persuasion, epistemic dependence, delegation, and social deference** were merged into **P3** and narrowed to the experimentally identifiable governance mechanism.
4. **Open-weight irreversibility, technological-lineage resilience, long-run local development, and multi-lineage probability** were merged into **P6**; the graph/reliability model is the only candidate contribution substantial enough to justify a paper.
5. **RSI taxonomy, research taste, and under-recognized transition claims** were merged into **P5**; the publishable object is causal human dependence, not another AGI/ASI label debate.
6. **Bayesian extinction/control-loss curves, the 2029 ledger, robust action, access inequality, and timestamped predictions** were merged into **P7**; personal decision theory becomes an application/appendix rather than a separate safety paper.
7. **Evaluation lag, temporary pacing, and social adaptation lag** were merged into **P1** because they are all consequences or policy responses to temporal mismatch between capability change and assurance capacity.

## Why the seven-paper structure is preferable to a larger package — original clustering rationale

- It minimizes duplicate mechanism papers.
- Each paper has a different primary mathematical/empirical object: queue, inference frontier, recursive persuasion/dependence, minimax control frontier, R&D causal loop, correlated reliability graph, and Bayesian validation ledger.
- Each has a distinct falsification route.
- It leaves philosophy, investment, education, identity, and speculative future-human claims in research notes rather than diluting the technical safety programme.

## The proposed “mathematical proof that AI will end humanity” paper

A separate paper under that claim is **not currently justified**. The historical thesis ID 15 is preserved in the Atlas as a strong conjecture, but the implication

\[
\mathrm{ASI}\Rightarrow\mathrm{human\ extinction}
\]

has immediate countermodels unless the definition of ASI itself contains the conclusion. Examples include aligned objectives, lack of external access, reliable containment, cooperative bargaining, or abundance-producing behavior.

The mathematically legitimate programme belongs in **P4**:

\[
A_1\land\cdots\land A_n
\Longrightarrow
\text{specified loss-of-control/dispossession result},
\]

where the assumptions are explicit and separately empirical. If a future result proves that a broad, non-question-begging class of advanced optimizers necessarily satisfies the missing premises, P4 can be upgraded or split. Until then, presenting uncertainty in the premises as a proven empirical fact would be invalid.

## Research-note destinations

- **RN1 — Media Provenance:** thesis 8.
- **RN2 — Evolution, Identity & Human Futures:** theses 42–52.
- **RN3 — Economics, Investment & Discovery:** theses 53–65 and 67–68.
- **RN4 — Institutions & Education:** theses 27 and 66.

These notes are preserved, versioned, and available for future paper promotion if stronger data or formal results appear.


## Later research extension — 15 September 2026

**8 Core Technical Papers.** The original programme clustered T1–T68 into P1–P7. Paper 8 was developed after the original 68-thesis clustering and is recorded as a later research extension rather than retroactively inserted into the historical corpus.

| Paper | Research object | Primary records | Candidate contribution | Evidence and limits |
|---|---|---|---|---|
| **P8 — [The Embodiment Threshold](/research/papers/embodiment-threshold)** | Persistent controllers and replaceable physical actuation | [T69](/research/atlas#T69), [T70](/research/atlas#T70), [T71](/research/atlas#T71), [T72](/research/atlas#T72) | Embodiment-control graph; re-embodiment time; actuation-overhang index; standardization tradeoff; embodiment-only delay bound | MODEL + PROPOSED EMPIRICAL PROGRAMME. The delay bound is a conditional theorem; no numerical risk or adaptation result is reported. |

P4 studies strategic control across capability and defender resources. P6 studies resilience of development lineages. P8 studies the mapping from persistent digital controllers into interchangeable physical actuation. The objects remain mathematically distinct, and P1–P7 retain their existing order and text.

Original conversation corpus: **68 theses/proposals (T1–T68)**. Later research extensions: **T69–T72**. Current Atlas: **72 entries**. All four additions carry O→F provenance, recording user-originated intuition and subsequent collaborative formalization, not priority over existing literature.

[Original programme v0.1, 14 September 2026](/research/sources/versions/2026-09-14/PROGRAMME_OVERVIEW.md).
