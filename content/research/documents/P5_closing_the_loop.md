# Closing the Loop: Measuring Human Causal Dependence in Recursive AI R&D

**Moheet Khawaja**  
Working paper v0.1 — 14 September 2026

> **Epistemic and provenance note.** The author's core interest in distinguishing AI-assisted AI research from genuinely closed-loop recursive self-improvement is **O→F** (theses 17–18). However, by September 2026 this is a crowded and rapidly advancing field: recent work already proposes multi-level RSI taxonomies, loop-closure axes, Headroom-Closed Index measures, and dedicated benchmarks. This paper therefore does **not** claim to introduce the idea of stages of RSI or “research taste” as a bottleneck. Its candidate contribution is a causal-ablation framework that measures the *marginal human contribution at each indispensable stage of repeated AI-R&D cycles* and tests whether that measure predicts persistent inherited gains better than ordinary agent benchmarks.

## Abstract

“AI helps build AI” is not a binary state. Current systems can write code, run experiments, analyze results, and sometimes propose research steps, while humans may still select objectives, define success criteria, choose checkpoints, and decide which discoveries matter. This paper proposes a causal framework for measuring how much an AI-development loop still depends on human judgment. I decompose a research cycle into objective selection \(O\), experiment design \(X\), implementation \(I\), evaluation \(E\), and successor/next-step selection \(S\). For each stage, **human causal contribution** is defined as the change in held-out research outcome when competent human judgment at that stage is replaced by a fixed AI or baseline policy under matched resources. The vector \(\mathbf H=(H_O,H_X,H_I,H_E,H_S)\) is intended to complement—not replace—existing RSI taxonomies and benchmarks. A loop is operationally “more closed” when human ablations cause progressively smaller losses across all stages required for persistent successor improvement. The proposed experiment runs multi-round AI-R&D tasks with factorial stage replacement, frozen evaluators, checkpoint inheritance, and repeated fresh-seed replications. The key empirical hypotheses are that implementation dependence falls before direction-setting dependence, and that low human dependence in objective/evaluation/successor-selection stages predicts multi-round inherited improvement better than single-round coding or research scores. No experiments have yet been run; the manuscript specifies falsifiers, baselines, safety constraints, and a minimum publishable result.

## 1. Introduction

The phrase **recursive self-improvement (RSI)** is used for systems ranging from agents that refine one answer to hypothetical systems that autonomously design and build successors. This creates a measurement problem. If an AI writes 90% of code but humans still choose the research programme, define the objective, recognize the important anomaly, and select which checkpoint to inherit, how “recursive” is the process?

Recent evidence makes this distinction operationally important. Frontier labs report rapidly increasing AI contribution to AI-development work while still identifying human direction-setting and judgment as meaningful bottlenecks. Recent academic work simultaneously introduces RSI taxonomies and benchmarks for personal-agent learning, data-centric research, and algorithm design.

A useful measurement framework should therefore answer a more causal question:

> **If we remove human judgment from each stage of the improvement loop, which removals materially reduce the quality or persistence of future improvements?**

This paper proposes measuring that marginal causal dependence directly.

## 2. Related work and novelty boundary

### 2.1 Frontier-lab evidence

Anthropic's 2026 *When AI builds itself* documents extensive AI contribution to implementation and experimentation, including high shares of merged code and automated research loops, while explicitly stating that full RSI has not been achieved and is not inevitable. It identifies research direction-setting as one of the remaining human roles.

This provides motivation but not a general RSI metric.

### 2.2 RSI taxonomies

Duan et al. propose a roadmap from improvement-execution autonomy through strategy, experience acquisition, environmental adaptation, and recursive meta-improvement, and introduce a Headroom-Closed Index. Chen et al. survey 1,250 papers and explicitly organize the field by what is improved and the degree of loop closure, including a verification hierarchy and a research-direction bottleneck.

Consequently, a paper that merely says “RSI has stages” would add little.

### 2.3 RSI benchmarks

PAST-Bench evaluates whether personal agents convert retained experience into later-task gains. RSIBench-Data evaluates iterative data-centric post-training research. AI4AI-Bench tests agents' ability to change training algorithms under fixed evaluation procedures. These are highly relevant and substantially narrow the space for novelty.

The proposed contribution here is not another single-domain benchmark. It is an **intervention framework** for estimating how much *human judgment at each stage* causally contributes to repeated successor improvement.

## 3. Research-cycle decomposition

Represent one AI-R&D cycle as:

\[
O_k
\rightarrow
X_k
\rightarrow
I_k
\rightarrow
E_k
\rightarrow
S_k
\rightarrow
Q_{k+1},
\tag{1}
\]

where:

- \(O_k\): objective/research-direction selection;
- \(X_k\): experiment/method design;
- \(I_k\): implementation/execution;
- \(E_k\): evaluation/interpretation of evidence;
- \(S_k\): successor or next-step selection;
- \(Q_{k+1}\): state/quality of the inherited research system after the cycle.

The decomposition is deliberately coarse. A concrete benchmark can split stages further.

### 3.1 Persistent improvement

A key distinction is between local task gain and inherited improvement.

Let

\[
G_k=Q_{k+1}-Q_k.
\]

Call improvement **persistent** if it survives a fresh evaluation distribution or contributes to later-cycle performance:

\[
\mathbb E[Q_{k+j}\mid\text{inherit improvement from }k]
>
\mathbb E[Q_{k+j}\mid\text{matched no-inheritance control}]
\]

for at least one pre-specified \(j\ge1\).

This prevents a one-off benchmark hack from being counted as recursive self-improvement.

## 4. Human causal contribution

For stage \(j\in\{O,X,I,E,S\}\), let \(Z_j=H\) denote competent human execution of that stage and \(Z_j=A\) denote AI-only execution under matched external resources.

Define the potential outcome

\[
Q^{(z_O,z_X,z_I,z_E,z_S)}_{k+1}.
\]

The **human causal contribution** at stage \(j\) is

\[
H_j
=
\mathbb E\left[
Q_{k+1}^{(Z_j=H,Z_{-j}=A)}
-
Q_{k+1}^{(Z_j=A,Z_{-j}=A)}
\right].
\tag{2}
\]

Equation (2) estimates the incremental value of human judgment at one stage when the rest of the cycle is AI-operated.

### 4.1 Full human-dependence vector

Define

\[
\mathbf H
=(H_O,H_X,H_I,H_E,H_S).
\tag{3}
\]

A loop can be highly autonomous at implementation while remaining heavily human-dependent at objective selection:

\[
H_I\approx0,
\qquad
H_O\gg0.
\]

That is precisely the distinction ordinary “percent AI-written code” metrics miss.

### 4.2 Normalized dependence

Because research tasks have different scales, define

\[
\tilde H_j
=
\frac{H_j}{Q_H-Q_0},
\tag{4}
\]

where \(Q_H\) is a human-rich reference system and \(Q_0\) a fixed baseline. The denominator must be positive and defined in advance.

### 4.3 Candidate Loop-Closure Index

A descriptive candidate is

\[
\operatorname{LCI}
=
1-
\sum_j w_j\max(0,\tilde H_j),
\qquad
\sum_jw_j=1.
\tag{5}
\]

**Status:** (5) is a proposed metric, not validated. It should not be used as an RSI label until the weights and predictive value are empirically tested. The vector \(\mathbf H\) is scientifically safer than collapsing it prematurely.

## 5. Assumptions

- **A1 — Stage separability.** The chosen task allows meaningful intervention at stages \(O,X,I,E,S\).
- **A2 — Resource matching.** Human and AI stage replacements receive comparable compute, data, tools, and time budgets where possible.
- **A3 — Frozen external evaluator.** Final outcome measurement is not controlled by the improving agent.
- **A4 — Multi-round inheritance.** Improvements can persist into later cycles.
- **A5 — Fresh validation.** Held-out evaluations detect local overfitting/hacking.
- **A6 — Human competence.** Human-stage baselines are drawn from participants with task-relevant expertise.
- **A7 — No hidden human leakage.** AI-only conditions do not receive unrecorded research-direction input from humans.
- **A8 — Safety-bounded domain.** Tasks do not involve capabilities whose autonomous improvement would create material misuse risk.

## 6. Candidate propositions and hypotheses

### Proposition 1 — Amdahl-style bottleneck of indispensable human stages

Suppose total cycle time is

\[
T=\sum_jT_j.
\]

Let fraction \(p\) of total baseline time be arbitrarily accelerated by AI by factor \(s\), while fraction \(1-p\) remains human-limited. Then total speedup is

\[
S(s)
=
\frac{1}{(1-p)+p/s}.
\tag{6}
\]

As \(s\to\infty\),

\[
S_{\max}
=
\frac{1}{1-p}.
\tag{7}
\]

**Interpretation:** arbitrarily fast implementation cannot remove a non-negligible direction/evaluation bottleneck. This is Amdahl's law, not a new theorem.

### Hypothesis H1 — Implementation closes before direction selection

Across AI-R&D benchmarks,

\[
\tilde H_I<\tilde H_O
\]

on average at current frontier capability.

This is a testable hypothesis, motivated by current lab reports and recent benchmark behavior.

### Hypothesis H2 — Evaluation and successor selection predict persistent gain

Low human dependence in \(E\) and \(S\) should predict multi-round persistent improvement more strongly than low dependence in implementation alone:

\[
\operatorname{Corr}(\tilde H_E+\tilde H_S, G_{k+2:k+m})
<0.
\tag{8}
\]

### Hypothesis H3 — Single-round performance overstates loop closure

Systems that score highly on one-round R&D tasks can still have large \(H_O\) or \(H_S\), producing weak multi-round inheritance.

### Conjecture C1 — Qualitative regime change requires low dependence across *critical* stages

A loop should not be considered operationally self-directed merely because mean \(\tilde H_j\) is low. If any indispensable stage has large human dependence, that stage can remain the control bottleneck.

This is a conceptual conjecture until “indispensable” is formalized per task.

## 7. Proposed benchmark design

**No benchmark has yet been run for this manuscript.**

### 7.1 Safe domains

Candidate task families:

- optimizing toy ML training algorithms;
- improving small open-source models on non-sensitive benchmarks;
- data-selection/post-training tasks with fixed datasets;
- compiler/kernel optimization in sandboxed toy environments;
- theorem-proving or algorithm-discovery tasks with formal verification.

Do not use autonomous cyber exploitation, biological design, or unrestricted capability-improvement targets.

### 7.2 Factorial stage replacement

For each task, run conditions in which each stage is assigned to:

- expert human;
- frontier agent;
- fixed heuristic/baseline.

A full \(3^5\) factorial design is expensive. Use a fractional factorial or targeted ablation design focused on:

\[
(H,A,A,A,A),
(A,H,A,A,A),
\ldots,
(A,A,A,A,H),
(A,A,A,A,A),
(H,H,H,H,H).
\]

### 7.3 Multi-round protocol

Run \(K\ge3\) improvement cycles. At each cycle:

1. start from inherited checkpoint/system state;
2. execute stage assignments;
3. freeze all outputs;
4. score with an evaluator hidden from the acting agent;
5. carry the selected successor into the next cycle;
6. evaluate final state on held-out tasks.

### 7.4 Human contamination logging

Every human intervention must be logged and classified:

- objective-setting;
- bug fix;
- interpretation;
- evaluator repair;
- checkpoint rescue;
- resource/tool provisioning.

“AI ran autonomously” is not a meaningful claim if crucial human rescue steps are omitted from accounting.

## 8. Identification strategy

The ideal estimand (2) requires exchangeability under stage assignment. Randomized stage allocation within tasks can approximate this.

For task \(i\), cycle \(k\), stage \(j\):

\[
Y_{ik}
=
\alpha_i+	au_jZ_{ijk}+\gamma_k+\epsilon_{ik}
\tag{9}
\]

with task fixed/random effects and cycle effects. Interactions between stages matter; use a hierarchical model that includes selected pairwise terms.

For persistent improvement, use final held-out performance as primary outcome rather than within-cycle reward.

## 9. Baseline comparisons

Compare \(\mathbf H\) and LCI against:

- coding benchmark score;
- METR-style autonomous task horizon;
- HCI or other RSI benchmark scores;
- AI4AI-Bench score;
- RSIBench-Data score;
- percent AI-authored code;
- raw number of experiments executed.

The new metric earns its keep only if it predicts held-out, multi-round inherited improvement beyond simpler metrics.

## 10. Falsification conditions

The paper's distinctive claim is weakened if:

1. stage-specific human ablations explain no additional variance beyond ordinary agent benchmarks;
2. research stages cannot be intervened on reliably;
3. human dependence estimates are unstable across minor task redesigns;
4. multi-round gains are dominated by evaluator exploitation rather than inherited competence;
5. direction-selection dependence is already negligible across broad tasks, making the proposed bottleneck outdated;
6. the LCI fails to predict held-out successor gains.

## 11. Failure modes

### 11.1 Stages are not truly separable

Research is iterative: evaluation changes objective selection; implementation reveals new hypotheses. A graph-based causal model may ultimately replace the five-stage chain.

### 11.2 Human baselines are variable

Experts differ greatly in research taste. Report distributions, not one “human” number.

### 11.3 AI resource advantages distort comparison

An AI may run thousands of experiments while a human is time-limited. This can be appropriate for operational autonomy but should be reported separately from per-resource research judgment.

### 11.4 Hidden evaluator dependence

If the target AI can infer or influence the evaluator, observed improvement may be reward hacking rather than scientific progress.

### 11.5 Benchmark-induced myopia

A system can close loops on narrow tasks while remaining unable to choose important open-ended research programmes.

## 12. Ethical constraints

- Keep tasks below dangerous capability thresholds.
- Use sandboxed compute and restricted tool access.
- Do not provide unrestricted self-replication or external network access.
- Freeze and independently review any agent-generated changes before execution in broader environments.
- Publish task designs that measure loop closure without serving as a recipe for unsafe autonomous capability escalation.

## 13. Why this is a separate paper from the assurance queue

P1 asks:

\[
\text{Can assurance keep pace with system change?}
\]

This paper asks:

\[
\text{How much of the process producing system change still causally depends on humans?}
\]

The output of P5—an estimated degree of R&D loop closure—can become an input to P1's arrival-rate model, but the two are distinct empirical objects.

## 14. Limitations

The stage decomposition is a modeling convenience: real AI R&D mixes agenda setting, implementation, interpretation, evaluation, and resource allocation in ways that may not be cleanly separable. Human contribution estimates depend on the quality and comparability of the replacement policy used at each stage. Results on bounded benchmark environments may overstate autonomy relative to open-ended frontier research, where tacit knowledge, organizational context, long time horizons, and changing objectives matter. Conversely, benchmark designs that rely on human-authored scoring rubrics may understate AI autonomy by retaining hidden human dependence. The proposed Loop-Closure Index should therefore not be treated as a universal scalar measure until it demonstrates predictive validity across multiple research environments and multiple rounds of successor improvement.

## 14. Minimum publishable result

Given the dense 2026 RSI literature, a conceptual paper alone is insufficient. A credible contribution requires:

1. at least two safe AI-R&D task families;
2. multi-round improvement with inherited checkpoints;
3. randomized or tightly matched human-stage ablations;
4. estimates of \(\mathbf H\) with uncertainty;
5. comparison against at least two existing RSI/agent metrics;
6. evidence that stage-specific causal dependence predicts persistent held-out gains beyond simpler scores.

If this cannot be demonstrated, the idea should remain a methods note rather than a standalone paper.

## 15. Conclusion

The transition from AI-assisted development to recursive self-improvement should not be diagnosed by a single anecdote, percent of AI-written code, or one benchmark win. The relevant question is which **causal dependencies on human judgment remain in the repeated improvement loop**.

This paper proposes measuring those dependencies stage by stage:

\[
\mathbf H=(H_O,H_X,H_I,H_E,H_S).
\]

The framework makes a falsifiable distinction between a system that executes research rapidly under human direction and one that can repeatedly select objectives, design experiments, judge evidence, choose successors, and preserve gains with little human causal contribution.

That distinction is increasingly measurable. The burden of this paper is to show that the proposed causal vector predicts something existing RSI benchmarks do not. Until then, “loop closure” remains a research hypothesis rather than a declaration that recursive self-improvement has arrived.

---

## Planned figures/tables

1. Figure 1 — O→X→I→E→S causal loop.
2. Figure 2 — human causal-contribution vector for hypothetical systems.
3. Figure 3 — factorial ablation design.
4. Figure 4 — proposed multi-round inheritance trajectories.
5. Table 1 — comparison with HCI, PAST-Bench, RSIBench-Data, AI4AI-Bench.
6. Table 2 — stage definitions, interventions, and failure criteria.

## Reproducible-code requirements

Suggested repository:

`github.com/moheetkhawaja/superintelligence-research-atlas/tree/main/p5-rsi-loop-closure`

Include benchmark task containers, stage-assignment orchestration, immutable evaluators, trajectory logs, checkpoint hashes, human-intervention logs, analysis scripts, and preregistration.

## Suggested publication URLs and metadata

Canonical page:
`https://superintel.site/research/closing-the-loop`

PDF:
`https://superintel.site/papers/closing-the-loop.pdf`

```html
<meta name="citation_title" content="Closing the Loop: Measuring Human Causal Dependence in Recursive AI R&D">
<meta name="citation_author" content="Moheet Khawaja">
<meta name="citation_publication_date" content="2026/09/14">
<meta name="citation_pdf_url" content="https://superintel.site/papers/closing-the-loop.pdf">
```

### Publications-page description

A causal measurement framework for distinguishing AI-assisted AI development from genuinely closed research loops. Instead of counting AI-written code or assigning a categorical RSI level, the paper proposes stage-specific ablations of objective selection, experiment design, implementation, evaluation, and successor selection, measuring how much each stage still benefits from human judgment across repeated inherited improvement cycles.

## References

1. Anthropic Institute. (2026). *When AI builds itself: Our progress toward recursive self-improvement, and its implications*. https://www.anthropic.com/institute/recursive-self-improvement
2. Duan, Y., Liu, Y., Tang, Z., Chen, H., Zhou, J., et al. (2026). *The Last AI Built by Humans: Toward Genuine Recursive Self-Improvement*. arXiv:2609.11873. https://arxiv.org/abs/2609.11873
3. Chen, M., Wang, L., & Qu, B. (2026). *Recursive Self-Improvement in AI: From Bounded Self-Refinement to Autonomous Research Loops*. arXiv:2607.07663. https://arxiv.org/abs/2607.07663
4. Xue, S., Ding, Z., Shen, Y., Wang, Y., Yin, Z., et al. (2026). *PAST-Bench: Benchmarking the Foundations of Recursive Self-Improvement in Personal Agents*. arXiv:2608.04003. https://arxiv.org/abs/2608.04003
5. Meng, F., Du, L., Chen, Q., Zhao, Z., Lu, H., Hu, M., & Shieh, M. Q. (2026). *RSIBench-Data: Benchmarking Data-Centric Research for Recursive Self-Improvement*. arXiv:2607.25886. https://arxiv.org/abs/2607.25886
6. Chi, Y., Li, W., Hong, D., Wang, X., Gao, M., et al. (2026). *AI4AI-Bench: Benchmarking LLM Agents in Algorithmic Design for Recursive Self-Improvement*. arXiv:2608.20318. https://arxiv.org/abs/2608.20318
7. Liu, Z., Cai, Y., Zhu, X., Zheng, Y., Chen, R., et al. (2025). *ML-Master: Towards AI-for-AI via Integration of Exploration and Reasoning*. arXiv:2506.16499. https://arxiv.org/abs/2506.16499
