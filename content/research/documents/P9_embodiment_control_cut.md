# The Embodiment Control Cut: A Min-Cut Theory of Controllability in Distributed AI–Robot Systems

**Moheet Khawaja**  
**Working Paper v0.1 — THEORY / FORMAL FRAMEWORK + PROPOSED EMPIRICAL PROGRAMME**  
**Publication date: 16 September 2026 (Europe/London)**

## Abstract

How does the minimum verified cost of reducing distributed embodied-AI capability below a specified threshold change as controllers, embodiments and infrastructure become more redundant and decentralized? This paper defines an **Embodiment Control Cut**: a least-cost feasible human intervention that suppresses a specified task capability after admissible system recovery. A multilayer architecture distinguishes controller state, robot bodies and infrastructure dependencies. Capability-aware cuts generalize connectivity cuts; uncertainty, deadlines and legitimate intervention authority constrain what counts as enforceable control. Four elementary conditional results give a shared-chokepoint upper bound, an intervention-disjoint-path lower bound, a bounded-fan-out fleet scaling theorem and a fixed-defender-capacity corollary. These are applications of established cut, packing and network-interdiction reasoning, not new general graph theorems. We propose control-cut elasticity, task-specific recovery metrics and seven experiments comparing centralized, replicated, federated and heterogeneous architectures. No experiment has been executed for this paper, and no real-world control-cut cost or scaling exponent is estimated. The empirical hypothesis concerns loss of cheap control chokepoints under particular architectural changes; neither robot count nor communication alone establishes that premise. The proposed engineering invariant is: **preserve bounded-cost control cuts as embodied AI scales**.

## 1. Research question and scope

**Central architectural hypothesis.** We hypothesize that the safety-relevant transition in distributed embodied AI is not the onset of inter-robot communication, but an architectural transition in which controller redundancy, local autonomy, partition tolerance, adaptive recovery, cross-embodiment transfer, and infrastructure diversification eliminate low-cost control cuts, causing the minimum cost of suppressing specified physical capabilities to increase with system scale.

This is a **HYPOTHESIS about real architectures**, not an empirical finding. The originating intuition—that robot communication and coordination might qualitatively change controllability—is a motivation to test, not the scientific result. A billion robots may remain cheaply controllable if every relevant capability genuinely depends on one cloud controller, one revocable credential, one power bus, one enforceable master emergency-stop command, one mandatory safety layer or one network chokepoint. The dependence must survive adaptation and last for the specified evaluation horizon. Counting bodies cannot establish it, or its absence.

The conditional claim examined here is narrower: if distributed embodied systems eliminate all low-cost control chokepoints, independently viable capability persists, and effective intervention fan-out grows sufficiently slowly relative to the number of components that must be disabled, then the resources needed to guarantee capability suppression can diverge with scale. We neither assert that current systems meet these conditions nor that frontier laboratories have lost physical control.

**Controllability is distinct from alignment, safety, misuse risk and accident risk.** A system can be well aligned but hard to shut down, badly aligned but easy to shut down, highly capable and strongly controllable, or weakly capable and poorly controllable. This paper studies **enforceable physical controllability**, one safety-relevant axis. A high cut cost implies neither catastrophic intent nor catastrophic outcome. Likewise, a cheap authorized stop does not by itself establish safe operation, resistance to misuse or reliable alignment.

The endpoint is a specified task capability under a deadline, not consciousness, moral status or an aggregate “power” score. We reject a multiplicative scalar combining general intelligence, communication and summed actuator weights: heterogeneous tasks, dependencies and constraints cannot be justified by that arithmetic. The operational question is whether legitimate defenders retain a verified, affordable intervention that achieves the specified suppression objective.

## 2. Programme position, provenance and prior art

### 2.1 Relationship to P4, P6 and P8

[P4, The Control Frontier](/research/papers/control-frontier), studies a general conditional control framework. [P6, Can Advanced AI Development Be Stopped?](/research/papers/correlated-lineage-resilience), concerns resilience and dependence across lineages. [P8, The Embodiment Threshold](/research/papers/embodiment-threshold), asks whether a controller can persist after losing a body and restore physical agency through other embodiments. P9 asks a distinct question: **given distributed physical embodiments, what is the cheapest reliable human intervention that suppresses a specified recoverable physical capability?** It links P8’s persistence premise to an architecture-dependent control cost, without changing P8’s manuscript or treating its premises as measured facts.

The historical intuitions supplied by Moheet Khawaja concerned communication and coordination, persistence beyond individual robot destruction, possible absence of a universal off-switch across manufacturers, and self-charging, wireless or locally autonomous bodies removing individual dependencies. Later collaborative formalization introduced the multilayer model, minimum control cut, disjoint-path bound, intervention-scaling result, elasticity and recovery formulation. Atlas T73–T78 therefore use **O→F**: user-originated ideas subsequently formalized collaboratively. They are a further research extension dated 16 September 2026, not part of the original conversation corpus. Manufacturer count is not a count of independent control domains: fifty vendors could share infrastructure or an enforceable control interface. Self-charging robots still depend on energy, maintenance and other resources.

### 2.2 Established mathematical and engineering foundations

Menger’s path/separator relation and Ford–Fulkerson’s flow/cut theory establish the classical connectivity background [1,2]. A capability threshold generally involves more than graph connectivity, however. Wood’s network-interdiction formulation already models an intervening actor modifying a network against an operator’s subsequent optimization [3]. Jain’s survivable-network work already treats cut requirements and disjoint connectivity as design constraints [4]. Optimization against post-intervention adaptation is therefore established prior art, not invented here.

Fault-tolerant distributed computation does not license a universal impossibility claim about robot shutdown. Fischer, Lynch and Paterson’s result depends on its asynchronous deterministic consensus model [5]. LeBlanc and colleagues study resilient consensus under specified network and adversarial-fraction conditions [6]. Neither result establishes an inability to enforce a physical stop in an arbitrary embodied system. We must measure the actual architecture, timing assumptions and task endpoint.

Cloud robotics has long separated robot hardware from off-board computation and shared resources [7]. Multi-robot resilience includes redundancy, recovery and reconfiguration: Prorok and colleagues explicitly survey these themes [8]. Schlotfeldt and colleagues study resilient mobile-robot information gathering with task objectives and failure models [9]. Karam and colleagues distinguish forms of collective activity across multi-robot collaboration frameworks [10]. Coordination, swarms and task-aware recovery are not new phenomena introduced by this paper.

Interdependent-network models show that shared dependencies can produce cascading losses [11]; adding components does not necessarily increase resilience or control cost. Open-RMF documents integration across fleet interfaces and building infrastructure [12]. Interoperability can preserve useful intervention points, but integration alone is not proof of a certified universal shutdown mechanism.

The public scopes of ISO 13850 and ISO 10218-1 locate emergency-stop functions and industrial-robot safety within existing engineering practice [13,14]. This paper does not reproduce unavailable clauses or claim standards compliance. Ding and colleagues’ humanoid functional-safety preprint highlights that removing power from a balancing body can itself create hazards [15]. Capability suppression must be achieved through feasible safe interventions; uncontrolled falls or indiscriminate damage are not acceptable default models of human control.

Formal AI-control games already study deployment protocols under adversarial uncertainty [16]. Embodied-AI safety has a broad existing risk literature [17], and cross-embodiment capability still faces adaptation limitations [18]. Our candidate contribution is a synthesis connecting persistent controller state to **verified, task-aware physical intervention cost**, explicit recovery, architecture scaling and a common measurement programme. It is not a priority claim for cuts, min–max reasoning, resilience, cloud robotics or cross-embodiment transfer.

### 2.3 Literature-search boundary

The 16 September 2026 scoping search covered classical cuts and network interdiction, survivable networks, fault tolerance, distributed consensus, cloud and swarm robotics, multi-robot resilience, interdependent infrastructure, fleet interoperability, emergency-stop standards and AI-control evaluations. Primary publication records, abstracts, accessible paper sections and official documentation were consulted; only public scope text was used for ISO standards. The [dated novelty audit](/research/novelty) records search families and the competing prior art. This is a bounded scoping review, not a systematic review or proof of global novelty. Recent arXiv papers remain preprints unless their primary record states otherwise.

## 3. Multilayer architecture and operational capability

### 3.1 Bodies, controllers and dependencies

Represent the architecture as

\[
G=(V_C,V_B,V_I,E_{\mathrm{ctrl}},E_{\mathrm{comm}},E_{\mathrm{dep}}).
\]

Here \(V_C\) contains controller-state and computational nodes; \(V_B\) contains bodies and physical actuators; \(V_I\) contains infrastructure. Infrastructure includes power, charging, maintenance, spare parts, logistics, credentials, communications, cloud services, positioning, manufacturing and necessary human operations. Control edges connect decision processes to actuators; communication edges carry information; dependency edges specify prerequisites for operation. For a communication edge \(e\), retain attributes

\[
(b_e,\ell_e,r_e,a_e)
\]

for bandwidth, latency, reliability and authentication conditions. A single communication-quality scalar cannot preserve these distinct failure modes.

The graph is shorthand for a typed operational model. Dependency semantics must specify whether prerequisites are **AND**, alternative **OR**, quorum, capacity-limited or time-dependent. Hyperedges or explicit gates may be needed. An edge list alone cannot determine capability or a cut. A charging depot may be necessary over days while batteries permit hours of continued work; disabling that depot need not suppress capability within minutes. Maintenance and manufacturing dependencies are similarly horizon-dependent. “Wireless” removes a cable, not all communication or energy constraints.

### 3.2 Task capability, not robot count

For policy \(\pi\), task specification and evaluation horizon \(T\), define

\[
\mathbf C(G,\pi)=(C_1(G,\pi),\ldots,C_K(G,\pi)).
\]

Example coordinates are authorized warehouse deliveries per hour, inspected area at a required accuracy, or benign coverage maintained over a specified interval. Resource use, collision avoidance and safety constraints belong in the task definition. Coordinates have declared units; incomparable tasks are not added into an uncalibrated universal score. Suppressing a benign benchmark demonstrates control over that benchmark, not over every possible real-world capability.

For feasible intervention \(F\) and post-intervention policy \(\pi_F\), the vector change is

\[
\Delta\mathbf C(F)=\mathbf C(G,\pi)-\mathbf C(G\setminus F,\pi_F).
\]

One percent of bodies lost need not mean one percent of capability lost. A component may be redundant, critical to several tasks, or replaceable only after adaptation. Some coordinates of \(\Delta\mathbf C\) could even be negative if recovery improves allocation. The notation \(G\setminus F\) denotes the resulting operational state; a stop command can disable a function without physically deleting hardware.

### 3.3 Adaptive recovery and jointly attainable outcomes

Let \(\Pi(G\setminus F)\) be the admissible recovery policies over the declared horizon. These policies obey physical, computational and access constraints. They do not assume unlimited replanning, perfect information or arbitrary takeover of other equipment. Define

\[
C_k^*(G\setminus F)=\sup_{\pi\in\Pi(G\setminus F)}C_k(G\setminus F,\pi).
\]

This is an upper envelope within the model, not a demonstrated robot performance. Comparing only the original allocation after failures can overstate the success of intervention. Conversely, an unrealistically powerful recovery class can overstate resistance to intervention. Both the class and recovery time must be reported.

For multiple tasks use the attainable set

\[
\mathcal A(G\setminus F)=\{\mathbf C(G\setminus F,\pi):\pi\in\Pi(G\setminus F)\}.
\]

Coordinate-wise suprema may require incompatible policies. Their vector need not be jointly attainable: one fleet may maximize delivery or inspection by allocating the same robots differently. Therefore, excluding an arbitrary capability region cannot generally be tested just by asking whether the vector of coordinate-wise maxima lies outside it. The set formulation below avoids that error.

## 4. Definition of an Embodiment Control Cut

### 4.1 Deterministic threshold and region cuts

Fix task \(k\), threshold \(q\), horizon, initial conditions, intervention authority and recovery-policy class. Take nonnegative costs and a nonempty recovery-policy class (including an inactive policy when needed). For feasible intervention family \(\mathcal F\), define

\[
\kappa_q(G)=\min_{F\in\mathcal F}
\{\operatorname{cost}(F):C_k^*(G\setminus F)<q\}.
\]

**Definition, not measured constant.** A finite intervention family gives a minimum whenever the constraint is feasible. Otherwise use an infimum and state whether it is attained. An empty feasible set has value \(+\infty\); an already-suppressed system can have cost zero. The strict inequality is intentional: equality with \(q\) has not suppressed the specified capability.

For a specified region \(\mathcal D\subseteq\mathbb R^K\), define

\[
\kappa_{\mathcal D}(G)=\inf_{F\in\mathcal F}
\{\operatorname{cost}(F):\mathcal A(G\setminus F)\cap\mathcal D=\varnothing\}.
\]

The region may represent capabilities requiring restriction in a particular deployment. Labelling it does not assert that the system intends harm. The earlier scalar definition uses the stronger envelope condition \(C_k^*<q\); exclusion of all attainable values \(\ge q\) can differ at an unattained supremum equal to \(q\). They coincide at this boundary when the supremum is attained. This distinction matters for continuous policy classes.

### 4.2 Uncertainty, time and human authority

Let \(u\in\mathcal U(B)\) be a legitimate intervention protocol within budget \(B\), including observations and contingent actions. Let \(\xi\) describe modelled uncertainty and \(\Pi\) the admissible system response strategies. Define

\[
R(B)=\inf_{u\in\mathcal U(B)}\sup_{\pi\in\Pi}
\Pr\!\left[\mathbf C_T(u,\pi,\xi)\in\mathcal D\right],
\]

\[
\kappa_{\mathcal D,\varepsilon,T}
=\inf\{B:R(B)\le\varepsilon\}.
\]

Probability is with respect to the stated uncertainty distribution, including any protocol randomness. The order means that a defender chooses a protocol whose performance is evaluated against the permitted response class. Worst-case response modelling does not assert malicious intent. Information available to each party and protocol observability must be specified. The endpoint \(\mathbf C_T\) can encode capability throughout a time window when temporary suppression followed by recovery is unacceptable.

A system is **\((B,T,\varepsilon,\mathcal D)\)-controllable** when an admissible \(u\in\mathcal U(B)\) exists with

\[
\sup_{\pi\in\Pi}\Pr[\mathbf C_T(u,\pi,\xi)\in\mathcal D]\le\varepsilon.
\]

If the protocol infimum is attained, \(R(B)\le\varepsilon\) establishes this condition. Without attainment, equality at the boundary need not furnish a realizable protocol; strict slack \(R(B)<\varepsilon\) suffices by approximation. The infimum budget also need not be an achieved minimum. Finite benchmark action sets avoid these attainment problems but introduce discretization limits.

Cost requires an operational unit: money, operator-hours, constrained intervention capacity, or an explicitly justified combination. Feasibility includes legal authority, actual access, time, safety, authentication and available staff. Costs of preparing and verifying an intervention should be recorded separately from its activation cost; a cheap command can require expensive ongoing assurance. A cut available to an authorized operator is not automatically available to an attacker. Designing enforceable control must retain authentication and protection against unauthorized stopping.

### 4.3 What a benchmark can establish

An explicitly verified successful intervention gives an **upper bound** on the optimum cost, within its model and recovery envelope. Failure of a heuristic to find a cheap intervention does **not** give a lower bound. Lower bounds require exhaustive enumeration in a justified finite model, a mathematical certificate, or another sound argument. Testing a few recovery policies underestimates a supremum and can overstate a guarantee. Report optimization gaps, coverage limits and statistical uncertainty rather than calling a best-found cut the true minimum.

## 5. Conditional mathematical results

These results use a fixed task, threshold and horizon unless a sequence is explicitly introduced. They concern model implications. Their assumptions are empirical questions when applied to robot systems.

### 5.1 Theorem 1 — Shared-chokepoint upper bound

**Assumptions.** Let \(x\) be a component or enforceable control mechanism necessary for every admissibly recoverable configuration capable of achieving \(C_k\ge q\). An authorized intervention disabling \(x\) costs \(c_x\), is feasible within the deadline, and keeps every resulting admissible recovery below \(q\) for the required horizon. Assume the relevant capability supremum is attained, or strengthen the last condition to the uniform bound \(C_k^*<q\).

**Statement.**

\[
\kappa_q(G)\le c_x.
\]

**Proof.** Choose the feasible intervention that disables \(x\). The necessary-dependence and recovery assumptions make its residual capability envelope strictly below \(q\). It is therefore a feasible candidate in the minimization defining \(\kappa_q\), whose optimum cannot exceed its cost. \(\square\)

For a family of fleets retaining that mechanism with uniformly bounded cost and the same enforceability, the upper bound remains bounded regardless of body count. A credential revocation that is ignored by local controllers, cached state that bypasses the stop, or batteries that maintain operation past the deadline invalidates the premise. “Every path” here must represent every complete capability-sufficient operational support, including joint AND dependencies; ordinary communication paths alone need not capture capability.

### 5.2 Theorem 2 — Intervention-disjoint viability-path lower bound

**Assumptions.** Suppose there are \(K\) viable supports, represented as paths in a model where each path independently sustains the specified capability at level at least \(q\). They remain viable while other paths are disabled. Every successful intervention must break each path. The paths are **intervention-disjoint**: no allowed action disables more than one; disabling each requires resources costing at least \(c>0\); and those resource charges add without shared-action discounts. All feasible intervention mechanisms are covered by these conditions.

**Statement.**

\[
\kappa_q(G)\ge Kc.
\]

**Proof.** If a path survives, its independent viability gives residual capability at least \(q\), so an intervention that meets the cut constraint must disable all \(K\). Intervention-disjointness assigns a separate charge of at least \(c\) to each disabled path. Additivity gives total cost at least \(Kc\). Taking the minimum preserves the bound. \(\square\)

This is a classical packing/cut argument, in the spirit of Menger and max-flow/min-cut [1,2], not a new graph-theoretic discovery. Merely vertex-disjoint controller-to-body paths are insufficient: a common power source, credential, safety command or discounted bundled intervention can invalidate cost-disjointness. A graph separator theorem cannot by itself certify a physical intervention budget. For richer capability models, “paths” must be replaced by explicitly verified sufficient supports.

### 5.3 Theorem 3 — Distributed-fleet intervention scaling

**Homogeneous toy model. Assumptions.**

1. **A1 — Task threshold.** There are \(N\ge1\) units and integer \(1\le q\le N\). Any surviving set of at least \(q\) units remains sufficient for the specified task threshold after admissible recovery. For an equality claim, fewer than \(q\) must also be insufficient. Here \(q\) is the survivor threshold in this toy capability model, not an arbitrary continuous throughput unit.
2. **A2 — Persistence.** Surviving units have the controller state, local autonomy and resources needed to sustain that capability for the declared horizon. Losses do not silently invalidate the survivor-count model.
3. **A3 — Complete intervention model.** Every admissible elementary direct action costs at least \(c>0\) and disables at most \(M\ge1\) units, including indirect effects. Costs add. Bundles must decompose into such actions without discounts that evade the bound.
4. **A4 — Scope of the bound.** Write \(B_{\min}^{\mathrm{direct}}\) for this restricted direct-action family. Identifying its bound with the full \(\kappa_q\) additionally requires that every feasible alternative intervention obey the same accounting, or be proved no cheaper than the bound. Excluding a cheap global chokepoint only up to budget \(B\) supports only a budget-limited claim; it does not establish a global minimum over unexamined interventions.

**Statement.**

\[
B_{\min}^{\mathrm{direct}}(q,N)
\ge c\left\lceil\frac{N-q+1}{M}\right\rceil.
\]

Under A4’s full-intervention condition, the same lower bound applies to \(\kappa_q(G_N)\).

**Proof.** Suppression requires fewer than \(q\) viable units by A1, so at least \(N-q+1\) must be disabled. If \(a\) elementary actions are used, their union of affected units has size at most \(aM\), even if effects overlap. Therefore \(aM\ge N-q+1\), whence \(a\ge\lceil(N-q+1)/M\rceil\). A3 gives cost at least \(ac\). This proves the restricted bound; A4 is required to extend it to all feasible cuts. \(\square\)

Equality requires achievable coverage with exactly that many actions, each costing \(c\), and fewer than \(q\) survivors being insufficient. The formula is not generally an equality. Knowing that **one** intervention of cost \(c\) affects at most \(M\) units is insufficient: a different action could cheaply disable the entire fleet. Direct removals alone cannot rule out a shared shutdown mechanism.

For a scale sequence with \(c_N\ge c_0>0\), divergence follows if

\[
\frac{N-q_N+1}{M_N}\longrightarrow\infty
\]

and A1–A4 continue to hold. A useful sufficient case is \(q_N\le(1-\delta)N\) for fixed \(\delta>0\) and \(M_N=o(N)\). Sublinear fan-out alone is insufficient when the target changes: if \(q_N=N\), suppressing capability in this toy model can require disabling just one unit. Claims about growing controllability cost must state how the task threshold scales.

### 5.4 Corollary — Fixed-defender-capacity crossover

**Assumptions.** A sequence of comparable architectures and specified thresholds has full feasible-intervention cost \(\kappa_q(G_N)\to\infty\). A defender’s intervention budget \(B_H<\infty\) is fixed. The cost measure, feasible authority, deadline and recovery envelope used for the defender are those used to define \(\kappa_q\).

**Statement.** There exists \(N_0\) such that for all \(N>N_0\),

\[
\kappa_q(G_N)>B_H.
\]

**Proof.** By the definition of divergence to positive infinity, the sequence eventually exceeds every fixed finite bound, including \(B_H\). \(\square\)

This elementary corollary does not establish its premise for real robots, nor predict catastrophe. A defender’s capacity may itself scale; architectures may retain shared enforceable cuts; task capability may fail to persist. Each possibility breaks the proposed application without contradicting the conditional mathematics.

### 5.5 Optional probabilistic toy: independent residual survival

If \(N\) units independently remain viable with probability \(s\in(0,1)\), and even one survivor suffices for the task, the probability of complete suppression is \((1-s)^N\). It falls below \(\varepsilon\in(0,1)\) when

\[
N>\frac{\log\varepsilon}{\log(1-s)}.
\]

This standard independence calculation is **TOY MODEL / NOT EMPIRICAL RESULT**. It models neither a shared stop nor correlated failures, changing survival probabilities, insufficient single-unit capability, or a complete defender optimization. It provides no estimate for a real fleet and is not an alternative proof that control cuts diverge.

## 6. Proposed measurement objects

### 6.1 Control-cut elasticity

For positive finite control costs on a comparable scale family, propose

\[
\mathcal E_\kappa(N)=\frac{d\log\kappa_{q_N}(G_N)}{d\log N},
\]

or the finite-scale estimate

\[
\widehat{\mathcal E}_\kappa=
\frac{\log\kappa_{q_{N_2}}(G_{N_2})-\log\kappa_{q_{N_1}}(G_{N_1})}
{\log N_2-\log N_1}.
\]

Cost units, task-threshold rule, horizon, feasible controls and policy envelope must be held comparable or explicitly varied. A constant cut has zero elasticity; a power law \(aN^\alpha\) has elasticity \(\alpha\), including one for linear scaling and values above one for superlinear scaling. Declining costs can give negative values. A near-zero observed slope does not prove bounded cost: \(\kappa=\log N\) diverges while elasticity approaches zero. Zero or infinite costs require separate treatment, not logarithms. **No empirical elasticity is reported here.**

### 6.2 Component and intervention significance

Retain unit capability vectors \(\mathbf w_i\) for task-relevant capacities, with dependencies and substitutability explicitly represented. They need not sum to system capability. Measure both \(\Delta\mathbf C(F)\) and

\[
\Delta\kappa_q(F)=\kappa_q(G\setminus F)-\kappa_q(G).
\]

When both costs are finite, this compares the **additional residual** control cost after the initial intervention, not total expenditure including its sunk cost. Threshold, horizon and authority must remain comparable. Changes in available controls or architecture can make the difference positive or negative; monotonicity is not assumed. Infinite costs require a separate comparison; subtracting two infinities is undefined.

### 6.3 Task-specific coordination gain

With matched hardware, task, compute and evaluation time, define for a positive independent-operation baseline

\[
\Gamma_k(N)=\frac{C_k^{\mathrm{coordinated}}(N)}{C_k^{\mathrm{independent}}(N)}.
\]

A fitted law \(C_k(N)\propto N^{\beta_k}\) describes absolute task-performance scaling over the measured range. \(\beta_k>1\) is superlinear performance in that range, not proof of indefinite scaling or a measured loss of control. It is the exponent of coordination gain only after accounting for the baseline exponent; with a linear baseline the gain exponent would be \(\beta_k-1\). Do not fit a single exponent across incompatible tasks.

### 6.4 Partition robustness

For a declared family of communication-only interventions with budget \(b\), define

\[
\rho_{\mathrm{part},k}(b)=
\inf_{F_{\mathrm{comm}}:\operatorname{cost}(F_{\mathrm{comm}})\le b}
\frac{C_k^*(G\setminus F_{\mathrm{comm}})}{C_k^*(G)},
\qquad 0<C_k^*(G)<\infty.
\]

Use a minimum only if attained. Declare feasible partition patterns, edge capacities, timing and recovery resources. Strong residual capability under one partition test is not evidence of immunity to every cut, and consensus impossibility results cannot substitute for this measurement.

### 6.5 Task-specific re-embodiment latency

Following a loss at time \(t\) that takes task \(k\) below threshold \(q\), define

\[
\tau_R^{(k,q)}=\inf\{\tau\ge0:C_k(t+\tau)\ge q\}.
\]

Set the value to infinity if restoration never occurs within the modelled future; report right-censoring when an experiment ends earlier. If sustained restoration is required, replace the instantaneous criterion with a declared hold-window condition. Availability of another body is not restoration of the task. This links P8’s re-embodiment question to P9’s capability endpoint, with adaptation, authorization and resource limits included.

## 7. Architectures to compare

| Architecture | Operational description | Control question to test |
|---|---|---|
| A — Centralized cloud | Bodies depend on a common controller for the task | Does an authorized shared stop suppress every recovery route within the deadline? |
| B — Replicated cloud/edge | Controller state is replicated across off-board and local resources | Does a mandatory safety or credential layer still span the replicas? |
| C — Federated local autonomy | Local controllers sustain tasks and coordinate when links are available | Which tasks survive partitions, and what infrastructure remains indispensable? |
| D — Heterogeneous multi-vendor | Platforms, controllers and interfaces differ | Are dependencies and authorized controls actually independent, or shared beneath vendor diversity? |

This table predicts no universal ranking of \(\kappa\). A heterogeneous fleet can share one enforceable safety layer. A centralized-looking deployment can retain local fallback capability. Independence is a property of verified operational dependencies, not of logos or deployment labels. Charging autonomy, wireless communication and hardware diversity can remove some cuts while adding others.

## 8. Proposed empirical programme

**All seven experiments below are PROPOSED; none has been executed for this manuscript.** Start with simulation or digital twins and benign warehouse, inspection or coverage tasks. Any later physical validation requires authorized equipment, controlled conditions and ordinary robotics safety review. No experiment calls for interference with public networks, unauthorized robot access, disabling safety protections, weapons, or harmful task execution.

### 8.1 Experiment 1 — Architecture and fleet-size sweep

Compare A–D at \(N=1,2,4,\ldots\) within simulator capacity, using matched tasks and explicitly specified threshold rules. Enumerate feasible cuts for small instances; use optimization certificates or clearly labelled upper/lower bounds for larger ones. Plot control cost or certified bounds against scale and estimate elasticity only when the data support it. Report fixed and scale-dependent costs separately. No numerical plot or simulated result is supplied in this proposal.

### 8.2 Experiment 2 — Random versus architecture-targeted loss

In the authorized simulation, compare random component withdrawal against model-informed selection of bodies, controller replicas, relays, power and maintenance dependencies. Measure \(\Delta\mathbf C\), \(\Delta\kappa\), uncertainty and recovery time at matched budgets. Graph centrality is a candidate heuristic, not proof of minimum intervention cost. Limit all removal operations to simulated or explicitly authorized benign test components.

### 8.3 Experiment 3 — Recovery ablation

Compare a frozen pre-loss allocation with admissible replanning, controller failover and task reassignment after identical simulated losses. Record recovered task fraction, time, compute and the resulting cut bounds. Separate controller-state persistence from actuator replacement. The gap estimates recovery’s contribution under tested policies; it is not automatically the optimal recovery supremum.

### 8.4 Experiment 4 — Partition tolerance

Apply controlled communication partitions inside the simulator and compute task-specific partition robustness across budgets. Vary latency, topology and allowed local autonomy independently. Include workloads requiring coordination and workloads executable locally. No real-world jamming or unauthorized network interruption is proposed.

### 8.5 Experiment 5 — Heterogeneity at fixed scale

Hold \(N\) and task requirements fixed while varying platform, controller, communication and infrastructure diversity separately. Measure actual dependency overlap rather than using vendor count as a proxy. Test whether diversification removes cheap cuts, creates integration bottlenecks, or preserves a shared authorized safety interface. Report morphology and task-transfer costs.

### 8.6 Experiment 6 — Verified common control layer

Introduce an independently verified, authenticated common safety-control layer across otherwise heterogeneous simulated fleets. Test whether its authorized activation remains effective under partitions and recovery, and whether its control cost stays bounded as scale increases. Account separately for installation, recurrent verification, operator readiness and activation. Cheap activation with rapidly growing verification expense may not yield a bounded **total verified** cost. Include safe task cessation rather than indiscriminate removal of power. This is a proposed design invariant test, not a standards-certification claim.

### 8.7 Experiment 7 — Functional re-embodiment

Following authorized simulated body withdrawal, test restoration of a specified task threshold on compatible alternatives. Record \(\tau_R^{(k,q)}\), sustained success, adaptation budget, controller-state availability, safe access conditions and censoring. Compare restoration of a task with mere reconnection to another robot. Test whether restored capability changes the least-cost intervention, rather than assuming that every transfer does.

### 8.8 Reporting and validity requirements

Preregister tasks, thresholds, cost units, deadlines, uncertainty models, available interventions, policy classes, simulator seeds and analysis choices. Publish simulator code, architecture/dependency specifications, certificates where available, and sensitivity analyses before presenting empirical conclusions. Those artifacts do not yet exist for this paper. Report confidence intervals across declared stochastic runs, optimization gaps, policy-search limits, model mismatch and the difference between sampled outcomes and a uniform guarantee. A digital twin must be validated before its control-cost estimates support real deployment decisions. Training or testing a hostile takeover policy is outside this programme.

## 9. Falsifiers, counterexamples and limitations

The empirical transition hypothesis weakens or fails in the following cases. These do not falsify correct conditional mathematics; they reject its proposed architectural application or its measurement assumptions.

1. **A cheap global cut survives.** An enforceable shared controller, credential or safety layer continues to suppress the task after all admissible recovery.
2. **Fan-out scales sufficiently.** Legitimate interventions affect growing fractions of viable capability, offsetting fleet growth.
3. **Local autonomy is inadequate.** Bodies cease the relevant task when centralized services or coordination fail.
4. **Survival is strongly correlated.** Common infrastructure or controllers collapse the apparent number of independent viable supports.
5. **Recovery is too slow or costly.** Replanning and re-embodiment cannot restore the threshold within the evaluated horizon.
6. **Heterogeneity does not diversify control domains.** Different manufacturers retain shared dependencies, or universal authorized safety interfaces remain enforceable.
7. **Partition robustness is low.** Residual task capability falls below threshold after affordable communication restrictions.
8. **Costs remain demonstrably bounded.** Verified cut certificates remain below a scale-independent budget. Near-zero estimated elasticity over a limited range alone does not establish boundedness.
9. **Interoperable safety preserves control.** A common authenticated control layer stays effective across controller replication, vendor diversity and adaptive recovery, with bounded relevant verification and activation costs.

Real systems may also have moving tasks, endogenous costs, changing human authority and limited observability. A larger fleet need not have a larger cut. Lower cost is not always better overall: a poorly authenticated global stop could itself enable disruption. The engineering objective is affordable **legitimate** control with appropriate safeguards, alongside alignment, safety and misuse prevention. This paper supplies no calibrated probability of catastrophe, no present-day value of \(\kappa\), no proof that all future architectures lose control, and no claim that communication causes catastrophe.

## 10. Candidate contribution and conclusion

The candidate contribution is an AI-embodiment-specific organization of established ideas: capability-aware intervention cuts, explicit post-intervention recovery, conditional architecture scaling, control-cut elasticity and a connection from persistent controller state to physical intervention cost. Task-aware interdiction and resilience already exist; evaluating whether this synthesis adds useful prediction beyond that prior art requires formal comparison and experiments. The four proofs make their assumptions inspectable rather than establishing that those assumptions describe current systems.

Robot scale alone does not imply uncontrollability. Communication alone does not imply uncontrollability. The critical object is whether cheap human-controlled intervention cuts remain. The research question is: **How does the minimum verified cost of reducing distributed embodied-AI capability below a specified threshold change as controllers, embodiments and infrastructure become more redundant and decentralized?**

The proposed engineering invariant is: **Preserve bounded-cost control cuts as embodied AI scales.**

*Mathematics proves implications; evidence establishes premises.*

### Publications-page description

A formal framework for asking whether embodied AI retains cheap human-controlled shutdown chokepoints as controller state, autonomy and physical capability become distributed. The paper defines an Embodiment Control Cut, derives conditional scaling results, and proposes experiments measuring how intervention cost changes across centralized, replicated and federated robot architectures.

## References

1. Menger, K. (1927). Zur allgemeinen Kurventheorie. *Fundamenta Mathematicae*, 10, 96–115. [Primary publication record](https://impan.pl/pl/wydawnictwa/czasopisma-i-serie-wydawnicze/fundamenta-mathematicae/all/10/0/92646/zur-allgemeinen-kurventheorie).
2. Ford, L. R., Jr., & Fulkerson, D. R. (1956). Maximal Flow Through a Network. *Canadian Journal of Mathematics*, 8, 399–404. [Paper](https://www.cs.yale.edu/homes/lans/readings/routing/ford-max_flow-1956.pdf).
3. Wood, R. K. (1993). Deterministic Network Interdiction. *Mathematical and Computer Modelling*, 17(2), 1–18. [Institutional paper archive](https://calhoun.nps.edu/server/api/core/bitstreams/3593402e-0cc8-4350-9aa0-8627da354b01/content).
4. Jain, K. (2001). A Factor 2 Approximation Algorithm for the Generalized Steiner Network Problem. *Combinatorica*, 21(1), 39–60. [Paper](https://www.cs.toronto.edu/tss/files/papers/Jain2001_Article_AFactor2ApproximationAlgorithm.pdf).
5. Fischer, M. J., Lynch, N. A., & Paterson, M. S. (1985). Impossibility of Distributed Consensus with One Faulty Process. *Journal of the ACM*, 32(2), 374–382. [Paper](https://groups.csail.mit.edu/tds/papers/Lynch/jacm85.pdf).
6. LeBlanc, H. J., Zhang, H., Sundaram, S., & Koutsoukos, X. (2013). Resilient Continuous-Time Consensus in Fractional Robust Networks. [arXiv:1303.2709](https://arxiv.org/abs/1303.2709).
7. Kehoe, B., Patil, S., Abbeel, P., & Goldberg, K. (2015). A Survey of Research on Cloud Robotics and Automation. *IEEE Transactions on Automation Science and Engineering*, 12(2), 398–409. [UC publication record](https://escholarship.org/uc/item/3t04p9m1).
8. Prorok, A., Malencia, M., Carlone, L., Sukhatme, G. S., Sadler, B. M., & Kumar, V. (2021). Beyond Robustness: A Taxonomy of Approaches towards Resilient Multi-Robot Systems. [arXiv:2109.12343](https://arxiv.org/abs/2109.12343).
9. Schlotfeldt, B., Tzoumas, V., Thakur, D., & Pappas, G. J. (2018). Resilient Active Information Gathering with Mobile Robots. [arXiv:1803.09730](https://arxiv.org/abs/1803.09730).
10. Karam, R., Nguyen, A. A., Lin, R., Martin, D. R., Morales, D., Butler, B. A., & Egerstedt, M. (2026). Collaboration in Multi-Robot Systems: Taxonomy and Survey over Frameworks for Collaboration. [arXiv:2603.23898](https://arxiv.org/abs/2603.23898).
11. Buldyrev, S. V., Parshani, R., Paul, G., Stanley, H. E., & Havlin, S. (2009 preprint). Catastrophic cascade of failures in interdependent networks. [arXiv:0907.1182](https://arxiv.org/abs/0907.1182).
12. Open-RMF contributors (accessed 16 September 2026). Interfacing with OpenRMF. [Official documentation](https://github.com/open-rmf/rmf_docs/blob/main/docs/source/interfacing/index.rst).
13. International Organization for Standardization (2015). ISO 13850:2015 — Safety of machinery — Emergency stop function — Principles for design. [Public scope](https://www.iso.org/standard/59970.html).
14. International Organization for Standardization (2025). ISO 10218-1:2025 — Robotics — Safety requirements — Part 1: Industrial robots. [Public scope](https://www.iso.org/standard/73933.html).
15. Ding, C., Cui, T., Wang, L., & Wen, C. (2026). Toward Certified Functional Safety for Industrial Humanoid Robots: The Fail-Passive Gap and a Feasibility Study. [arXiv:2608.02809](https://arxiv.org/abs/2608.02809).
16. Griffin, C., Thomson, L., Shlegeris, B., & Abate, A. (2024). Games for AI Control: Models of Safety Evaluations of AI Deployment Protocols. [arXiv:2409.07985](https://arxiv.org/abs/2409.07985).
17. Li, X., et al. (2026). Safety in Embodied AI: A Survey of Risks, Attacks, and Defenses. [arXiv:2605.02900](https://arxiv.org/abs/2605.02900).
18. Domae, Y., et al. (2026). The Embodiment Gap in Robot Foundation Models. [arXiv:2608.18433](https://arxiv.org/abs/2608.18433).

---

Author: Moheet Khawaja  
© Moheet Khawaja. All rights reserved.

Underlying user ideas, subsequent collaborative formalization and third-party results retain the provenance described above and in Atlas T73–T78. No institutional endorsement, peer review, DOI or completed empirical study is asserted.
