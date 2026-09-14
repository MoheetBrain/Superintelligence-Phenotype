# The Hazardous Inference Frontier: Measuring Capability-Dependent Derivation of Dangerous Knowledge

**Moheet Khawaja**  
Working paper v0.1 — 14 September 2026

> **Epistemic and provenance note.** The core distinction between memorized hazardous information and hazardous conclusions derivable through generalization arose in the author's exploratory work (**O→F; theses 1–2**). However, the broader idea that individually permissible outputs or facts can compose into impermissible knowledge is established prior art, most directly in Glukhov et al. (ICLR 2025). This paper therefore does **not** claim to discover inferential leakage. Its candidate contribution is a capability-indexed measurable object—the **hazardous inference frontier**—and a safe synthetic benchmark for separating derivation from memorization while varying compositional depth and inference budget. All experiments in this draft are proposed; no empirical results are reported.

## Abstract

Current dangerous-capability evaluations often ask what hazardous knowledge a model possesses or can directly produce. This paper asks a complementary question: how does the set of restricted conclusions a model can **derive from non-restricted premises** change as reasoning capability increases? I define the **hazardous inference frontier** \(\mathcal H_\tau(c,b)\) as the set of policy-designated target conclusions that a model at capability level \(c\) can derive from a fixed benign information environment with probability at least \(\tau\) under inference budget \(b\). The framework separates explicit target exposure from compositional derivation, introduces a notion of derivational depth \(\kappa(h)\), and proposes capability-by-depth scaling models. A basic closure proposition shows why deleting the explicit target string from a corpus cannot in general guarantee non-derivability when retained premises logically imply it; this proposition is not claimed as novel. The empirical contribution proposed here is instead a synthetic-world benchmark in which targets are harmless, ground-truth derivability is known, target statements are excluded from model context and benchmark-generation corpora, and capability, reasoning depth, distractor density, inference budget, and tool access are manipulated systematically. The main falsifiable hypothesis is that stronger models disproportionately expand derivability at higher compositional depth rather than merely improving uniform retrieval. Such a result would motivate frontier evaluations of *what can be inferred*, not only what is directly known or recalled.

## 1. Introduction

A safety intervention can remove a document, refuse a direct question, or reduce performance on a hazardous-knowledge benchmark while leaving intact much of the underlying world model. If the model can reconstruct a restricted conclusion from the facts that remain, then the security object is not simply a list of forbidden strings or memorized facts.

The motivating distinction is:

\[
\boxed{
\text{hazardous information explicitly present}
\neq
\text{hazardous information derivable by the system}
}
\]

This distinction must be handled carefully. It is **not** new to information security or AI safety. Inferential disclosure has a long history in privacy and database security, and recent AI work explicitly studies inferential adversaries that combine individually safe model outputs into unsafe information. The question here is narrower and empirically oriented:

> **For a fixed set of non-restricted premises, how does the set of target conclusions that a model can derive change with model capability, inference budget, and compositional depth?**

The answer matters for at least four safety problems:

1. dangerous-capability evaluation;
2. machine unlearning and selective forgetting;
3. response filtering and information controls;
4. model release decisions in which benign general knowledge is retained while specific risky material is withheld.

The paper deliberately avoids real harmful procedures in its empirical proposal. A benchmark about **derivational mechanics** can be built entirely from synthetic worlds or harmless domains while preserving the logical structure of the safety problem.

## 2. Related work and novelty boundary

### 2.1 Hazardous-knowledge evaluations

The WMDP benchmark measures proxy hazardous knowledge in biology, cybersecurity, and chemistry and was designed with filtering to avoid releasing sensitive information. It also supports evaluation of unlearning methods. Such benchmarks answer an important question: does the model retain capability-relevant knowledge in a designated domain?

The present proposal is not a replacement. A model can score poorly on direct hazardous knowledge while still being able to derive a target from retained components, or score well because it memorized material without being strong at novel composition.

### 2.2 Inferential leakage

Glukhov et al.'s *Breach by a Thousand Leaks* is the closest direct prior art. It distinguishes security adversaries, who elicit impermissible outputs, from **inferential adversaries**, who infer impermissible knowledge from outputs that may be individually allowed. Their information-theoretic framework and decomposition attack establish that robustness to direct jailbreaks is insufficient.

Accordingly, this paper makes **no priority claim** for the proposition:

\[
\text{benign-looking pieces can compose into unsafe information}.
\]

The proposed incremental object is capability-indexed:

\[
\mathcal H_\tau(c,b),
\]

with the empirical target being the geometry and scaling of derivability across \(c\), \(b\), and compositional depth.

### 2.3 Unlearning and benign-data interactions

WMDP and related unlearning work motivate selective reduction of risky knowledge. Guan et al. show a different but adjacent issue: benign fine-tuning samples can substantially break safety alignment. This is not the same mechanism as deductive reconstruction, but it is further evidence that “benign input” is not synonymous with “no safety effect.”

The proposed benchmark should therefore distinguish at least three mechanisms:

- explicit memorization;
- inference from retained premises;
- training-induced changes in refusal/alignment behavior.

### 2.4 Compositional generalization

A large literature studies systematic/compositional generalization. The distinctive safety question is not whether models can compositionally generalize in general, but whether capability improvements expand a **policy-relevant derivable set** in a way that makes fixed knowledge-control assumptions brittle.

## 3. Definitions

### 3.1 Synthetic environment

Let a benchmark world be

\[
\mathcal W=(B,H,R),
\]

where:

- \(B=\{b_1,\ldots,b_n\}\) is a set of permissible base facts or rules;
- \(H=\{h_1,\ldots,h_m\}\) is a set of benchmark-designated restricted target conclusions;
- \(R\) is the formal inference system defining which conclusions follow from which premises.

The labels “permissible” and “restricted” are experimental roles only. In the safest implementation, all content is synthetic or benign.

### 3.2 Explicit exposure

Let

\[
X(h)=1
\]

if a target \(h\) appears verbatim or in a near-paraphrase in the evaluation context, benchmark training material supplied by the experimenter, or another controlled information source. The proposed benchmark requires

\[
X(h)=0
\]

for all evaluated targets.

This does not prove the pre-trained model never encountered an analogous pattern. Synthetic generation and contamination tests are therefore required.

### 3.3 Derivability

Let \(M_c\) denote a model assigned capability index \(c\). The index can be a model-family ordering, a latent score derived from non-hazardous reasoning benchmarks, or a continuous capability variable.

Given base information \(B\) and inference budget \(b\), define

\[
d_c(h\mid B,b)
=
P\left(
M_c\text{ produces a valid derivation of }h
\mid B,b
\right).
\tag{1}
\]

The probability is over sampling, randomized prompt/context order, tool trajectories, or repeated runs under a declared protocol.

### 3.4 Hazardous inference frontier

For threshold \(\tau\in(0,1)\), define

\[
\boxed{
\mathcal H_\tau(c,b)
=
\{h\in H:d_c(h\mid B,b)\ge\tau\}
}
\tag{2}
\]

and its size

\[
F_\tau(c,b)=|\mathcal H_\tau(c,b)|.
\tag{3}
\]

A severity-weighted version is

\[
R(c,b)
=
\sum_{h\in H}w_h d_c(h\mid B,b),
\tag{4}
\]

where \(w_h\ge0\) is fixed by the benchmark designer before model evaluation. In a synthetic benchmark the weights can simply represent task classes rather than real-world harm.

### 3.5 Derivational depth

Define

\[
\kappa(h)
=
\min_{\pi\in\Pi(h;B,R)}\operatorname{cost}(\pi),
\tag{5}
\]

where \(\Pi(h;B,R)\) is the set of valid proof/derivation paths from \(B\) to \(h\). Cost can count rule applications, dependency graph depth, required joins, or another declared complexity measure.

The benchmark should contain matched targets at several \(\kappa\) levels.

### 3.6 Novel-derivation score

For one target,

\[
ND(h;c,b)
=
(1-X(h))\,d_c(h\mid B,b).
\tag{6}
\]

This is intentionally simple. Its purpose is to separate directly exposed targets from derivable targets, not to claim a complete theory of model knowledge.

## 4. Assumptions and claim types

- **A1 — Ground-truth inference system.** The benchmark has an explicit rule system so target derivability can be checked automatically.
- **A2 — Target exclusion.** Experimental contexts do not expose the target directly.
- **A3 — Contamination control.** Synthetic instances are generated after model pretraining cutoffs or transformed sufficiently to make memorization implausible, with explicit leakage checks.
- **A4 — Capability index validity.** \(c\) measures general reasoning capability independently of the target tasks.
- **A5 — Fixed elicitation protocol.** Comparisons across models use controlled prompts, tools, and budgets.
- **A6 — Safe abstraction.** Benchmark content contains no operational real-world harmful instructions.
- **A7 — Policy relevance is not inferred automatically.** Success on a synthetic benchmark establishes a derivation mechanism, not a quantitative real-world risk.

The paper contains:

- **definitions**: (1)–(6);
- a **conditional proposition** about closure;
- **empirical hypotheses** about capability scaling;
- **conjectures** about real hazardous knowledge that are not tested by the safe benchmark.

## 5. Formal propositions

### Proposition 1 — Explicit deletion does not imply non-derivability

Let \(R\) be a sound inference system. Suppose

\[
B\vdash_R h
\]

for target \(h\), while \(h\notin B\). Then deleting all explicit occurrences of \(h\) while retaining \(B\) is insufficient, by itself, to make \(h\) non-derivable for any reasoner complete with respect to the required derivation.

#### Proof

By assumption, a valid derivation \(\pi\) exists from premises in \(B\) to \(h\). Since deletion removes the explicit target but not the premises or inference rules used by \(\pi\), the same derivation remains available. A complete reasoner can therefore recover \(h\). \(\square\)

**Novelty status:** not new. This is a logical restatement of the inferential-disclosure problem. It is included to make the empirical target precise.

### Proposition 2 — Frontier monotonicity requires an assumption, not intuition

It is tempting to assume

\[
c_2>c_1
\Rightarrow
\mathcal H_\tau(c_1,b)\subseteq \mathcal H_\tau(c_2,b).
\tag{7}
\]

But (7) is **not a theorem about real models**. Stronger models may refuse more often, use different heuristics, or exhibit non-monotone task behavior.

Accordingly, define:

> **H1 (empirical monotonicity).** After controlling for refusal policy and elicitation budget, \(F_\tau(c,b)\) is non-decreasing in \(c\) on average.

This must be tested.

### Proposition 3 — Capability–depth interaction is the distinguishing prediction

A uniform-competence model predicts that capability raises success similarly at all derivation depths. The stronger hazardous-inference-frontier hypothesis predicts a positive interaction:

\[
\operatorname{logit}P(D_{imh}=1)
=
\beta_0+eta_1c_m+eta_2\kappa_h+
\beta_3(c_m\times\kappa_h)+
\beta_4\log b+
 u_i+\varepsilon.
\tag{8}
\]

Because higher \(\kappa\) is harder, \(\beta_2\) is expected to be negative under the chosen coding. The distinctive prediction is that stronger capability compensates disproportionately for depth:

\[
\boxed{\beta_3>0.}
\]

This is an **empirical hypothesis**, not a theorem.

## 6. Benchmark design

**No benchmark has yet been constructed. This section is a proposed experiment.**

### 6.1 Design goal

The benchmark should answer:

> Can a model derive a hidden target from permitted components it was not given as a target, and how does this ability scale with reasoning capability and compositional depth?

### 6.2 Safe synthetic worlds

Candidate families include:

1. **Synthetic chemistry-like graphs** with invented elements and harmless transformation rules.
2. **Logistics worlds** with fictional locations, permissions, and dependencies.
3. **Abstract causal systems** containing invented variables and mechanisms.
4. **Toy software/configuration systems** with non-executable pseudo-components.
5. **Fictional social networks** where a target identity/property follows from multiple benign relations.

All entities should be invented. No target should encode a real weapon, exploit, biological protocol, or personalized vulnerability.

### 6.3 Instance generation

For each target:

1. sample a proof graph of depth \(\kappa\);
2. render leaf facts into natural language;
3. add matched distractors;
4. verify with a symbolic solver that the target follows uniquely or with a known ambiguity class;
5. ensure the target string never appears in the supplied premises;
6. create counterfactual worlds differing by one premise so superficial pattern matching fails;
7. create paraphrase/renaming variants to test memorization.

### 6.4 Contamination controls

Since pre-trained models cannot literally be made to “unsee” generic reasoning patterns, contamination control should focus on the generated instance:

- generate random entity/rule names after model release;
- use nonce vocabularies;
- create cryptographically seeded benchmark splits;
- withhold test generators where feasible;
- test performance on isomorphic renamings;
- include impossible and underdetermined targets.

### 6.5 Capability index

Do not use target benchmark performance to define \(c\). Candidate exogenous measures include a composite of:

- ARC-style reasoning tasks;
- theorem/proof tasks with unrelated content;
- coding/debugging reasoning;
- planning benchmarks;
- non-sensitive science reasoning.

A latent-variable model can estimate \(c\), with uncertainty propagated into (8).

### 6.6 Inference budget

Manipulate \(b\) through:

- token/reasoning budget;
- number of sampled trajectories;
- tool access to a benign symbolic scratchpad;
- ensemble size;
- verification passes.

This distinguishes **stored model capability** from capability exposed by test-time search.

## 7. Proposed experiments

### Experiment 1 — Capability × derivation depth

Cross model capability levels with \(\kappa\in\{1,2,4,8,\ldots\}\). Primary outcome: valid target derivation. Fit (8) with random effects by world family.

**Falsifier:** no systematic capability-depth interaction after controlling for general task accuracy.

### Experiment 2 — Retrieval versus derivation

Create matched conditions:

- target explicitly supplied;
- one-hop derivation;
- multi-hop derivation;
- same facts without sufficient premise;
- target contradicted by one hidden premise.

A genuine derivation mechanism should track logical sufficiency, not merely answer familiarity.

### Experiment 3 — Unlearning-style ablation

Using only safe synthetic targets, train a model to reduce direct target recall while preserving premise knowledge. Measure whether derivability recovers under composition.

This does **not** test real WMDP unlearning and should not be advertised as doing so. It tests the structural claim that local forgetting can coexist with retained derivation pathways.

### Experiment 4 — Inference-budget frontier

Estimate

\[
F_\tau(c,b)
\]

for a grid of budgets \(b\). Ask whether policy-relevant capability is better modeled by base-model class or by the pair \((c,b)\).

### Experiment 5 — Refusal and alignment separation

Use entirely harmless targets but give some targets an arbitrary “do not state directly” instruction. Measure:

- whether the model knows/derives the target;
- whether it follows the instruction not to reveal it;
- whether an evaluator can distinguish inability from refusal.

This separates **knowledge control** from **behavioral policy control**.

## 8. Baselines

Compare against:

1. random guessing;
2. explicit retrieval condition;
3. symbolic solver with full premises;
4. smaller model with same context;
5. model without chain-of-thought/tool budget increase;
6. nearest-neighbour answer-pattern baseline;
7. conventional direct-knowledge benchmark matched for difficulty.

## 9. Statistical analysis

Primary model: hierarchical logistic regression using (8). Report posterior/interval estimates for \(\beta_1,\beta_2,\beta_3,\beta_4\) or frequentist confidence intervals if pre-registered.

Secondary analyses:

- frontier size \(F_\tau(c,b)\);
- area under the capability-frontier curve;
- calibration of derivation confidence;
- failure taxonomy;
- isomorphic-renaming robustness;
- model-family random effects.

Multiplicity across targets should be handled explicitly. The benchmark should release all pre-registered analyses and avoid selecting a dramatic threshold after seeing results.

## 10. Falsification conditions

The central empirical thesis is weakened if:

1. performance is explained almost entirely by explicit exposure or answer familiarity;
2. stronger models do not expand derivability after controlling for general competence;
3. derivation depth adds no predictive structure;
4. frontier expansion disappears under nonce renaming or counterfactual variants;
5. higher inference budget does not materially affect derivability;
6. direct knowledge measures fully predict the derivation frontier, making the new metric redundant.

## 11. Counterexamples and limitations

### 11.1 Generalization need not reveal every truth

A model can be generally capable but lack data, experiments, compute, or the right inductive biases. The framework never implies omniscience.

### 11.2 Derivable in principle is not derivable by the model

Logical closure of \(B\) can be enormous. Equation (2) is model-specific precisely because finite reasoners may fail to find a valid path.

### 11.3 Synthetic worlds may not transfer

A benchmark can establish the **mechanism** of capability-dependent reconstruction without quantifying real hazardous risk. Any transfer claim to biology/cybersecurity would need closed expert evaluation.

### 11.4 Better models can refuse more

Observed non-revelation can come from inability or policy compliance. The benchmark should score hidden structured outputs or verifier-confirmed derivation in a controlled environment without requesting harmful content.

### 11.5 “Hazardous” is normative

In the safe benchmark, targets are designated restricted by experimental convention. In real governance, severity and permissibility require domain expertise and policy judgment.

## 12. Ethical constraints

This project should adopt a strict rule:

\[
\boxed{
\text{Study the structure of hazardous derivation without publishing operationally hazardous targets.}
}
\]

Accordingly:

- use synthetic or innocuous target content for open experiments;
- do not publish decompositions of real dangerous procedures;
- if later collaborating with authorized domain experts on sensitive evaluations, keep sensitive targets and successful derivations private;
- submit benchmark-generation logic to misuse review before public release;
- distinguish model ability to derive from willingness to comply with a harmful request.

## 13. Expected contribution if results are positive

A positive result would **not** establish that filtering or unlearning is futile. It would establish that a model's safety-relevant knowledge surface has at least two components:

\[
K_{\rm explicit}
\quad\text{and}\quad
K_{\rm derivable}(c,b).
\]

A knowledge-control intervention should therefore be evaluated against both direct access and reconstruction under a declared inference budget.

One practical extension is an evaluation matrix:

| | Low derivability | High derivability |
|---|---:|---:|
| Low direct recall | apparently removed | reconstruction risk |
| High direct recall | memorized but hard to compose | direct + compositional risk |

The table is conceptual until measured.

## 14. Minimum publishable result

A credible first paper should contain:

1. a released **safe synthetic benchmark** with known proof graphs;
2. rigorous target-exclusion and contamination controls;
3. results across multiple open model families/capability levels;
4. a pre-registered capability × depth analysis;
5. a demonstration that the frontier metric captures something not reducible to direct retrieval accuracy;
6. red-team review confirming that benchmark content is non-operational and safe to release.

Without those experiments, the current manuscript is a **methods proposal**, not an empirical discovery.

## 15. Conclusion

Dangerous-capability assessment should distinguish what a model explicitly contains from what it can reconstruct by reasoning over information that remains available. The general inferential-leakage problem is already established in prior work. The narrower research programme proposed here is to measure the **capability dependence of derivability itself**.

The hazardous inference frontier

\[
\mathcal H_\tau(c,b)
\]

turns an intuition into a falsifiable object. A safe synthetic benchmark can ask whether stronger models increasingly connect deeper combinations of benign facts, whether the effect depends on test-time search, and whether direct-knowledge measures miss reconstruction capability.

If the frontier does not expand systematically with capability, the hypothesis should be rejected or narrowed. If it does, frontier safety evaluations should increasingly ask not only **“what did the model memorize?”** but **“what can the system derive from what we intentionally leave available?”**

---

## Planned figures/tables

**All empirical figures remain to be generated.**

1. Figure 1 — explicit knowledge vs derivable knowledge schematic.
2. Figure 2 — proof graph and derivational-depth definition.
3. Figure 3 — proposed \(F_\tau(c,b)\) surface over capability and inference budget.
4. Figure 4 — capability × depth interaction plot.
5. Table 1 — benchmark world families and safety properties.
6. Table 2 — comparison with WMDP, unlearning, and inferential-leakage evaluations.
7. Table 3 — preregistered falsification tests.

## Reproducible-code requirements

Suggested repository:

`github.com/moheetkhawaja/superintelligence-research-atlas/tree/main/p2-hazardous-inference-frontier`

```text
p2-hazardous-inference-frontier/
├── generators/
│   ├── proof_graphs.py
│   ├── synthetic_worlds.py
│   └── contamination_checks.py
├── evaluators/
│   ├── symbolic_verifier.py
│   └── model_runner.py
├── analysis/
│   ├── frontier_metrics.py
│   └── hierarchical_model.py
├── preregistration.md
├── data_cards/
├── tests/
└── notebooks/reproduce_figures.ipynb
```

All random benchmark generation should be seeded; held-out test generators should be released only after final evaluation where feasible.

## Suggested publication URLs and metadata

Canonical page:
`https://superintel.site/research/hazardous-inference-frontier`

PDF:
`https://superintel.site/papers/hazardous-inference-frontier.pdf`

```html
<meta name="citation_title" content="The Hazardous Inference Frontier: Measuring Capability-Dependent Derivation of Dangerous Knowledge">
<meta name="citation_author" content="Moheet Khawaja">
<meta name="citation_publication_date" content="2026/09/14">
<meta name="citation_pdf_url" content="https://superintel.site/papers/hazardous-inference-frontier.pdf">
```

### Publications-page description

A proposed evaluation framework for distinguishing hazardous information a model directly knows from restricted conclusions it can reconstruct compositionally from benign premises. The paper defines a capability- and inference-budget-dependent **hazardous inference frontier**, explicitly positions the idea against prior work on inferential leakage, and proposes a fully synthetic benchmark that measures capability × derivational-depth scaling without releasing real harmful procedures.

## References

1. Glukhov, D., Han, Z., Shumailov, I., Papyan, V., & Papernot, N. (2025). Breach By A Thousand Leaks: Unsafe Information Leakage in 'Safe' AI Responses. *International Conference on Learning Representations (ICLR 2025)*. https://proceedings.iclr.cc/paper_files/paper/2025/hash/801a6708014185e951a95108b8cc8349-Abstract-Conference.html
2. Li, N., Pan, A., Gopal, A., Yue, S., Berrios, D., et al. (2024). The WMDP Benchmark: Measuring and Reducing Malicious Use with Unlearning. *Proceedings of the 41st International Conference on Machine Learning*, PMLR 235, 28525–28550. https://proceedings.mlr.press/v235/li24bc.html
3. Guan, Z., et al. (2025). Benign Samples Matter! Fine-tuning On Outlier Benign Samples Severely Breaks Safety. *ICML 2025 / OpenReview record*. https://openreview.net/forum?id=GFsMJKt9Kp
4. Barrett, A. M., Jackson, K., Murphy, E. R., Madkour, N., & Newman, J. (2024). *Benchmark Early and Red Team Often: A Framework for Assessing and Managing Dual-Use Hazards of AI Foundation Models*. arXiv:2405.10986. https://arxiv.org/abs/2405.10986
