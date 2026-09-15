# Release Order and Publication Readiness

**Version:** v0.2 — 15 September 2026 (original v0.1 retained below and in the version archive)  
**Author:** Moheet Khawaja

## Governing rule

A paper is released only at the strongest epistemic status its evidence supports. A theory proposal is labelled a theory proposal. A proposed experiment is not described as a result. A conditional theorem never establishes its uncertain empirical premises.

## Recommended order

| Order | Paper | Current status | What is missing before strongest credible release | Recommendation |
|---:|---|---|---|---|
| **1** | **P1 — When Capability Iteration Outruns Assurance** | **Near-ready theory/methods paper** | Run and release at least one evidence-expiry/heterogeneous-workload simulation; finalize materiality coding protocol; one final priority search | **First paper.** Can be posted immediately as `working paper v0.1 / theory proposal`; for a stronger technical preprint, add simulations first. |
| **2** | **P2 — The Hazardous Inference Frontier** | Methods/benchmark proposal | Build safe synthetic benchmark; contamination controls; evaluate multiple model families; preregister capability × depth analysis | **Do not claim an empirical discovery yet.** Publish after benchmark + first results. |
| **3** | **P3 — Who Governs the Governor?** | Formal/experimental proposal | Ethics review as appropriate; synthetic safety cases; power analysis; expert or technically sophisticated participants; randomized experiment | **Promising workshop/full paper after data.** Avoid public accusations about named executives. |
| **4** | **P5 — Closing the Loop** | Crowded but potentially high-value empirical proposal | Multi-round AI-R&D task environment; stage-ablation orchestration; human expert baselines; comparison with HCI/PAST/RSIBench/AI4AI | **Publish only with data.** Conceptual version alone is too crowded in Sep 2026. |
| **5** | **P6 — Correlated AI Lineages** | Quantitative-model proposal | Build public dependency graph; define capability threshold/horizon; probability calibration; sensitivity to substitution; security review | **Publish after quantitative graph/model exists.** Qualitative “open weights are irreversible” is not enough. |
| **6** | **P4 — The Control Frontier** | Formal framework with elementary theorems | Empirical control-frontier slices **or** a nontrivial theorem beyond existing AI-Control work | **Do not yet publish as a major technical paper.** The current form is useful internally and as a section/technical note. |
| **7** | **P7 — Updating Hazard Model / Risk Ledger** | **Preregistration protocol**, not risk-estimate paper | Create public forecast ledger; preregister 20–50 intermediate forecasts over time; score against baselines | The **protocol can be posted now**, but **do not publish a headline extinction probability** until calibration evidence exists. |

## Materials ready immediately

These can be released now without pretending experiments have been run:

1. **Superintelligence Research Atlas v0.1** — provenance/status mapping for all 68 theses.
2. **Adversarial Novelty Audit v0.1** — nearest prior work and contribution boundaries.
3. **P1 working paper v0.1** — only if clearly labelled `theory/methods proposal`; strongest version should wait for simulation.
4. **P7 preregistration/methods protocol** — only as a public commitment to an update/scoring process, not as evidence for a catastrophe probability.

## Papers requiring simulations/data

- **P1:** minimal simulation work.
- **P2:** synthetic benchmark + model evaluations.
- **P3:** randomized governance-advice experiment.
- **P5:** multi-round AI-R&D causal ablations.
- **P6:** dependency graph + probabilistic simulation.

## Papers that should not yet be promoted as standalone research results

### P4 — Control Frontier
The framework is coherent, but AI-control games, power-seeking theory, weak-to-strong supervision, and shutdown/control literature already occupy much of the territory. The elementary monotonicity results are not sufficient novelty. Preserve the paper and either:
- generate empirical `V(c,B)`/`B_min(c,δ)` estimates; or
- derive a substantially stronger theorem under nontrivial assumptions.

### “A mathematical proof that AI will end humanity”
**Do not publish this title/claim.** The corpus contains the historical strong conjecture, but it fails logical audit because aligned objectives, containment, absent access, cooperation, and abundance are counterexamples. The publishable version is P4's conditional chain:

\[
\text{specified strategic dominance/access/objective/resource premises}
\Rightarrow
\text{specified loss-of-control or dispossession conclusion}.
\]

Mathematics proves the implication **conditional on the premises**; it does not prove that the premises will obtain.

## Suggested release sequence on `superintel.site`

```text
/research/atlas-v0-1
/research/novelty-audit-v0-1
/research/assurance-queue                 ← first paper
/research/hazardous-inference-frontier    ← after benchmark
/research/recursive-epistemic-dependence  ← after experiment
/research/closing-the-loop                ← after ablation study
/research/correlated-ai-lineages           ← after graph calibration
/research/control-frontier                 ← after empirical/theorem upgrade
/research/ai-risk-ledger                   ← protocol first; estimates later
```

## Versioning rule

Every public version should preserve:
- date;
- Git commit/release hash;
- thesis IDs used;
- provenance labels;
- changes in epistemic status;
- new prior art found;
- changed assumptions;
- falsified predictions/results.

Never overwrite a historical claim so that it appears more qualified than it was at the time. Add a superseding version and link backward.


## P8 — Later release-plan extension, 15 September 2026

**[The Embodiment Threshold](/research/papers/embodiment-threshold): THEORY/MODEL WORKING PAPER — publishable as v0.1 if clearly labelled; empirical validation remains proposed work.**

P8 is appended after the original seven-paper programme without changing the earlier ranking. Its definitions, explicitly labelled toy model and Embodiment-Only Delay Bound can be published now as a model working paper. THEOREM applies only to the mathematical implication under the stated assumptions.

Claims about actual values of \(T_D\), \(T_E\), \(g_j\), actuation overhang, safety effectiveness or risk require empirical work. No current numerical risk result exists. The five experiments are proposed designs; no execution, dataset, DOI, arXiv deposit, peer review or completed preregistration is claimed for P8.

Release with T69–T72 clearly labelled as later extensions, all O→F, and preserve the original T1–T68 corpus. The updated Atlas has 72 entries. Publication of the framework does not justify a headline claim that robotics restrictions buy a decade: that depends on the unchanged digital pathway and sufficient embodied delay.

[Original release order v0.1, 14 September 2026](/research/sources/versions/2026-09-14/RELEASE_ORDER.md).
