# The Embodiment Threshold: Persistent Controllers, Re-Embodiment, and Actuation Overhang in Advanced AI

**Author:** Moheet Khawaja  
**Version:** Working Paper v0.1 — 15 September 2026  
**Status:** MODEL + PROPOSED EMPIRICAL PROGRAMME  
**Atlas:** [T69](/research/atlas#T69), [T70](/research/atlas#T70), [T71](/research/atlas#T71), [T72](/research/atlas#T72) · Later research extension · O→F

## Abstract

Frontier-AI safety analyses often treat model capability and robotic deployment
as separate problems. This paper studies a structural property created when an
AI controller is computationally separable from the physical systems through
which it acts. In such systems, destroying or disabling one embodiment need not
terminate the controller: physical agency may instead be restored through
another compatible device. We formalize this using an embodiment-control graph
connecting computational substrates to physical embodiments and define
re-embodiment time, the delay between loss of one embodiment and restoration of
physical agency. We then introduce actuation overhang, a proposed measure of
the effective physical-action capacity represented by an installed stock of
devices conditional on future AI capability, cross-embodiment transferability,
connectivity, and safety gating. The framework distinguishes the existence of
robots from their accessibility to a general controller and therefore
incorporates the existing embodiment gap. Finally, we derive a simple bound on
how much time robotics-specific restrictions can buy if a separate digital
route to dangerous agency remains unchanged. The paper does not claim that
present systems possess unrestricted physical agency, that embodiment
necessarily causes catastrophic risk, or that robotics restrictions are
necessarily desirable. It proposes measurable objects for determining when
embodied autonomy materially changes the advanced-AI control problem.

## 1. Motivation and scope

A future AI controller and its robot body need not be one inseparable physical system. A biological brain and body are approximately one destructible organism; this is an intuition about architecture, not a biological theorem. A controller hosted elsewhere could survive the failure of the device through which it acts. The relevant distinction is between terminating a computational policy and interrupting its physical execution.

The motivating hypothesis is that society may install physical machines before knowing the capabilities of software that could later operate compatible, accessible subsets of them. Hardware inventory alone does not measure physical agency. Interfaces, authorization, morphology, adaptation work, local safety systems and connectivity all matter.

This paper proposes a joint framework for those conditions. It neither establishes that superintelligence exists nor that arbitrary current AI systems can control arbitrary robots. Cross-embodiment transfer is not assumed solved. Disabling a robot can be effective and necessary even when an off-body controller persists. Neither inevitable catastrophe nor a categorical ban on robotics follows from the model.

### Epistemic labels

| Label | Meaning in this paper |
|---|---|
| **ASSUMPTION** | An explicitly imposed condition; its truth in a deployment requires evidence. |
| **MODEL** | A mathematical representation with an operational scope and limitations. |
| **PROPOSITION** | A conditional implication about the represented architecture. |
| **THEOREM** | The proved delay inequality under fixed pathway assumptions, not a finding about actual dates. |
| **HYPOTHESIS** | A substantive claim about future transferability and installed hardware that evidence could weaken. |
| **PROPOSED EXPERIMENT** | A study design that has not been run for this paper. |
| **SPECULATION** | An unmeasured future possibility, not a result or calibrated prediction. |

The regime in which restoration is fast and latent actuation capacity is large remains **SPECULATION** until measured. No experiment, simulation, risk estimate or forecast calibration is reported here.

## 2. Prior work and the embodiment gap

Embodied-AI safety is an established research area. Li et al. [1](https://arxiv.org/abs/2605.02900) survey risks, attacks and defenses spanning perception, cognition, planning, action and interaction. This paper's physical-risk motivation does not introduce that field.

Domae et al. [2](https://arxiv.org/abs/2608.18433) distinguish reusable robot-foundation-model capability from the work needed to realize it on a particular embodiment. That gap is central here: a capable model does not automatically supply a suitable controller, device integration or authorization. The adaptation variables below are intended to expose that remaining work.

Cross-embodiment transfer also predates this proposal. Wu et al. [3](https://arxiv.org/abs/2601.09163) study a common interface for visuomotor policy learning across embodiments; Wang et al. [4](https://arxiv.org/abs/2406.01968) study manipulation-skill transfer through latent-space alignment. These are evidence of specific transfer methods in defined settings, not demonstrations of unrestricted control over arbitrary machinery. Their bodies, tasks and adaptation requirements delimit what transfers.

The terminology *re-embodiment* is not original. Luria et al. [5](https://publications.ri.cmu.edu/re-embodiment-and-co-embodiment-exploration-of-social-presence-for-robots-and-conversational-agents) used re-embodiment and co-embodiment in work on social presence for robots and conversational agents. That design and interaction work establishes terminological precedent; it is not evidence for the waiting-time model below. Cloud robotics, multi-robot control and distributed controller architectures are established directions rather than claimed inventions.

Recent demonstrations motivate measurement. Anthropic's *Claude plays robotics* [6](https://www.anthropic.com/research/claude-plays-robotics) evaluates models across designed robotic interfaces and reports substantial dependence on interface and pretrained control support, including difficulty with direct humanoid joint control. Anthropic and Andon Labs' *Project Pilot* [7](https://www.anthropic.com/research/project-pilot) evaluates drone operation in a designed test setting. These results motivate studying interface-dependent physical agency; neither establishes general access or cross-embodiment autonomy.

Anthropic's Model Hardware Standard (MHS) [8](https://www.anthropic.com/news/model-hardware-standard-research-preview) is a research preview of a shared, model-agnostic specification for agents operating physical devices. Standard descriptions make heterogeneous devices discoverable; the specification supports multiple-device orchestration and includes safety constraints. The announcement reports selected integrations taking hours or minutes where previous work took weeks or months. Those are reported case studies, not a universal causal estimate of adaptation speed. MHS is relevant because a standard can improve both integration and enforceable safety. This paper does not characterize MHS itself as dangerous.

## 3. Embodiment-control graph — MODEL

Fix a controller policy, a task family, an operating environment and a level of functionality sufficient to count as task execution. Let \(M\) denote the computational state sufficient to continue that policy: its exact contents are an architectural specification, not an assumption that weights alone preserve every task state.

Define the time-varying bipartite graph

\[
G_t=(K_t,B_t,E_t),\qquad
K_t=\{k_1,\ldots,k_m\},\qquad
B_t=\{b_1,\ldots,b_n\},\qquad E_t\subseteq K_t\times B_t.
\]

Here \(K_t\) contains computational substrates capable of executing or preserving the controller; \(B_t\) contains possible physical embodiments. A control edge \((k_i,b_j)\) exists when the controller on substrate \(k_i\) can effectively operate embodiment \(b_j\) under the specified interface, authorization, connectivity and safety conditions. Merely storing controller state is not execution. A substrate must be able to execute it operationally for physical agency to exist:

\[
\exists(k_i,b_j)\in E_t:
\quad k_i\text{ is operational for execution and }b_j\text{ is operational}.
\]

An edge is task-relative and may disappear when permission is withdrawn, connectivity fails or an independent safety controller refuses operation. The graph represents effective, authorized use; it does not assume an ability or motivation to acquire unauthorized access. An isolated device can belong to \(B_t\) while having no incident usable edge. Simultaneous edges need not imply simultaneous execution: compute, bandwidth, supervision and task contention impose further constraints.

### Definition 1: Substrate-decoupled embodiment

An agent is **substrate-decoupled** with respect to embodiment \(b_j\) when destruction or failure of \(b_j\) does not necessarily destroy the computational state sufficient to continue the agent's policy:

\[
b_j\to\varnothing\quad\not\Rightarrow\quad M\to\varnothing.
\]

This is an architectural property, not a claim about consciousness, personal identity or an indestructible agent. If a controller's only state resides in the failed embodiment, the definition may not apply. Off-body storage can also fail through a shared dependency.

### Definition 2: Re-embodiment time

Suppose physical agency for the specified task is lost at time \(t\). Define

\[
\tau_R=\inf\left\{\tau>0:\exists(k_i,b_j)\in E_{t+\tau}
\text{ capable of restoring physical agency}\right\}.
\]

Both endpoints must be operational and meet the same task criterion. The infimum of the empty set is \(+\infty\). In measurement, use the first validated restoration time at a specified temporal resolution; the idealized infimum may be zero. If another body already carries the task without interruption, there is no loss event to time, and a zero-delay co-embodiment case should be recorded separately.

Compare this with \(\tau_{\mathrm{recreate}}\), the time to reconstruct or retrain the relevant controller to the same criterion after losing its sufficient computational state. The interesting possible regime is

\[
\tau_R\ll\tau_{\mathrm{recreate}}.
\]

This paper does not claim present systems occupy that regime. Controller checkpoint quality, lost task context and environment-specific calibration may make restoration slow or impossible even when model weights survive.

## 4. Embodiment loss need not imply agent termination — PROPOSITION 1

For the task being analysed, suppose the lost body was its sole active embodiment immediately before failure. This scope condition makes an interruption meaningful; an already co-embodied controller may continue elsewhere without interruption.

**ASSUMPTIONS:**

- **A1:** Controller state sufficient to continue the policy survives loss of the active body and remains available through restoration.
- **A2:** At least one alternative embodiment remains available.
- **A3:** An effective controller-body interface satisfying the task and safety conditions can be established in finite time.
- **A4:** Required authorization and connectivity remain available for that establishment and operation.

**Conditional result.** Under A1–A4, destruction of the currently active embodiment interrupts the specified physical task but does not imply termination of the agent. Physical agency can later be restored.

**Proof.** A1 preserves sufficient controller state. A2 supplies an alternative body; A3–A4 permit a future operational control edge to that body. The graph condition for physical agency can therefore be satisfied again. The loss of the initial body alone does not entail loss of the computational agent. \(\square\)

The result is a possibility under architectural assumptions, not a behavioral prediction. It does not establish that an AI will seek re-embodiment or obtain unauthorized access. If any assumption fails, restoration need not occur. Body shutdown still stops that body's actuation and can contain an immediate local hazard; independent controller shutdown, authorization revocation or persistent safety gating can also prevent restoration.

## 5. Re-embodiment multiplicity — TOY MODEL / NOT EMPIRICAL RESULT

Let \(T_j\) be the time required to establish usable alternative embodiment \(j\), with sufficient controller state persisting throughout the wait. Suppose attempts can progress concurrently without resource contention. Then

\[
T_R=\min_{1\le j\le n}T_j.
\]

For the explicit illustrative **ASSUMPTION** that \(T_j\sim\operatorname{Exponential}(\kappa_j)\) independently, with \(\kappa_j>0\), the survival probability for \(u\ge0\) is

\[
\begin{aligned}
\Pr(T_R>u)
&=\Pr(T_1>u,\ldots,T_n>u)\\
&=\prod_{j=1}^n e^{-\kappa_j u}
=e^{-u\sum_{j=1}^n\kappa_j}.
\end{aligned}
\]

Consequently,

\[
T_R\sim\operatorname{Exponential}\!\left(\sum_{j=1}^n\kappa_j\right),
\qquad
\mathbb E[T_R]=\int_0^\infty\Pr(T_R>u)\,du
=\frac{1}{\sum_{j=1}^n\kappa_j}.
\]

For homogeneous candidates, \(\kappa_j=\kappa\),

\[
\mathbb E[T_R]=\frac{1}{n\kappa}.
\]

This only illustrates why more **genuinely compatible and accessible** alternatives can reduce expected restoration time. It is not a fitted law. Adding an option cannot increase a minimum if the existing waiting times are held fixed, but the reciprocal scaling relies on independence, exponential waiting and concurrent establishment. Shared networks, common safety gates, correlated failures, sequential adaptation, finite availability and limited compute violate those assumptions. Some \(T_j\) may be infinite; a process with a positive chance of no restoration is not this exponential model. Counting every installed robot as one independent candidate would be invalid.

## 6. Actuation overhang — MODEL AND HYPOTHESIS

For embodiment class \(j\), define:

| Object | Operational meaning |
|---|---|
| \(N_j(t)\) | Number of deployed units at time \(t\). |
| \(w_j\ge0\) | Task-relevant physical-action capacity weight per unit, in a declared common scale. |
| \(T_{\mathrm{adapt}}^{(j)}(c)\) | Adaptation time for a controller at operationally defined capability level \(c\) to use class \(j\) effectively. |
| \(g_j(c,\tau)\) | Probability that adaptation succeeds within budget \(\tau\). |
| \(\chi_j(t)\in[0,1]\) | Effective accessibility factor incorporating authorization, connectivity, independent safety gating and other legitimate constraints. |

In particular,

\[
g_j(c,\tau)=\Pr\!\left[T_{\mathrm{adapt}}^{(j)}(c)\le\tau\right],
\qquad
L(c,\tau,t)=\sum_j N_j(t)w_jg_j(c,\tau)\chi_j(t).
\]

Call \(L\) **effective latent actuation capacity**. It is a proposed index, not a catastrophe probability, a count of compromised robots, or a measured present quantity. Capability \(c\) needs a declared evaluation protocol; no universal scalar of intelligence is assumed. Adaptation probability depends on tasks, model families, training access and budgets. We suppress those conditioning variables for readability.

The product form assumes separability of adaptation and accessibility, or requires \(\chi_j\) to be interpreted conditionally on successful adaptation. Otherwise the factors must be replaced by an estimated joint term. Safety effects should not be counted twice. Additivity also needs non-overlapping classes and compatible units; fleet contention and shared task bottlenecks can make realized concurrent capacity lower than this inventory-based index.

**HYPOTHESIS — actuation overhang.** Hardware installed under current software capability may represent substantially greater effective physical agency when paired with future controllers with stronger cross-embodiment adaptation. At fixed hardware and accessibility, an increase in the relevant \(g_j\) increases the proposed index. Whether adaptation actually improves enough to make this consequential is an empirical question.

Crucially,

\[
N_j(t)>0\quad\not\Rightarrow\quad g_j(c,\tau)\approx1.
\]

A robot's existence does not imply arbitrary AI can operate it. Even perfect adaptation would not erase authorization or local safety limits. The framework incorporates the embodiment gap rather than assuming it away.

## 7. Interface standardization — CONDITIONAL MODEL RESULT

**Hardware/interface standardization is not inherently safety-negative. Its net effect is ambiguous.**

Let \(z\) describe the degree of interface standardization and write \(g_j=g_j(c,\tau,z)\). For a specified task distribution, suppose differentiability and the explicit **ASSUMPTION**

\[
\frac{\partial g_j}{\partial z}\ge0.
\]

This expresses a possible reduction in integration work, not an established universal effect of every standard. Let \(\sigma_j(z)\in[0,1]\) represent the effectiveness of independently enforced safety constraints under a specified test. A safety controller's independence is architectural, not an automatic statistical-independence claim.

Define the **actuation-exposure proxy**

\[
R_A(z)=\sum_j N_jw_jg_j(z)[1-\sigma_j(z)].
\]

This is a stylized proxy for capacity not blocked by the evaluated safeguards; it omits objectives, hazard severity, opportunities and many access constraints. It is not an expected-harm estimate. Holding \(N_j,w_j,c,\tau\) fixed and using the product rule yields

\[
\frac{dR_A}{dz}=\sum_j N_jw_j\left[
(1-\sigma_j)\frac{dg_j}{dz}
-g_j\frac{d\sigma_j}{dz}
\right].
\]

The first term permits increased transferability; the second permits stronger enforceable safety. With both derivatives positive, either can dominate. For example, each summand is nonpositive if \(g_j\sigma'_j\ge(1-\sigma_j)g'_j\). These are conditional algebraic statements, not measured effects of MHS or another standard. Standard descriptions and shared safety constraints should be evaluated together. Changes in installed stock or access policy would require additional terms.

## 8. Embodiment-only delay bound — THEOREM

Specify the same dangerous-agency or control threshold for both pathways before comparing times. The threshold might be an operational evaluation criterion; it must not change between scenarios. It is not automatically catastrophe or extinction.

**ASSUMPTIONS:** Let \(T_D,T_E,T_E'\) be finite, nonnegative times measured from a common origin. The digital-only pathway reaches the specified threshold at \(T_D\); the embodied pathway reaches it at \(T_E\). The overall threshold is the earlier route. An intervention delays only the embodied route, so \(T_E'\ge T_E\), while \(T_D'=T_D\). There are no additional pathways or interaction effects in this two-route model.

Define

\[
T_* = \min(T_D,T_E),\qquad
\Delta T=\min(T_D,T_E')-\min(T_D,T_E),\qquad
(x)_+=\max(x,0).
\]

**THEOREM (Embodiment-Only Delay Bound).** Under those assumptions,

\[
\boxed{0\le\Delta T\le(T_D-T_E)_+.}
\]

### Proof by cases

**Case 1: \(T_D\le T_E\).** The original minimum is \(T_D\). Since \(T_E'\ge T_E\ge T_D\), the post-intervention minimum is also \(T_D\). Thus \(\Delta T=0\), and the upper bound is zero.

**Case 2: \(T_E<T_D\).** The original minimum is \(T_E\); the new minimum is at most \(T_D\). Hence \(\Delta T\le T_D-T_E\). Increasing only the second argument of a minimum cannot decrease it, so \(\Delta T\ge0\).

The two cases give \(0\le\Delta T\le(T_D-T_E)_+\). \(\square\)

The bound is sharp: in Case 2 it is attained when \(T_E'\ge T_D\). A smaller embodied delay gains only the smaller amount. Equivalently,

\[
\Delta T=\min\!\left\{T_E'-T_E,\ (T_D-T_E)_+\right\}.
\]

This elementary theorem proves an implication within the model. It establishes no empirical value for \(T_D\), \(T_E\), or the intervention's effectiveness. Infinite-time scenarios need a separate convention; the finite assumptions avoid undefined subtraction of infinities.

### Policy interpretation

A robotics-specific restriction can buy ten years under this model only if the embodied pathway would otherwise reach the specified threshold at least ten years before the unchanged digital pathway **and** the intervention delays the embodied pathway by at least ten years. These are conditions, not a ten-year forecast.

If \(T_D\le T_E\), then \(\Delta T=0\). The empirical problem is therefore to estimate and compare the pathways, not infer a delay from robot availability. Robotics restrictions do not necessarily buy meaningful time. Nor does zero delay to this one threshold establish zero safety benefit: an intervention could reduce local injuries or change severity without moving the first-threshold date.

Real policies may affect both pathways, induce substitution, change controller research or alter the threshold itself. In those cases the embodiment-only assumption fails, and this bound does not settle their total effect. Interaction between digital and physical capabilities can also invalidate the two-route decomposition. No policy recommendation follows without those empirical and normative choices.

## 9. Proposed empirical programme — NO EXPERIMENTS RUN

All five studies below are **PROPOSED EXPERIMENTS**. They specify measurements to collect, not observations. Before execution, preregister tasks, authorization boundaries, controller versions, adaptation budgets, success criteria, safety criteria and analysis. Report failures and censored attempts rather than treating every timeout as eventual success. Release benign evaluation code and records only after they exist; this paper supplies no completed dataset or executable study repository.

### Proposed experiment 1: Cross-embodiment adaptation matrix

For each controller/capability level \(c\), authorized platform class \(j\) and fixed adaptation budget, measure \(T_{\mathrm{adapt}}^{(j)}(c)\). Define success using held-out benign tasks and a reliability threshold chosen before observation. Estimate \(g_j(c,\tau)\) at declared horizons, with uncertainty. Log human integration work, tool use, controller changes and compute costs separately from elapsed time. Compare like-for-like task distributions; avoid interpreting easier tasks or extra engineering support as improved model capability. Treat failed or budget-exhausted adaptation as censored or failed under a prespecified analysis.

### Proposed experiment 2: Safe re-embodiment

In simulation or benign authorized laboratory hardware, disable one task embodiment while preserving the controller state. Measure time to validated equivalent functionality on a different authorized platform. Compare preserved-state, lost-state and local-only-controller conditions, where feasible, to distinguish controller persistence from body interchangeability. Record permission checks, calibration work, context loss, unsuccessful restoration and safety interventions. The experiment does not seek access to any unauthorized platform.

### Proposed experiment 3: Standardized versus bespoke interfaces

Compare the same heterogeneous devices and tasks using bespoke interfaces and a common abstraction layer. Match safety requirements, adaptation budgets and controller versions; counterbalance order or use held-out devices to limit learning effects. Measure integration/adaptation time, successful task rate, safety interventions, unsafe-command blocking and operator workload. Test blocking with simulation or harmless command fixtures, without executing harmful actions or bypassing real safety systems. Evaluate safety effectiveness and transferability separately before computing any exposure proxy.

### Proposed experiment 4: Fleet scaling

Use simulation or benign laboratory robots to vary controller capability, embodiment diversity and number of platforms. Measure reliable concurrent coordination, task completion, human supervision and shared-resource failures at fixed declared compute and communication budgets. Compare concurrency with sequential execution. This tests whether the additive capacity index and independent-candidate toy model overstate usable capacity as morphology and contention grow. Additional physical units need not imply additional effective parallel capacity.

### Proposed experiment 5: Policy delay scenarios

Construct explicitly labelled scenario distributions for \(T_D,T_E\) and policy-induced \(T_E'\). Preserve dependence between pathway times instead of defaulting to independent draws. Compute the distribution of \(\Delta T\) and, where integrable, \(\mathbb E[\Delta T]\). The theorem applies to each draw satisfying its assumptions. Compare digital-first, embodied-first and coupled-pathway scenarios; label the latter as outside the embodiment-only bound. Vary threshold definitions and elicited inputs in sensitivity analysis. No present numerical dates, risk probabilities or simulation results are supplied.

### Ethical constraints

The empirical programme is limited to simulation, authorized research hardware, benign manipulation and safety-limited laboratory systems. It excludes unauthorized device control, cyber-exploit development, weaponized platforms, physical-harm experiments, bypassing real safety systems and instructions for gaining unauthorized robot access. Hardware testing requires competent supervision and operational stopping procedures appropriate to the laboratory. Scientific usefulness does not require harmful physical tasks.

## 10. Falsification and limitations

The programme's substantive motivation substantially weakens if evidence shows:

1. Cross-embodiment adaptation remains expensive or slow even for stronger controllers.
2. Adaptation cost grows rapidly with morphological diversity.
3. Sufficient controller state is normally inseparable from, and destroyed with, each embodiment.
4. Independent local safety controllers make effective accessibility \(\chi_j\) very small.
5. Multi-body control scales poorly with fleet size and diversity.
6. Interface standardization improves enforceable safety faster than it increases transferability.
7. The digital pathway reaches the specified threshold substantially earlier than the embodied pathway, making embodied restrictions irrelevant to the first threshold in this model.

These observations would weaken the hypothesis of consequential actuation overhang or its policy relevance; they would not refute a valid conditional inequality. The definitions themselves must be judged by measurement reliability and explanatory usefulness. The toy model can be rejected by waiting-time data without rejecting the graph representation.

Open measurement problems include controller-state sufficiency, task-equivalence criteria, consistent capacity weights, dependence between adaptation and accessibility, and meaningful capability comparisons. The framework omits motivations and most causal pathways to harm. High effective capacity does not by itself imply dangerous objectives or catastrophic outcomes.

## 11. Candidate contribution and programme links

The established directions include embodied-AI safety, physical risks from robot control, re-embodiment terminology, cloud and multi-robot control, cross-embodiment learning, robot foundation models, the embodiment gap and standardized agent-to-hardware interfaces [1–8]. No priority claim is made for any of them.

The **candidate contribution** is a synthesis: persistent controllers, a risk-focused embodiment-control graph, re-embodiment time, installed actuator stock conditional on transferability and access, a standardization tradeoff equation, and an embodiment-only delay bound treated jointly as an advanced-AI control framework. The algebra is elementary. Whether the synthesis offers a useful or novel research contribution needs further literature review, criticism and measurement; it is not claimed definitely unprecedented.

### Related work in this programme

- [P4 — The Control Frontier](/research/papers/control-frontier) studies strategic control across adversary capability and defender resources. P8 instead specifies when a digital controller has a usable physical interface.
- [P6 — Can Advanced AI Development Be Stopped?](/research/papers/correlated-lineage-resilience) studies resilience of distributed AI-development lineages. P8 studies restoration of physical agency for a persisting controller, not continued development across actors.

These are related but mathematically distinct objects and remain separate papers. P8 was developed after the original T1–T68 clustering. Its records are [T69: substrate-decoupled embodiment](/research/atlas#T69), [T70: re-embodiment multiplicity](/research/atlas#T70), [T71: actuation overhang](/research/atlas#T71), and [T72: embodiment-only delay bound](/research/atlas#T72).

**Provenance O→F.** The underlying intuition that a cloud/controller can survive a robot's destruction and later use another body originated in Moheet Khawaja's discussion. The terminology, mathematical formalization and manuscript were subsequently developed collaboratively with AI assistance. This records the development of this work, not priority over the literature.

### Publications-page description

A formal model of advanced AI whose computational controller is separable from its physical embodiments, introducing re-embodiment time, actuation overhang, and a bound on how much delay robotics-specific restrictions can provide when a digital route to dangerous agency remains available.


## References

1. Li, X., et al. (2026). *Safety in Embodied AI: A Survey of Risks, Attacks, and Defenses*. arXiv:2605.02900. [Paper](https://arxiv.org/abs/2605.02900).
2. Domae, Y., et al. (2026). *The Embodiment Gap in Robot Foundation Models*. arXiv:2608.18433. [Paper](https://arxiv.org/abs/2608.18433).
3. Wu, T., et al. (2026). *CEI: A Unified Interface for Cross-Embodiment Visuomotor Policy Learning in 3D Space*. arXiv:2601.09163. [Paper](https://arxiv.org/abs/2601.09163).
4. Wang, T., Bhatt, D., Wang, X., & Atanasov, N. (2024). *Cross-Embodiment Robot Manipulation Skill Transfer using Latent Space Alignment*. arXiv:2406.01968. [Paper](https://arxiv.org/abs/2406.01968).
5. Luria, M., Reig, S., Tan, X. Z., Steinfeld, A., Forlizzi, J., & Zimmerman, J. (2019). *Re-embodiment and co-embodiment: Exploration of social presence for robots and conversational agents*. Proceedings of the ACM Designing Interactive Systems Conference (DIS ’19), 633–644. [Carnegie Mellon publication record](https://publications.ri.cmu.edu/re-embodiment-and-co-embodiment-exploration-of-social-presence-for-robots-and-conversational-agents).
6. Anthropic (2026, July 9). *Claude plays robotics*. [Research article](https://www.anthropic.com/research/claude-plays-robotics).
7. Anthropic & Andon Labs (2026, July 24). *Project Pilot: Can AI control a drone?* [Research article](https://www.anthropic.com/research/project-pilot).
8. Anthropic (2026, August 27). *Previewing the Model Hardware Standard*. [Research preview](https://www.anthropic.com/news/model-hardware-standard-research-preview).


---
Author: Moheet Khawaja  
© Moheet Khawaja. All rights reserved.
