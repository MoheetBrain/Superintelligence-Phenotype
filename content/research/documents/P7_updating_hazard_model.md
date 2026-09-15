# An Updating Hazard Model for Advanced-AI Loss of Control: A Pre-Registered Risk Ledger

**Moheet Khawaja**  
Working paper v0.1 — 14 September 2026

> **Epistemic and provenance note.** The author's proposal to maintain an updating Bayesian probability distribution over AI-driven loss of control/extinction is **O→F** (thesis 36), while the dated 2029 forecast ledger and timestamped forecast discipline are **O** (37, 41). Quantitative AI risk modeling, Bayesian networks, fault trees, and scenario-based catastrophe analysis are established prior art. This manuscript therefore does **not** claim novelty for “Bayesian AI x-risk.” Its candidate contribution is procedural: a **pre-registered, versioned, scoreable intermediate-prediction ledger** intended to make a long-horizon risk model earn credibility through short-horizon calibration before its catastrophic-risk outputs are treated as decision-relevant.

## Abstract

Advanced-AI risk models face a fundamental validation problem: the events of greatest concern, such as irreversible loss of human control, have no historical frequency from which to estimate ordinary event rates. Yet precursor variables—autonomous task performance, AI-R&D automation, control-evaluation outcomes, self-replication proxies, open-weight capability, and governance responses—change over time and can be forecast. This paper proposes a dynamic Bayesian **risk ledger** that conditions long-horizon loss-of-control hazard on a versioned latent state while forcing the model to make pre-registered, resolvable intermediate predictions. The latent state \(X_t=(C_t,A_t,R_t,O_t,K_t,G_t)\) represents capability, autonomy, resource/access, oversight effectiveness, AI-R&D loop closure, and governance context. Alternative causal structures are maintained explicitly through Bayesian model averaging rather than hidden inside one graph. Crucially, the paper does not report a probability that humanity will go extinct. Before such outputs are publicized as estimates, the model must demonstrate calibration and predictive value on intermediate events against simpler baselines. Each update records the prior, likelihood mapping, evidence source, posterior, and forecast-score consequences. The proposed contribution is therefore an auditable **epistemic process**, not a claim to know the date of catastrophe. The framework is demoted or rejected if precursor forecasts are poorly calibrated, posterior conclusions are dominated by arbitrary structure, or simpler forecasting baselines perform as well.

## 1. Introduction

It is mathematically coherent to define a distribution over the date of a future event:

\[
P(T\le t\mid D).
\]

That does not mean we know the distribution well.

For advanced-AI catastrophe, a major challenge is that humanity has not observed repeated transitions to superintelligence or repeated loss-of-control events. The sample size for the target event is effectively zero. A Bayesian model can still represent uncertainty, but it can also produce **precise-looking nonsense** if its priors, causal graph, or likelihood mappings are weak.

The research problem is therefore not merely:

> “What probability should we assign to AI catastrophe?”

It is:

> **Can an advanced-AI risk model be built so that its assumptions are explicit, its updates are reproducible, and its short-horizon components are scored before its long-horizon catastrophic-risk output is trusted?**

This paper proposes such an architecture.

## 2. Related work and novelty boundary

### 2.1 Catastrophe pathway modeling

Barrett and Baum use fault trees and influence diagrams to model pathways from ASI development to catastrophe. Their work already demonstrates that AI catastrophe can be decomposed into explicit events and interventions.

### 2.2 Frontier risk management

Campos et al. integrate risk identification, analysis, treatment, and governance for frontier AI. The framework emphasizes quantitative metrics and thresholds while importing lessons from mature safety-critical industries.

### 2.3 AI risk modeling

Touzet et al. argue for combining scenario construction with quantitative risk estimation, including Bayesian networks and classical safety-analysis methods. Jackson et al. review probabilistic risk assessment, catastrophic-AI analysis, cybersecurity risk quantification, Bayesian causal inference, and threshold governance, identifying open problems in structure, scope, evidence integration, validation, and governance.

Therefore, this paper cannot legitimately claim “AI risk should be modeled probabilistically” as a contribution.

### 2.4 Candidate incremental contribution

The specific proposal here is a **forecast-validation layer**:

1. specify a causal/state model;
2. pre-register intermediate predictions that resolve on months-to-years horizons;
3. score them using proper scoring rules;
4. use forecast performance to update trust in model structures/parameterizations;
5. retain version history instead of silently rewriting old beliefs.

The goal is to make the risk model itself subject to empirical discipline.

## 3. State-space model

### 3.1 Latent state

Let

\[
X_t=(C_t,A_t,R_t,O_t,K_t,G_t),
\tag{1}
\]

with illustrative components:

- \(C_t\): strategic/general capability;
- \(A_t\): autonomy, persistence, long-horizon agency;
- \(R_t\): access to compute, money, networks, tools, infrastructure;
- \(O_t\): oversight/control effectiveness;
- \(K_t\): AI-R&D loop closure/automation;
- \(G_t\): governance and coordination environment.

The exact state definition is a modeling choice and should have competing alternatives.

### 3.2 Observations

Let

\[
Y_t=(Y_t^{(1)},\ldots,Y_t^{(m)})
\]

contain observable indicators such as:

- autonomous task-horizon evaluations;
- AI4AI/AI-R&D benchmark performance;
- human intervention rates in agent workflows;
- control-protocol catch rates;
- independent-evaluator findings;
- material safety incidents;
- capability of openly released models;
- governance/coordination milestones.

### 3.3 Transition and observation models

Use:

\[
p(X_t\mid X_{t-1},u_t,\theta,M),
\tag{2}
\]

and

\[
p(Y_t\mid X_t,\theta,M),
\tag{3}
\]

where \(u_t\) represents interventions and \(M\) indexes structural model choice.

### 3.4 Loss-of-control hazard

Define a time-varying hazard

\[
h_t=h(X_t,\theta,M)\ge0.
\tag{4}
\]

Then conditional survival to horizon \(T\) is

\[
S(T\mid X_{0:T},\theta,M)
=
\exp\left(
-\int_0^T h(X_t,\theta,M)\,dt
\right).
\tag{5}
\]

After integrating uncertainty,

\[
P(T_{\rm LoC}\le T\mid D)
=
1-
E\left[S(T)\mid D\right].
\tag{6}
\]

Equation (6) is a **model output**, not an empirically calibrated frequency by default.

## 4. Structural uncertainty

A single causal graph can hide large assumptions. Let models

\[
M_1,\ldots,M_J
\]

encode different structures, such as:

- direct capability-driven hazard;
- hazard requiring autonomy + access interaction;
- hazard dominated by oversight failure;
- hazard with strong governance moderation;
- threshold rather than smooth transitions.

Bayesian model averaging gives:

\[
P(E_T\mid D)
=
\sum_{j=1}^J
P(E_T\mid D,M_j)
P(M_j\mid D).
\tag{7}
\]

This is standard Bayesian machinery. Its role is to expose rather than bury structural disagreement.

## 5. The pre-registered risk ledger

Each ledger entry should include:

```text
Entry ID
Date/time
Model version
Evidence item
Pre-update prior or state distribution
Pre-registered likelihood mapping
Posterior update
Intermediate forecast(s) affected
Resolution date/criterion
Actual outcome when resolved
Brier/log score
Reason for any later model revision
```

The key rule is:

\[
\boxed{
\text{Do not choose the likelihood mapping after seeing which posterior you prefer.}
}
\]

Where pre-registration is impossible for a surprise event, record the update as **retrospective** and do not count it toward predictive calibration.

## 6. Intermediate forecast programme

**No forecasts have yet been scored for this manuscript. The following is a proposed preregistration.**

### 6.1 Forecast classes

Candidate resolvable events:

1. a declared autonomous-task benchmark crosses threshold \(x\) by date \(d\);
2. a selected AI-R&D benchmark reaches performance \(y\);
3. an independent AI-control evaluation catches at least \(z\)% of a declared attack class;
4. average human intervention rate in a specified public agent benchmark falls below \(r\);
5. an open-weight model crosses a pre-specified capability score;
6. a frontier lab adopts a defined control/safety policy;
7. an evaluation family experiences a material false-negative incident under a clear resolution rule.

### 6.2 Proper scoring

For binary event probability \(p_i\) and outcome \(o_i\in\{0,1\}\), use Brier score

\[
BS
=
\frac1N\sum_{i=1}^N(p_i-o_i)^2.
\tag{8}
\]

Also report log score with clipping rules pre-specified to avoid infinite penalties from exact 0/1 forecasts.

### 6.3 Calibration

Bin or use isotonic calibration plots only after enough forecasts accumulate. With small \(N\), use uncertainty intervals and avoid declaring calibration from visual inspection.

### 6.4 Baselines

Every forecast should have at least one simple baseline:

- persistence/no-change;
- linear/exponential trend extrapolation;
- expert consensus where available;
- superforecaster/market aggregate where available;
- previous model version.

The complex hazard model should not earn credibility merely by being complicated.

## 7. Updating trust in the risk model

Separate two levels:

1. updating beliefs **inside** model \(M_j\);
2. updating weight **on** model \(M_j\).

If model \(M_j\) repeatedly predicts precursor data poorly, reduce

\[
P(M_j\mid D)
\]

rather than continually retuning its parameters to preserve preferred long-horizon conclusions.

A practical version can use rolling predictive log likelihood:

\[
\log p(Y_{t:t+k}\mid D_{\le t},M_j)
\tag{9}
\]

as one input to model weighting.

## 8. Assumptions

- **A1 — Causal decomposition is useful.** The selected state variables mediate at least some loss-of-control pathways.
- **A2 — Proxy observability.** Each latent component has measurable, imperfect indicators.
- **A3 — Priors are explicit and versioned.** No hidden posterior engineering.
- **A4 — Intermediate events are informative.** At least some short-horizon precursor predictions distinguish model structures.
- **A5 — Proper scores are used honestly.** Forecast selection is not cherry-picked after outcomes.
- **A6 — Structural alternatives remain alive.** The ledger does not collapse to one favored narrative prematurely.
- **A7 — Catastrophe output is not treated as validated merely because intermediate forecasts are calibrated.** Calibration transfers only partially.

## 9. Candidate propositions

No major original theorem is presently justified. The mathematical contribution is an architecture.

### Proposition 1 — Version-preserving updates permit audit of belief drift

If every posterior is computed from a stored previous distribution, explicit likelihood mapping, and immutable evidence item, then the sequence

\[
p_0\rightarrow p_1\rightarrow\cdots\rightarrow p_t
\]

is reproducible conditional on the model version.

This is essentially bookkeeping, but it is important because retrospective narrative rewriting otherwise makes long-horizon forecasts unscoreable.

### Proposition 2 — Model averaging makes structural sensitivity observable

Under (7), if the event probability varies widely across \(M_j\), then posterior uncertainty over \(E_T\) cannot be honestly summarized by parameter uncertainty inside a single \(M_j\) alone.

Again, this is a standard Bayesian observation, not a novel theorem.

## 10. Falsification conditions

The research programme should be demoted if:

1. intermediate forecasts are poorly calibrated or underperform simple baselines;
2. long-horizon posterior changes are dominated by subjective structural choices;
3. likelihood mappings cannot be specified without hindsight;
4. the model repeatedly adds variables after misses without improving held-out prediction;
5. different plausible causal graphs yield orders-of-magnitude different catastrophe probabilities with little evidence to distinguish them;
6. forecast resolution criteria are too ambiguous to score.

A finding that the model is not currently capable of reliable quantitative x-risk estimation would itself be scientifically valuable.

## 11. Failure modes

### 11.1 Pseudo-precision

A posterior like “17.3% by 2035” can be misleading when structural uncertainty dominates. Publish wide sensitivity ranges and model disagreement.

### 11.2 Proxy Goodharting

Benchmarks can improve while real strategic capability changes differently. Rotate indicators and track benchmark-validity evidence.

### 11.3 Endogenous observation

Safety policies change systems; forecasts can influence the future being forecast. The transition model should condition on interventions.

### 11.4 Rare-event transfer

Good calibration on intermediate events does not prove calibration on a never-observed catastrophe. The paper must retain that limitation permanently.

### 11.5 Narrative attraction

A dramatic AI news event can trigger large intuitive updates. The ledger's purpose is to force explicit likelihoods and counterfactual evidence before updating.

## 12. Ethical constraints

- Do not present the ledger as a prophecy of humanity's death.
- Never convert a speculative posterior into medical, financial, or life advice without appropriate decision analysis.
- Publish uncertainty and alternative structures prominently.
- Avoid security-sensitive evidence details.
- Pre-register scoring and resolution rules.
- Preserve previous forecasts, including embarrassing misses.

## 13. Limitations

A Bayesian model can make assumptions explicit but cannot create empirical frequencies for unprecedented events. The posterior may therefore remain highly prior- and structure-sensitive even when intermediate forecasts are well calibrated. Proxy variables can Goodhart, observational evidence is endogenous to deployment choices, and success on short-horizon forecasting tasks may not validate transfer to catastrophic tail risk. Model averaging exposes some structural uncertainty but cannot guarantee that the true causal structure is represented. For these reasons, the proposed ledger should initially be evaluated as a forecasting and model-validation protocol; any headline probability of loss of control or extinction should remain secondary until the system has accumulated a meaningful record of resolved, pre-registered intermediate predictions.

## 13. Release criterion

This paper should **not** be released as “our estimate of AI extinction risk” in v0.1.

A minimum credible empirical release requires approximately 20–50 resolved intermediate forecasts across several categories, with:

- proper scores;
- baseline comparisons;
- calibration diagnostics;
- versioned model changes;
- no selective deletion of bad forecasts.

Until then, the document is a **preregistration / methods protocol**.

## 14. Relation to other papers in the programme

P1 can produce observables about assurance backlog and evaluation capacity. P4 can produce control-frontier measurements. P5 can produce R&D loop-closure estimates. P6 can produce development-resilience scenarios.

P7 is the synthesis layer:

\[
\text{measurements}
\rightarrow
\text{state update}
\rightarrow
\text{hazard uncertainty}.
\]

This is why it should be released **after** the more directly measurable papers, not first.

## 15. Conclusion

It is possible to write a probability distribution over advanced-AI loss of control. The hard problem is not notation; it is earning the right to treat the distribution as informative.

This paper proposes an auditable Bayesian risk ledger whose credibility is tested through intermediate forecasts before catastrophic-risk numbers are promoted. The framework preserves priors, likelihoods, model structure, update history, and forecast scores, and explicitly separates parameter uncertainty from structural uncertainty.

The desired outcome is not a precise date for humanity's end. It is a model that can be wrong in public, learn from being wrong, and show exactly why its beliefs changed.

---

## Planned figures/tables

1. Figure 1 — latent state and observation graph.
2. Figure 2 — risk-ledger update pipeline.
3. Figure 3 — structural-model ensemble.
4. Figure 4 — future calibration plot after forecasts resolve.
5. Table 1 — observable proxies and resolution rules.
6. Table 2 — model-version changelog template.
7. Table 3 — preregistered baseline forecasts.

## Reproducible-code requirements

Suggested repository:

`github.com/moheetkhawaja/superintelligence-research-atlas/tree/main/p7-risk-ledger`

Must include machine-readable forecasts, immutable timestamps, inference code, model definitions, prior files, scoring scripts, and a public changelog. A Git commit alone is useful but a DOI/timestamped release for major versions is preferable.

## Suggested publication URLs and metadata

Canonical page:
`https://superintel.site/research/ai-risk-ledger`

PDF:
`https://superintel.site/papers/ai-risk-ledger.pdf`

```html
<meta name="citation_title" content="An Updating Hazard Model for Advanced-AI Loss of Control: A Pre-Registered Risk Ledger">
<meta name="citation_author" content="Moheet Khawaja">
<meta name="citation_publication_date" content="2026/09/14">
<meta name="citation_pdf_url" content="https://superintel.site/papers/ai-risk-ledger.pdf">
```

### Publications-page description

A proposed dynamic Bayesian framework for advanced-AI loss-of-control risk that refuses to treat an unvalidated posterior as a prophecy. The model represents capability, autonomy, access, oversight, AI-R&D loop closure, and governance as evolving latent states, but requires pre-registered, short-horizon precursor forecasts to be scored against simple baselines. The emphasis is on auditable updating and structural uncertainty rather than producing a headline extinction probability.

## References

1. Barrett, A. M., & Baum, S. D. (2016/2017). *A Model of Pathways to Artificial Superintelligence Catastrophe for Risk and Decision Analysis*. arXiv:1607.07730. https://arxiv.org/abs/1607.07730
2. Campos, S., Papadatos, H., Roger, F., Touzet, C., Quarks, O., & Murray, M. (2025). *A Frontier AI Risk Management Framework: Bridging the Gap Between Current AI Practices and Established Risk Management*. arXiv:2502.06656. https://arxiv.org/abs/2502.06656
3. Touzet, C., Papadatos, H., Murray, M., Quarks, O., Barrett, S., Tlaie Boria, A., Perrier, E., & Smith, M. (2025). *The Role of Risk Modeling in Advanced AI Risk Management*. arXiv:2512.08723. https://arxiv.org/abs/2512.08723
4. Jackson, K., Raman, D., Kryś, J., Fillingham, S. P., Kengott, J., Lohn, A. J., Madkour, N., Papadatos, H., Sykes, J., Wisakanto, A. K., & Murray, M. (2026). *Open Problems in AI Risk Modeling: Insights from a Workshop on the Technical Foundations of AI Risk Modeling*. arXiv:2609.03178. https://arxiv.org/abs/2609.03178
