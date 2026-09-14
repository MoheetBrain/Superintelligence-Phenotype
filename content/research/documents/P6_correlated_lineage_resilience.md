# Can Advanced AI Development Be Stopped? A Correlated-Reliability Model of Distributed Capability Lineages

**Moheet Khawaja**  
Working paper v0.1 — 14 September 2026

> **Epistemic and provenance note.** The author's original intuition that widely distributed open models make AI progress difficult to extinguish is **O** (thesis 30), later strengthened into a distributed technological-lineage argument **O→F** (31, 33–34). The elementary union probability \(1-\prod_i(1-p_i)\) is standard and not novel. Open-weight irreversibility and compute chokepoints are established in current policy literature. The candidate contribution is a **correlated reliability / dependency-network model** for the probability that at least one advanced-AI development lineage remains capable of crossing a specified capability threshold after interventions or disruptions.

## Abstract

Arguments about whether advanced AI development can be halted often make one of two simplifying assumptions: either a few frontier laboratories constitute the entire development process, or many independent actors make eventual progress nearly inevitable. Both pictures are incomplete. AI-development lineages share research, semiconductor fabrication, cloud infrastructure, energy, talent, open weights, training software, and supply chains, creating strong correlations; at the same time, some digital artifacts become difficult or impossible to recall once globally released. This paper proposes a public-data **correlated reliability model** of advanced-AI development. A lineage \(i\) has conditional probability \(p_i(T\mid Z)\) of crossing a declared capability threshold by time \(T\) given shared systemic factors \(Z\), giving
\[
P(\text{no lineage succeeds by }T)=E_Z\left[\prod_i(1-p_i(T\mid Z))\right].
\]
The same system is represented as a dependency hypergraph linking lineages to compute, chip fabrication, energy, software, weights, algorithms, and talent. Interventions are modeled as node/edge restrictions, while globally replicated digital artifacts can be assigned near-zero post-release recallability. The key research outputs are not an inevitability claim but (i) the difference between naive independence and correlated estimates, (ii) minimal or near-minimal intervention cut sets under uncertain substitutability, and (iii) sensitivity of development resilience to algorithmic efficiency. No empirical probability estimates are reported in this draft; the paper specifies a transparent public-data construction and falsification criteria.

## 1. Introduction

Two propositions should be kept separate:

\[
\text{existing capable AI can be erased}
\]

and

\[
\text{future advanced-AI development can be stopped}.
\]

Once model weights are openly released and replicated, withdrawal options available to a centralized service provider can disappear. Yet surviving weights alone do not guarantee continued frontier progress. New capability can remain dependent on concentrated chip fabrication, energy, advanced packaging, training expertise, capital, or scientific breakthroughs.

At the other extreme, simply counting countries or laboratories and applying

\[
1-(1-p)^N
\]

as though every actor were independent is misleading. TSMC, ASML, NVIDIA/accelerator ecosystems, cloud providers, public algorithms, and shared scientific literature create common-mode factors.

The research question is therefore a reliability problem:

> **Given multiple partially independent AI-development lineages connected through shared technical dependencies, what is the probability that at least one lineage can cross a specified capability threshold under a given intervention/disruption scenario?**

This is relevant to unilateral pauses, global coordination, open-weight governance, compute governance, resilience analysis, and claims that advanced AI is either “inevitable” or easy to stop.

## 2. Related work and novelty boundary

### 2.1 Open-weight irreversibility

Anthropic's 2026 position on open weights explicitly states that once weights are released they cannot be withdrawn and can be redistributed and run privately. UK AISI and other governance work make similar points. This qualitative observation is therefore **not** novel.

### 2.2 Compute governance

Sastry et al. argue that compute is unusually governable because it is quantifiable, detectable, excludable, and produced through concentrated supply chains. This directly motivates dependency modeling: progress is distributed in some dimensions but highly concentrated in others.

### 2.3 Racing and coordination

Game-theoretic work on AGI races analyzes incentives to accelerate or cooperate. That literature concerns strategic choice among actors. This paper instead models the technical **continuation probability of the development graph** after interventions, though strategic responses should later be coupled to it.

### 2.4 Network reliability

Classical reliability engineering, fault trees, Bayesian networks, cut sets, and network interdiction all provide relevant tools. The mathematical machinery itself is not new. Candidate novelty lies in a transparent mapping of the advanced-AI ecosystem into a correlated dependency model that represents both globally persistent digital artifacts and concentrated physical chokepoints.

## 3. Definitions

### 3.1 Capability threshold

Let \(K\) be a pre-specified capability threshold. It must be operationally defined, for example:

- a declared autonomous-task horizon;
- performance on a specified AI-R&D benchmark;
- a frontier safety-framework threshold;
- a compute/capability proxy.

The paper should never use an undefined “ASI achieved” event as the outcome variable.

### 3.2 Lineages

A development lineage \(i\) is a sequence of organizations, models, code, expertise, and infrastructure sufficient to plausibly continue development over the modeled horizon.

Let

\[
S_i(T)=1
\]

if lineage \(i\) reaches threshold \(K\) by horizon \(T\).

### 3.3 Conditional success

Let shared systemic factors be

\[
Z=(Z_{\rm chips},Z_{\rm fabs},Z_{\rm energy},Z_{\rm algorithms},Z_{\rm policy},\ldots).
\]

Then

\[
p_i(T\mid Z)
=
P(S_i(T)=1\mid Z).
\tag{1}
\]

Conditional independence is a modeling option, not a statement that lineages are unconditionally independent.

If conditional independence is used:

\[
P(S_1=0,\ldots,S_N=0\mid Z)
=
\prod_{i=1}^{N}(1-p_i(T\mid Z)).
\]

Marginalizing shared factors gives

\[
\boxed{
P(\text{no lineage succeeds by }T)
=
E_Z\left[
\prod_{i=1}^{N}(1-p_i(T\mid Z))
\right].
}
\tag{2}
\]

Thus

\[
P(\ge1\text{ succeeds})
=1-
E_Z\left[
\prod_i(1-p_i(T\mid Z))
\right].
\tag{3}
\]

### 3.4 Dependency hypergraph

Let

\[
G=(V,E)
\]

be a directed hypergraph. Node classes can include:

- model weights/checkpoints;
- public algorithms/papers;
- talent/research groups;
- accelerator supply;
- advanced lithography;
- HBM/packaging;
- datacenter/cloud access;
- power;
- capital;
- training software/data;
- regulatory permissions.

A hyperedge

\[
e=(U\rightarrow v)
\]

means a set of upstream resources \(U\) jointly enables node \(v\).

### 3.5 Recallability

For digital artifact \(d\), define post-release recallability

\[
r_d\in[0,1],
\]

the fraction/probability of extant usable copies that an intervention can effectively remove from the modeled system.

A globally replicated open-weight artifact may have

\[
r_d\approx0,
\]

while a centralized unreleased checkpoint may have much larger recallability.

### 3.6 Intervention

An intervention \(u\) changes node availability, edge capacity, or conditional transition probabilities. Examples include lawful compute restrictions, voluntary pauses, export controls, model withdrawal before open release, or global testing requirements.

The model is not intended to optimize covert evasion.

## 4. Assumptions

- **A1 — Multiple lineages.** More than one technically credible development lineage exists or can emerge.
- **A2 — Shared dependencies.** Lineages have meaningful common-mode factors.
- **A3 — Publicly modelable dependencies.** A policy-relevant dependency graph can be constructed from non-sensitive sources.
- **A4 — Substitutability uncertainty.** Alternate suppliers, algorithms, and compute routes are represented probabilistically rather than assumed absent.
- **A5 — Fixed capability threshold.** \(K\) is defined before fitting intervention effects.
- **A6 — Intervention compliance is modeled.** Controls are not treated as perfectly effective by assumption.
- **A7 — No inevitability prior.** A surviving lineage is allowed to fail for scientific, economic, or organizational reasons.

## 5. Why naive independence is inadequate

If \(p_i=p\) and events are independent,

\[
P(\ge1)=1-(1-p)^N.
\tag{4}
\]

Equation (4) can rise rapidly with \(N\). But if every actor fails whenever advanced semiconductor supply is unavailable, adding actors does not create comparable resilience.

### Example: one common enabling factor

Let \(Z\in\{0,1\}\) denote global availability of a critical enabling factor with

\[
P(Z=1)=q.
\]

Conditional on \(Z=1\), each lineage succeeds with probability \(p\); if \(Z=0\), all fail. Then

\[
P(\ge1)=q\left[1-(1-p)^N\right].
\tag{5}
\]

As \(N\to\infty\),

\[
P(\ge1)\to q,
\]

not one. Shared dependence creates a ceiling.

This elementary example captures why correlation structure matters more than raw actor count.

## 6. Propositions

### Proposition 1 — A perfect common prerequisite upper-bounds diversification benefit

Under the common-factor model above, if success requires \(Z=1\), then for any number of lineages

\[
P(\ge1\text{ succeeds})\le P(Z=1)=q.
\]

#### Proof

The event \(\cup_i\{S_i=1\}\) is a subset of \(\{Z=1\}\). Therefore its probability cannot exceed \(P(Z=1)\). \(\square\)

### Proposition 2 — Irreversible digital artifacts cannot serve as reliable post-release cut nodes

Suppose node \(d\) is required for a family of development paths but, after open release, intervention \(u\) has recallability \(r_d\approx0\). Then an intervention strategy whose only cut mechanism is removal of \(d\) cannot reduce the availability of those already-replicated copies below approximately \(1-r_d\).

**Status:** a direct modeling implication, not an original result. It formalizes the governance distinction between pre-release and post-release intervention points.

### Proposition 3 — Minimal cut sets depend on substitutability

Let \(\mathcal P\) be all paths from initial capability to threshold \(K\). A node set \(S\) is a hard cut if it intersects every feasible path:

\[
\forall p\in\mathcal P,
\quad
p\cap S\neq\emptyset.
\tag{6}
\]

If a previously unavailable substitute creates new path \(p'\) with \(p'\cap S=\emptyset\), then \(S\) ceases to be a hard cut.

**Interpretation:** chokepoint claims should be stress-tested against algorithmic efficiency, alternative suppliers, and technological substitution rather than treated as permanent.

## 7. Probabilistic cut-set problem

Hard cuts are unrealistic for many AI dependencies. Define intervention cost \(c(S)\) and continuation risk under intervention \(S\):

\[
R(S)
=
P(\ge1\text{ lineage reaches }K\mid S).
\tag{7}
\]

A policy optimization is

\[
S^*(\epsilon)
=
\arg\min_S c(S)
\quad\text{s.t.}\quad
R(S)\le\epsilon.
\tag{8}
\]

Equation (8) is not automatically an ethical recommendation: intervention cost must include economic, geopolitical, civil-liberties, concentration, and innovation harms.

A dual problem asks the achievable reduction for a fixed policy budget:

\[
R^*(C)
=
\min_{S:c(S)\le C}R(S).
\tag{9}
\]

## 8. Proposed empirical construction

**No probability model has yet been calibrated for this manuscript.**

### 8.1 Scope

Start with a narrow horizon and threshold, e.g. “cross a specified public AI-R&D automation benchmark by 2030,” rather than “produce ASI eventually.”

### 8.2 Public-data sources

Potential node data:

- official model cards and open-weight releases;
- public semiconductor company filings;
- ASML/TSMC/foundry capacity reports;
- HBM and packaging public reports;
- hyperscaler datacenter disclosures;
- grid/power capacity reports;
- public export-control rules;
- public research-lab and talent data;
- academic compute estimates.

Use public aggregates. Do not publish security-sensitive operational details.

### 8.3 Lineage definition protocol

A lineage should be identified by a reproducible rule rather than national stereotypes. Candidate criteria:

1. demonstrated ability to train or substantially improve frontier/open models;
2. access to a minimum compute/resource envelope;
3. durable technical team or ecosystem;
4. availability of key software/algorithmic assets;
5. a path to the threshold that can be represented in \(G\).

### 8.4 Probability elicitation

Where frequencies do not exist, use broad distributions and scenario ranges rather than false precision. Options include:

- structured expert elicitation;
- public forecasting markets/superforecasters where available;
- historical task/capability trend models;
- interval probabilities converted to imprecise-Bayesian bounds.

The paper should publish results across several plausible priors.

## 9. Proposed simulation

### 9.1 Factor model

Let lineage latent score be

\[
L_i
=
\alpha_i+
\beta_i^TZ+
\epsilon_i.
\]

Success occurs if

\[
L_i>\tau_i.
\]

Shared \(Z\) creates correlation; \(\epsilon_i\) captures lineage-specific variation.

### 9.2 Graph Monte Carlo

For each simulation draw:

1. sample node capacities/availability;
2. sample algorithmic-efficiency multipliers;
3. sample intervention compliance;
4. identify feasible paths for each lineage;
5. sample lineage scientific/organizational success conditional on path quality;
6. record whether any lineage reaches \(K\).

### 9.3 Scenarios

Compare:

- no intervention;
- one major lab pauses;
- all U.S. frontier labs pause;
- coordinated democratic-country pause;
- global compute threshold regulation;
- open-weight recall attempted after release;
- open-weight release prevented before release;
- large algorithmic-efficiency improvement;
- semiconductor substitution/new fabs.

The scenarios are analytical, not recommendations.

## 10. Baselines

1. independent lineage union (4);
2. single compute-chokepoint model;
3. one “U.S. versus China” two-player race;
4. pure diffusion model with no physical bottlenecks;
5. deterministic dependency graph with no probabilities.

The correlated network model is useful only if it materially changes conclusions under plausible assumptions.

## 11. Falsification conditions

The distributed-resilience thesis is weakened if:

1. almost all credible paths depend on a very small set of realistically controllable physical nodes;
2. algorithmic substitution does little to alter those cut sets;
3. open-weight models cannot materially contribute to further frontier development without inaccessible infrastructure;
4. credible lineages are so correlated that additional jurisdictions/actors add negligible resilience;
5. global coordination is both enforceable and durable under realistic incentives.

Conversely, strong evidence of multiple technically distinct paths with low shared dependence strengthens it.

## 12. Failure modes

### 12.1 Hidden capabilities

State programmes and private infrastructure may not be observable.

### 12.2 Endogenous response

Interventions alter incentives, investment, substitution, and smuggling/evasion. A static graph can become obsolete quickly.

### 12.3 Threshold ambiguity

Results can change drastically with the target capability \(K\).

### 12.4 Political feasibility

A technically effective cut can be ethically or politically unacceptable.

### 12.5 Correlation sign

“Correlated” does not mean every dependence increases continuation risk. Some common shocks can make lineages fail together, reducing diversification; shared knowledge can simultaneously make recovery easier. The model must compute, not assume, the net effect.

## 13. Ethical constraints

The analysis should support governance without becoming an evasion manual.

Therefore:

- use public, aggregate supply-chain data;
- do not map covert procurement routes;
- do not identify unpublicized security weaknesses;
- do not optimize smuggling or sanctions evasion;
- report interventions at the policy/industry level;
- include the harms of concentration and overbroad controls in \(c(S)\).

## 14. Why this is separate from the control-frontier paper

P4 studies:

\[
\text{Can humans control a deployed/untrusted AI system?}
\]

P6 studies:

\[
\text{Can human institutions stop or materially delay the global development process itself?}
\]

A world can have robust development resilience but strong deployed-system control, or the reverse.

## 15. Limitations

The principal limitation is observability: frontier capabilities, supply-chain substitution possibilities, private stockpiles, and state-level programs are only partially public. Lineage success probabilities are therefore necessarily model-based and may be dominated by structural uncertainty rather than sampling error. The graph also changes endogenously when interventions alter incentives, prices, research directions, or geopolitical cooperation. A capability threshold can be defined operationally but remains contestable, and the model should not be interpreted as identifying evasion strategies around governance controls. The paper is best read as a reliability-analysis framework for comparing intervention structures, not as a forecast that advanced AI is inevitable or impossible to govern.

## 15. Minimum publishable result

A credible paper requires:

1. a transparent public dependency graph with uncertainty annotations;
2. at least three lineage definitions and sensitivity to those definitions;
3. a correlated probability model rather than naive independence;
4. minimal/near-minimal probabilistic cut-set analysis;
5. algorithmic-efficiency/substitutability stress tests;
6. comparison with independence and single-chokepoint baselines;
7. no operational evasion guidance.

A conceptual “AI is impossible to stop” essay is **not** sufficient.

## 16. Conclusion

Open weights make some forms of capability irreversibility real, but they do not prove that future advanced AI is inevitable. Concentrated physical supply chains create genuine intervention points, while shared scientific knowledge, multiple jurisdictions, algorithmic progress, and irretrievable digital artifacts create resilience.

The correct mathematical structure is therefore neither a single chokepoint nor a set of independent actors. It is a **correlated reliability network**.

The central object is:

\[
P(\ge1\text{ development lineage reaches }K\mid \text{shared dependencies and interventions}).
\]

Estimating that object can clarify which “stop AI” claims are technically plausible, which merely delay one actor, and which depend on assumptions about correlation, substitution, and global coordination that should be made explicit.

---

## Planned figures/tables

1. Figure 1 — stylized development-lineage dependency hypergraph.
2. Figure 2 — independent versus common-factor continuation probability.
3. Figure 3 — probabilistic cut-set heatmap.
4. Figure 4 — sensitivity to algorithmic-efficiency multiplier.
5. Table 1 — node classes, data sources, and uncertainty.
6. Table 2 — intervention scenarios and ethical/policy costs.

## Reproducible-code requirements

Suggested repository:

`github.com/moheetkhawaja/superintelligence-research-atlas/tree/main/p6-correlated-lineages`

Include graph data schema, provenance for every node/edge, uncertainty distributions, Monte Carlo code, cut-set solver, scenario configs, sensitivity notebooks, and a security review of released data resolution.

## Suggested publication URLs and metadata

Canonical page:
`https://superintel.site/research/correlated-ai-lineages`

PDF:
`https://superintel.site/papers/correlated-ai-lineages.pdf`

```html
<meta name="citation_title" content="Can Advanced AI Development Be Stopped? A Correlated-Reliability Model of Distributed Capability Lineages">
<meta name="citation_author" content="Moheet Khawaja">
<meta name="citation_publication_date" content="2026/09/14">
<meta name="citation_pdf_url" content="https://superintel.site/papers/correlated-ai-lineages.pdf">
```

### Publications-page description

A proposed network-reliability model for the resilience of advanced-AI development across multiple organizations and jurisdictions. It replaces the naive “one lab” and “many independent actors” pictures with a correlated dependency graph containing open weights, algorithms, talent, semiconductors, cloud infrastructure, energy, and policy interventions. The objective is to estimate continuation probabilities and policy-relevant cut sets without claiming that advanced AI is inevitable.

## References

1. Anthropic. (2026). *Our position on open-weights models*. https://www.anthropic.com/news/position-open-weights-models
2. Sastry, G., Heim, L., Belfield, H., Anderljung, M., Brundage, M., Hazell, J., O'Keefe, C., Hadfield, G. K., et al. (2024). *Computing Power and the Governance of Artificial Intelligence*. arXiv:2402.08797. https://arxiv.org/abs/2402.08797
3. Dung, L., & Hellrigel-Holderbaum, M. (2025). *Against racing to AGI: Cooperation, deterrence, and catastrophic risks*. arXiv:2507.21839. https://arxiv.org/abs/2507.21839
4. Campos, S., Papadatos, H., Roger, F., Touzet, C., Quarks, O., & Murray, M. (2025). *A Frontier AI Risk Management Framework: Bridging the Gap Between Current AI Practices and Established Risk Management*. arXiv:2502.06656. https://arxiv.org/abs/2502.06656
