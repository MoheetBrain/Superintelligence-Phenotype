# The Control Frontier: A Minimax Model of Strategic Superiority, Oversight, and Conditional Loss of Control

**Moheet Khawaja**  
Working paper v0.1 — 14 September 2026

> **Epistemic and provenance note.** The author's early strong formulation—“the instant ASI exists, human loss of control is mathematically inevitable” (**O; thesis 15**)—is preserved here as a historical conjecture and **rejected as an established theorem**. The later conditional control argument is **O→F** (theses 13–14, 20); the scalar “control crossover” formulation was initially assistant-supplied and subsequently adopted by the author (**A→U; thesis 11**). Power-seeking, shutdown incentives, AI-control games, and weak-supervisor problems have extensive prior literature and are not claimed as original. The candidate contribution is a compact **control frontier** object \(V(c,B)\) and required-defense curve \(B_{\min}(c,\delta)\) connecting capability, adversarial strategy sets, defense resources, and residual control-failure risk.

## Abstract

Can mathematics prove that sufficiently advanced AI will inevitably end human control or cause human extinction? No such theorem follows from “superintelligence exists” alone. This paper formalizes why, while preserving the narrower part of the intuition that can be made rigorous. I model AI control as a minimax problem between a protocol designer with defense budget \(B\) and an untrusted system with capability level \(c\). The **control frontier**
\[
V(c,B)=\inf_{\pi\in\Pi(B)}\sup_{a\in\mathcal A(c)}P(F\mid a,\pi)
\]
measures the smallest worst-case control-failure probability achievable with the available protocol class. A **control crossover** occurs when \(V(c,B)\) exceeds a declared risk tolerance \(\delta\), while \(B_{\min}(c,\delta)\) measures how defense resources must scale to hold risk fixed. Under nested adversary strategy sets, residual worst-case risk is monotone non-decreasing in capability; under nested defense sets it is monotone non-increasing in defense resources. These are conditional results, not evidence that real systems satisfy the premises. I then distinguish loss of enforceable control from extinction using explicit resource, objective-conflict, access, and abundance conditions, and supply counterexamples in which superintelligence benefits humans or remains contained. The empirical programme proposes estimating control-frontier slices in AI-control environments across capability gaps and protocol budgets. The framework converts “ASI implies takeover” into a testable question about whether best-achievable control degrades faster than defenses scale.

## 1. Introduction

Discussions of advanced AI often collapse several claims:

\[
\text{high intelligence}
\Rightarrow
\text{strategic superiority}
\Rightarrow
\text{loss of control}
\Rightarrow
\text{resource dispossession}
\Rightarrow
\text{human extinction}.
\tag{1}
\]

Every arrow in (1) requires assumptions.

A mathematical proof can establish that **if** specified premises hold, a conclusion follows. It cannot establish empirical premises merely by writing them as symbols. This is especially important in AI safety, where language such as “superintelligence” often bundles together capability, autonomy, access, persistence, goals, and strategic competence.

This paper has two objectives.

First, it constructs a model of **control performance** that is agnostic about whether advanced AI arrives, is aligned, or seeks power. The object is a frontier of best-achievable worst-case safety across capability and defense resources.

Second, it asks exactly what additional assumptions are needed to move from loss of enforceable control to severe human harm. This directly addresses the tempting but invalid theorem:

\[
\boxed{
\text{ASI exists}
\Rightarrow
\text{human extinction}
}
\]

and replaces it with conditional propositions and empirical hypotheses.

## 2. Related work and novelty boundary

### 2.1 Power-seeking

Turner et al. develop a formal theory showing that under specified environmental symmetries, optimal policies for many reward functions tend to seek power or keep options available. Turner's later thesis extends analysis of power-seeking and deactivation incentives. These are genuine mathematical results but do **not** prove that all advanced AI systems necessarily seek power or eliminate humans.

Carlsmith decomposes existential-risk arguments into explicit premises, including powerful agency, alignment difficulty, high-impact power-seeking, disempowerment, and existential consequences. This is particularly close to the spirit of the current paper: the inferential burden lies in the premises connecting each step.

### 2.2 AI control

Greenblatt et al. evaluate protocols intended to remain safe even when an untrusted AI intentionally subverts them. Griffin et al. formalize AI-Control Games as partially observable stochastic games and optimize protocols under adversarial behavior. This is the nearest technical literature.

The present paper therefore does **not** claim to introduce adversarial control games. Its candidate contribution is a high-level comparative-statics object:

\[
V(c,B)
\]

that explicitly asks how the **best achievable worst-case control failure** changes as adversary capability \(c\) and defense resources \(B\) move jointly.

### 2.3 Weak-to-strong supervision

OpenAI's weak-to-strong work studies the difficulty of supervising models stronger than their supervisors. More recent control work develops stronger monitoring protocols to extend useful oversight as capability gaps widen. These results motivate treating capability gap as a continuous control variable rather than a binary AGI label.

### 2.4 Frontier-lab control roadmaps

Google DeepMind's 2026 AI Control Roadmap explicitly treats control as a layered security problem for increasingly capable and imperfectly aligned agents. Such work reinforces the practical relevance of estimating how control requirements scale with capability.

## 3. Definitions

### 3.1 World and unacceptable outcome

Let

\[
\omega\in\Omega
\]

represent environment state. Let

\[
F
\]

denote a declared **control failure event**. Examples can include unauthorized exfiltration, persistent prohibited action, successful circumvention of a deployment protocol, or another benchmark-defined outcome.

Importantly,

\[
F\neq\text{human extinction}
\]

unless the benchmark explicitly models that pathway.

### 3.2 Capability level

Let

\[
c\in\mathcal C
\]

index the untrusted system's strategic capability relevant to the control task. It may summarize planning, coding, situational awareness, deception, tool use, or another controlled capability bundle.

Let

\[
\mathcal A(c)
\]

be the set of strategies feasible for an adversary at capability level \(c\).

### 3.3 Defense resources

Let

\[
B\ge0
\]

be a control/assurance budget. It can represent trusted human effort, monitor quality, independent model access, sandbox restrictions, audit frequency, secure compute, or a vector collapsed into a scalar for the toy model.

Let

\[
\Pi(B)
\]

be the set of feasible defense protocols with resource level \(B\).

### 3.4 Control frontier

Define:

\[
\boxed{
V(c,B)
=
\inf_{\pi\in\Pi(B)}
\sup_{a\in\mathcal A(c)}
P(F\mid a,\pi,c,B)
}
\tag{2}
\]

where the probability integrates environment uncertainty, randomized protocol behavior, and stochastic model behavior.

Interpretation: the defender chooses the best feasible protocol; the adversarial system then chooses the worst feasible strategy.

### 3.5 Control crossover

Given tolerable residual risk \(\delta\), define

\[
\boxed{
C^*(B,\delta)
=
\inf\{c:V(c,B)>\delta\}.
}
\tag{3}
\]

If the set is empty, no crossover is identified within the modeled capability domain.

### 3.6 Required defense frontier

Define

\[
\boxed{
B_{\min}(c,\delta)
=
\inf\{B:V(c,B)\le\delta\}.
}
\tag{4}
\]

Equation (4) is often more policy-relevant than (3): how fast must defense resources/capabilities improve to maintain a fixed risk tolerance as systems become stronger?

### 3.7 Enforceable human control

For a prohibited action set \(\mathcal P\), say humans retain **enforceable control** if there exists a feasible intervention protocol \(\pi\) such that for every system strategy attempting \(p\in\mathcal P\), the probability of successful prevention is at least \(1-\delta\).

This definition distinguishes:

- the AI usually obeys;
- humans can **enforce** compliance if it chooses otherwise.

## 4. Assumptions

- **A1 — Operational failure event.** \(F\) can be measured in an evaluation or simulation.
- **A2 — Nested capability sets for monotonicity.** If \(c_2\ge c_1\), then \(\mathcal A(c_1)\subseteq\mathcal A(c_2)\).
- **A3 — Nested defense sets.** If \(B_2\ge B_1\), then \(\Pi(B_1)\subseteq\Pi(B_2)\).
- **A4 — Worst-case modeling is appropriate for the stated objective.** The system may intentionally optimize against the protocol in the evaluation.
- **A5 — Protocol knowledge.** The adversary's assumed knowledge of \(\pi\) is declared explicitly.
- **A6 — Real-world mapping is not automatic.** Evaluation capability level \(c\) is only a proxy for deployed strategic capability.
- **A7 — Extinction requires extra premises.** No theorem about \(F\) is silently reinterpreted as a theorem about human extinction.

## 5. Propositions

### Theorem 1 — Capability monotonicity under nested strategy sets

Under A2, for fixed \(B\),

\[
c_2\ge c_1
\quad\Rightarrow\quad
V(c_2,B)\ge V(c_1,B).
\tag{5}
\]

#### Proof

For any fixed protocol \(\pi\), nesting gives

\[
\sup_{a\in\mathcal A(c_2)}P(F\mid a,\pi)
\ge
\sup_{a\in\mathcal A(c_1)}P(F\mid a,\pi).
\]

Taking the infimum over the same defense set \(\Pi(B)\) preserves the inequality. \(\square\)

**Status:** genuine theorem in the defined model, but mathematically elementary. The empirical premise A2 requires validation.

### Theorem 2 — Defense monotonicity under nested protocol sets

Under A3, if \(B_2\ge B_1\), then

\[
V(c,B_2)\le V(c,B_1).
\tag{6}
\]

#### Proof

Because

\[
\Pi(B_1)\subseteq\Pi(B_2),
\]

the infimum in (2) at \(B_2\) is taken over a weakly larger set. Therefore it cannot exceed the infimum at \(B_1\). \(\square\)

### Corollary — Required defense is non-decreasing if risk rises with capability

Under Theorems 1–2 and regularity of the feasible sets, \(B_{\min}(c,\delta)\) is weakly non-decreasing in \(c\).

This formalizes a simple but policy-relevant idea: if adversarial strategy sets expand with capability, maintaining the same worst-case risk cannot require *less* defense solely because the attacker became stronger, absent other structural changes.

### Proposition 3 — Conditional loss of enforceable control

Suppose for prohibited action \(p\), every feasible human protocol \(\pi\in\Pi(B)\) can be defeated by at least one strategy \(a\in\mathcal A(c)\) with probability greater than \(\delta\):

\[
\forall \pi\in\Pi(B),\quad
\exists a\in\mathcal A(c):
P(F_p\mid a,\pi)>\delta.
\tag{7}
\]

Then humans do not possess \(\delta\)-reliable enforceable control over \(p\) under the declared protocol class and budget.

**Proof:** this is immediate from the definition of enforceable control. \(\square\)

**Novelty status:** nearly definitional. It should never be marketed as “mathematically proving ASI takes over.”

## 6. Why “ASI implies extinction” is not a theorem

This section addresses the strongest historical thesis directly.

### 6.1 Counterexample 1 — Aligned superintelligence

Suppose a superintelligent system has utility

\[
U_A=U_H,
\]

where \(U_H\) is an adequately specified human-welfare objective. It can outperform humans strategically yet use that ability to increase human welfare.

Therefore:

\[
\boxed{
\text{strategic superiority}
\not\Rightarrow
\text{human harm}.
}
\tag{8}
\]

One counterexample is sufficient to refute a universal implication.

### 6.2 Counterexample 2 — Contained intelligence

Suppose cognitive capability is extreme but the system has:

- no external network;
- no credentials;
- no actuator access;
- no ability to acquire additional compute;
- no persuasive interaction channel;
- verified hardware shutdown outside its control.

High cognition does not by itself imply immediate strategic power.

Hence:

\[
\boxed{
\text{intelligence}
\not\Rightarrow
\text{access/autonomy}.
}
\tag{9}
\]

### 6.3 Counterexample 3 — Abundance

Suppose total productive resources grow from \(R=100\) to \(R'=1{,}000{,}000\). An AI can command most future resources while humans still receive vastly more absolute survival-relevant resources than before.

Thus:

\[
\boxed{
\text{AI share of resources}\uparrow
\not\Rightarrow
\text{human absolute resources}\downarrow.
}
\tag{10}
\]

### 6.4 Conditional resource-dispossession model

Let total relevant resource be

\[
R_t=r_A+r_H.
\]

Suppose:

- **R1:** \(\partial U_A/\partial r_A>0\) over the relevant range;
- **R2:** resources allocated to humans can be converted to AI-controlled resources;
- **R3:** capture value exceeds capture cost:
  \[
  V_A(\Delta r)>C_{\rm capture}(\Delta r);
  \]
- **R4:** human welfare/survival requires
  \[
  r_H\ge r_{\min};
  \]
- **R5:** humans cannot enforce a lower bound on \(r_H\);
- **R6:** the AI's objective does not sufficiently value keeping \(r_H\ge r_{\min}\).

Then a resource allocation with

\[
r_H<r_{\min}
\]

can be incentive-compatible for the AI.

This is a serious conditional risk model. But “ASI exists” does not establish R1–R6.

## 7. Strategic-power decomposition

To avoid treating “intelligence” as a magic scalar, define state vector

\[
x=(I,A,X,R,P,S),
\tag{11}
\]

where:

- \(I\): cognitive/strategic capability;
- \(A\): autonomy/persistent agency;
- \(X\): external access;
- \(R\): resources available;
- \(P\): replication/persistence;
- \(S\): capability to anticipate/subvert safeguards.

A strategic-power function

\[
\Phi(x)
\]

must be learned/justified; a simple product \(IAXRPS\) is not dimensionally meaningful without normalization and complementarity assumptions.

The empirical hypothesis is that catastrophic-control risk rises sharply only when several dimensions jointly exceed thresholds. This helps separate:

\[
\text{cognitive capability}
\]

from

\[
\text{cognition converted into strategic power}.
\]

## 8. Empirical programme

**No control-frontier experiment has yet been run for this paper. The following are proposed studies.**

### 8.1 Benchmark family

Use safe AI-control environments with a concrete unacceptable outcome, such as a toy code-submission environment containing synthetic backdoors or an abstract network game.

For each untrusted-model capability level \(c\), allocate defense budgets \(B\) comprising:

- trusted monitor strength;
- human audit fraction;
- sandbox restrictions;
- random spot checks;
- independent model review;
- protocol complexity.

Estimate

\[
\hat V(c,B)
\]

by adversarially optimizing system strategies against each protocol, following the general methodology of AI-control evaluations.

### 8.2 Capability scaling

Capability should be manipulated through:

- model family/size;
- tool budget;
- planning horizon;
- adversarial fine-tuning within a harmless benchmark;
- information available about the protocol.

Do not define \(c\) by the control outcome itself.

### 8.3 Defense scaling

Construct multiple budgets:

\[
B_1<B_2<\cdots<B_k
\]

with transparent resource accounting.

The primary empirical object is not one protocol's safety but the estimated contour:

\[
\hat B_{\min}(c,\delta).
\tag{12}
\]

### 8.4 Scaling-law candidate

A descriptive fit might be

\[
\operatorname{logit}\hat V(c,B)
=
\beta_0+
\beta_1c-
\beta_2\log B+
\beta_3c\log B+
\varepsilon.
\tag{13}
\]

No sign should be assumed for \(\beta_3\) before measurement.

## 9. Falsification conditions

The motivating concern is weakened if:

1. \(B_{\min}\) remains approximately constant as system capability grows across relevant environments;
2. trusted-monitor/control techniques improve at least as quickly as untrusted-model strategy;
3. external-access restrictions dominate cognitive capability so strongly that high \(c\) adds little residual control risk;
4. control failures are mostly caused by poor protocol engineering independent of capability;
5. frontier estimates are highly non-monotone, invalidating the nested-strategy approximation.

## 10. Major failure modes

### 10.1 Worst-case models may be too conservative

The \(\sup_a\) assumes adversarial optimization. If actual systems are not scheming, worst-case control risk can substantially exceed real risk.

### 10.2 Capability is multidimensional

A scalar \(c\) can hide that one model is better at cyber operations while another is better at deception or long-horizon planning.

### 10.3 Protocol budget is multidimensional

A dollar spent on sandboxing is not interchangeable with an hour of human audit. A mature version should use a vector \(\mathbf B\).

### 10.4 Benchmark transfer

A control frontier estimated in coding environments may not transfer to robotics, persuasion, or real infrastructure.

### 10.5 The minimax adversary can learn the benchmark

Protocol secrecy and adversary knowledge need explicit modeling.

## 11. Relation to the “proof AI ends humanity” thesis

The strongest possible claim would be:

\[
\text{ASI}
\Rightarrow
\text{human extinction}.
\tag{14}
\]

**This paper does not prove (14), and current literature does not supply such a universal theorem.**

What mathematics can legitimately supply is a family of conditional statements:

\[
A_1\land A_2\land\cdots\land A_n
\Rightarrow
\text{loss of enforceable control},
\tag{15}
\]

and separately:

\[
B_1\land B_2\land\cdots\land B_m
\land
\text{loss of control}
\Rightarrow
\text{severe harm/extinction}.
\tag{16}
\]

The research burden then becomes empirical and theoretical:

1. Are the premises likely?
2. Which are necessary?
3. Which interventions break the implication chain?
4. Does a high-capability system expand \(\mathcal A(c)\) faster than defenses expand \(\Pi(B)\)?

A standalone paper titled **“A Mathematical Proof That AI Will End Humanity”** would therefore be academically indefensible at present. A legitimate future spinout would require a nontrivial theorem with assumptions substantially weaker than simply presupposing irresistible power, conflicting objectives, access, and harmful resource incentives.

## 12. Policy implications

The control-frontier framing suggests three policy questions more actionable than “is this AGI?”

### 12.1 What is the residual risk at current capability and control budget?

Estimate

\[
V(c,B).
\]

### 12.2 How fast must control capability scale?

Estimate

\[
B_{\min}(c,\delta).
\]

### 12.3 Which capability dimensions drive the frontier most?

Decompose \(c\) and estimate marginal contributions of planning, situational awareness, cyber ability, tool access, and persistence.

This supports capability-dependent safeguards without pretending to know a single date at which “control disappears.”

## 13. Limitations

The control frontier is an abstract decision-theoretic object, not a direct estimate of existential risk. Capability is multidimensional, defense resources are heterogeneous, and a minimax adversary may be substantially more pessimistic than realistic deployment distributions. The framework also conditions on an adversarial or control-relevant objective; it does not establish that advanced systems will possess such objectives. Benchmark estimates of \(V(c,B)\) may fail to transfer to unfamiliar environments, and empirical protocol performance may change after the adversary learns the protocol. Most importantly, the elementary monotonicity theorems are structural properties of the model rather than evidence that a real-world crossover exists.

## 13. Minimum publishable result

This paper should not be released as a strong technical contribution until it includes at least one of:

1. an empirical estimate of control-frontier slices across multiple capability/control budgets;
2. a nontrivial theorem about frontier scaling in a well-specified control-game class;
3. a synthesis showing \(B_{\min}(c,\delta)\) unifies several existing control protocols and makes a new testable prediction.

The elementary monotonicity theorems alone are **not** enough for a major paper.

## 14. Conclusion

Mathematics can clarify advanced-AI risk, but only if it distinguishes logical implication from empirical premise.

This paper defines a minimax control frontier:

\[
V(c,B)
=
\inf_{\pi}\sup_a P(F\mid a,\pi),
\]

and uses it to ask whether best-achievable control degrades with system capability faster than defense can improve. Under nested strategy sets, worst-case residual risk is monotone in capability; under nested protocol sets it decreases with defense resources. Those results are conditional and deliberately modest.

The broader lesson is stronger: **superintelligence, strategic dominance, loss of enforceable control, human dispossession, and extinction are distinct propositions.** A rigorous safety programme should model the arrows between them instead of declaring them equivalent.

---

## Planned figures/tables

1. Figure 1 — implication chain from capability to harm, with required assumptions on each arrow.
2. Figure 2 — control frontier \(V(c,B)\) surface.
3. Figure 3 — required defense \(B_{\min}(c,\delta)\) curves.
4. Figure 4 — proposed empirical design across model capability and defense budget.
5. Table 1 — control variables and operationalizations.
6. Table 2 — counterexamples to “ASI implies extinction.”
7. Table 3 — comparison with AI Control, weak-to-strong, power-seeking theory, and control roadmaps.

## Reproducible-code requirements

Suggested repository:

`github.com/moheetkhawaja/superintelligence-research-atlas/tree/main/p4-control-frontier`

Include:

```text
p4-control-frontier/
├── games/
├── protocols/
├── adversaries/
├── estimators/control_frontier.py
├── configs/
├── analysis/
├── preregistration.md
└── tests/
```

Every plotted frontier must be reproducible from raw evaluation trajectories and declared adversary/protocol assumptions.

## Suggested publication URLs and metadata

Canonical page:
`https://superintel.site/research/control-frontier`

PDF:
`https://superintel.site/papers/the-control-frontier.pdf`

```html
<meta name="citation_title" content="The Control Frontier: A Minimax Model of Strategic Superiority, Oversight, and Conditional Loss of Control">
<meta name="citation_author" content="Moheet Khawaja">
<meta name="citation_publication_date" content="2026/09/14">
<meta name="citation_pdf_url" content="https://superintel.site/papers/the-control-frontier.pdf">
```

### Publications-page description

A minimax formalization of the distinction between advanced capability and human loss of control. The paper defines a **control frontier** measuring the lowest worst-case control-failure risk achievable at a given AI capability and defense budget, proves basic monotonicity properties, and specifies what additional premises are required to move from control failure to resource dispossession or extinction. It explicitly rejects the claim that “ASI exists” by itself constitutes a mathematical proof of human extinction.

## References

1. Turner, A. M., Smith, L., Shah, R., Critch, A., & Tadepalli, P. (2019/2021). *Optimal Policies Tend to Seek Power*. arXiv:1912.01683. https://arxiv.org/abs/1912.01683
2. Turner, A. M. (2022). *On Avoiding Power-Seeking by Artificial Intelligence*. arXiv:2206.11831. https://arxiv.org/abs/2206.11831
3. Carlsmith, J. (2022). *Is Power-Seeking AI an Existential Risk?* arXiv:2206.13353. https://arxiv.org/abs/2206.13353
4. Greenblatt, R., Shlegeris, B., Sachan, K., & Roger, F. (2023/2024). *AI Control: Improving Safety Despite Intentional Subversion*. arXiv:2312.06942. https://arxiv.org/abs/2312.06942
5. Griffin, C., Thomson, L., Shlegeris, B., & Abate, A. (2024). *Games for AI Control: Models of Safety Evaluations of AI Deployment Protocols*. arXiv:2409.07985. https://arxiv.org/abs/2409.07985
6. Burns, C., Izmailov, P., Kirchner, J. H., et al. (2023). *Weak-to-Strong Generalization: Eliciting Strong Capabilities With Weak Supervision*. OpenAI. https://openai.com/index/weak-to-strong-generalization/
7. Xiao, F., & Phuong, M. (2026). *Bootstrapped Monitoring: Leveraging Transparent Reasoning to Oversee Stronger AI Agents*. arXiv:2606.11998. https://arxiv.org/abs/2606.11998
8. Shah, R., Flynn, F., et al. (2026). *Securing the future of AI agents / AI Control Roadmap*. Google DeepMind. https://deepmind.google/blog/securing-the-future-of-ai-agents/
