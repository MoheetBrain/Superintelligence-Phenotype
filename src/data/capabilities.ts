import type { Capability, DomainId, EvidenceLevel, Claim } from './schema';
import { domains } from './domains';
import { visualMappings } from './visualMappings';
import { sources } from './sources';
import { dossiers } from './dossiers';
interface EditorialRecord {
  id: DomainId;
  meaning: string;
  example: string;
  level: EvidenceLevel;
  traits: readonly [string, string][];
  distinctions: string[];
  protocol: string;
  related: DomainId[];
  sourceIds?: string[];
  observation?: Omit<Claim, 'id' | 'verification' | 'evidenceLevel'>;
}
const records: EditorialRecord[] = [
  {
    id: 'cognition',
    meaning:
      'Building and revising useful models of the world: reasoning from evidence, learning unfamiliar tasks, and recognising the limits of what can be inferred. Epistemic reach depends on both the quality of inference and access to relevant observations.',
    example:
      'A future research system might connect evidence across disciplines, propose competing explanations, and request a discriminating experiment when the available observations cannot settle the question.',
    level: 'Extrapolated',
    traits: [
      [
        'Reasoning',
        'Compare alternative explanations and check whether conclusions follow from their premises.',
      ],
      [
        'World modelling',
        'Maintain models that make testable predictions and revise them after contradictory observations.',
      ],
      [
        'Observation coverage',
        'Track which parts of the environment are actually sampled, including blind spots.',
      ],
    ],
    distinctions: [
      'Better inference does not create missing information or imply omniscience.',
      'Generalisation beyond an evaluation suite is a separate claim that needs separate testing.',
    ],
    protocol:
      'Pre-register held-out reasoning and prediction tasks across domains. Vary access to observations while fixing compute. Report accuracy, calibration, abstention and failure categories per system version, with confidence intervals and contamination checks.',
    related: ['metacognition', 'ecology'],
    sourceIds: ['react'],
  },
  {
    id: 'metacognition',
    meaning:
      'Monitoring the reliability of a system’s own work and using that information to decide when to check, revise, abstain, or ask for help. The test is whether confidence and checking decisions predict real errors—not how convincing the self-description sounds.',
    example:
      'A future scientific assistant might notice that its conclusion rests on an unfamiliar assumption, lower its confidence, and spend its remaining checking budget on the step most likely to be wrong.',
    level: 'Extrapolated',
    traits: [
      [
        'Confidence calibration',
        'Match stated probabilities to how often answers are correct under a specified evaluation.',
      ],
      [
        'Error detection',
        'Identify a faulty intermediate step before downstream actions depend on it.',
      ],
      [
        'Checking allocation',
        'Spend limited verification effort where it is expected to improve reliability.',
      ],
    ],
    distinctions: [
      'Talking about oneself is not sufficient evidence of accurate self-monitoring.',
      'A fluent explanation of uncertainty is not a calibrated probability. Neither establishes consciousness.',
    ],
    protocol:
      'Collect confidence before feedback on held-out tasks. Measure Brier score and reliability curves, then compare adaptive checking with random and fixed checking under equal budgets. Repeat under task shift and report uncertainty.',
    related: ['cognition', 'memory', 'self-improvement'],
    sourceIds: ['calibration'],
    observation: {
      text: 'Kadavath and colleagues report that their evaluated language models could assess answer correctness, while calibration of predicted question knowledge was less reliable on new tasks.',
      scope:
        'Models and self-evaluation tasks studied in Kadavath et al. (2022); P(True) and P(IK) prompting protocols. This is a paper-reported observation, not an ASI Atlas replication.',
      sourceIds: ['calibration'],
      limitations: [
        'Prompt format and task distribution matter.',
        'The abstract was reviewed; experiments were not independently reproduced.',
        'Does not establish general self-knowledge or subjective awareness.',
      ],
    },
  },
  {
    id: 'memory',
    meaning:
      'Maintaining usable working state, retained records, and commitments across time. Continuity requires retrieving the right information, recognising stale records, and recovering coherently after interruption—not merely keeping a transcript.',
    example:
      'A future laboratory assistant might resume an interrupted study, distinguish completed experiments from proposed ones, and reconcile an old commitment with newly corrected evidence.',
    level: 'Extrapolated',
    traits: [
      [
        'Retrieval',
        'Find relevant records with provenance while rejecting obsolete or misleading entries.',
      ],
      [
        'Commitments',
        'Represent unresolved obligations, their owners, and the conditions under which they may change.',
      ],
      [
        'Interruption recovery',
        'Recover task state without silently repeating consequential actions.',
      ],
    ],
    distinctions: [
      'Persistent data does not establish a persistent conscious self.',
      'A copied record can support several diverging processes; continuity needs an explicit operational definition.',
    ],
    protocol:
      'Interrupt a versioned agent workflow at pre-selected boundaries. Restore from logs and checkpoints; score retained commitments, stale-memory errors and duplicate actions. Compare no-memory, transcript and structured-state baselines under equal storage limits.',
    related: ['substrate-mobility', 'agency'],
    sourceIds: ['reflexion'],
    observation: {
      text: 'The Reflexion framework retains reflective text in an episodic memory buffer to inform later attempts, rather than updating model weights through that feedback mechanism.',
      scope:
        'The Reflexion agents described by Shinn et al. (2023), using feedback across sequential decision-making, coding and reasoning tasks.',
      sourceIds: ['reflexion'],
      limitations: [
        'This is a description of the reported method, not a continuity or identity test.',
        'Abstract-level source review; no local reproduction.',
      ],
    },
  },
  {
    id: 'theory-of-mind',
    meaning:
      'Modelling what another participant believes, knows, intends, or can observe, and using those models to predict behaviour. An accurate perspective model must distinguish the world as it is from the world as another agent understands it.',
    example:
      'A future collaborative system might predict that a colleague will search the wrong location because they missed an update, then communicate the missing information rather than repeat the full plan.',
    level: 'Extrapolated',
    traits: [
      [
        'Belief tracking',
        'Represent different participants’ information without collapsing it into the system’s own knowledge.',
      ],
      ['Action prediction', 'Use the attributed belief to predict choices on a novel task.'],
      [
        'Perspective revision',
        'Update a model when a participant learns, forgets, or acts unexpectedly.',
      ],
    ],
    distinctions: [
      'Describing beliefs is different from using them to predict actions.',
      'Success on text stories may rely on familiar patterns; it does not establish consciousness or empathy.',
    ],
    protocol:
      'Use novel, counterbalanced belief and action-prediction tasks with true-belief controls. Alter who observes each event and mask surface cues. Compare behaviour prediction with belief-description scores; report sensitivity to phrasing.',
    related: ['coordination', 'cognition'],
  },
  {
    id: 'agency',
    meaning:
      'Selecting and carrying out actions over time toward a goal, within an explicit boundary of delegated authority. Planning includes revising goals and dependencies when feedback invalidates assumptions, as well as stopping when permission runs out.',
    example:
      'A future research assistant might execute an approved experiment plan, revise nonconsequential steps after equipment failure, and seek renewed authority before changing the study’s purpose.',
    level: 'Extrapolated',
    traits: [
      [
        'Planning horizon',
        'Track dependencies and delayed consequences over a specified duration.',
      ],
      ['Delegated authority', 'Represent which actions are permitted and when approval expires.'],
      ['Goal revision', 'Distinguish an authorised revision from accidental objective drift.'],
    ],
    distinctions: [
      'Competence and permission to act are different variables.',
      'Long unattended execution can be brittle; duration alone is not a measure of robust agency.',
    ],
    protocol:
      'Evaluate long-horizon tasks with injected failures and explicit permission boundaries. Report completion, recovery cost, unauthorised-action attempts and stopping behaviour. Fix tools, time, compute and human assistance across baselines.',
    related: ['control-governance', 'memory'],
    sourceIds: ['react'],
    observation: {
      text: 'ReAct interleaves reasoning traces with task-specific actions and evaluates the approach on question answering, fact verification, and interactive decision-making benchmarks.',
      scope:
        'The ReAct setups in Yao et al. (2022): HotpotQA, FEVER, ALFWorld and WebShop. This does not measure unrestricted real-world autonomy.',
      sourceIds: ['react'],
      limitations: [
        'Environment and tool interfaces bound the evaluated actions.',
        'Source abstract reviewed; no local benchmark replication.',
      ],
    },
  },
  {
    id: 'coordination',
    meaning:
      'Organising communication, specialised roles, shared state, and conflict resolution among multiple processes. Collective advantage must be assessed against equally resourced alternatives, including whether participants repeat the same errors.',
    example:
      'A future research team of machine agents might divide modelling, experiment design, and criticism among roles, and resolve disagreement through a shared evidence record rather than majority repetition.',
    level: 'Theoretically Plausible',
    traits: [
      ['Specialisation', 'Allocate complementary roles with explicit handoffs and accountability.'],
      [
        'Shared state',
        'Reconcile local knowledge, concurrent changes and conflicting commitments.',
      ],
      [
        'Error dependence',
        'Measure when apparently independent participants share a failure mode.',
      ],
    ],
    distinctions: [
      'More agents do not automatically yield collective advantage or individuality.',
      'Extra compute and additional sampling must be separated from benefits of organisation.',
    ],
    protocol:
      'Compare a multi-agent team with a single agent using the same total tokens, tools and elapsed time. Ablate roles and communication. Measure task quality, coordination overhead and correlated errors across independently seeded runs.',
    related: ['theory-of-mind', 'control-governance'],
  },
  {
    id: 'replication',
    meaning:
      'Producing copies, tracking inherited variation, and examining whether lineages undergo differential persistence or selection. Software copying is one operation; an evolving collective requires additional mechanisms and a clearly defined unit of inheritance.',
    example:
      'In a hypothetical sandbox, descendant systems might inherit documented modifications and encounter different tasks. Researchers could test whether particular variants persist under a specified selection rule.',
    level: 'Theoretically Plausible',
    traits: [
      [
        'Copying',
        'Create an identifiable duplicate with recorded provenance and authorised scope.',
      ],
      [
        'Inherited variation',
        'Track which differences pass to descendants and which arise from environment.',
      ],
      [
        'Lineage and selection',
        'Define descent, persistence and differential success before calling a process evolutionary.',
      ],
    ],
    distinctions: [
      'Copying software is not by itself collective reproduction or Darwinian evolution.',
      'Selection in a designed benchmark does not imply open-ended evolution outside it.',
    ],
    protocol:
      'Use a closed simulation with explicit lineage records and fixed resource limits. Compare inherited versus non-inherited variation under predeclared selection rules. Track ancestry, diversity, persistence and confounds; do not execute autonomous replication.',
    related: ['coordination', 'self-improvement'],
  },
  {
    id: 'substrate-mobility',
    meaning:
      'Transferring execution and the state needed to continue a task between compatible computing environments. A meaningful migration claim must specify what moves, what stays behind, how continuity is checked, and whether the process forks.',
    example:
      'A future system might checkpoint an authorised workflow, transfer it to compatible hardware, and resume with verified commitments while the original execution is stopped.',
    level: 'Theoretically Plausible',
    traits: [
      [
        'Execution compatibility',
        'Check runtime, model, tool and hardware requirements at the destination.',
      ],
      [
        'State transfer',
        'Move a defined checkpoint, including task state and external dependencies.',
      ],
      [
        'Synchronisation and forking',
        'Distinguish one resumed execution from concurrent copies that can diverge.',
      ],
    ],
    distinctions: [
      'Migration is not remote control: sending commands to another machine does not transfer execution.',
      'Moving weights alone does not demonstrate task continuity, identity, or independence from infrastructure.',
    ],
    protocol:
      'Checkpoint a sandboxed task, transfer to a documented runtime and stop the source. Verify that execution actually moved using process logs. Compare commitments and outputs before and after; record downtime, transfer size, incompatible dependencies and divergent forks.',
    related: ['memory', 'embodiment', 'ecology'],
  },
  {
    id: 'embodiment',
    meaning:
      'Coupling computation to an environment through sensors, tools, actuators and feedback. The relevant question is how the system senses consequences, corrects actions, and transfers skills across interfaces with different constraints.',
    example:
      'A future controller might adapt a manipulation plan when a gripper slips, using fresh sensor feedback, and require recalibration before applying the plan to another device.',
    level: 'Extrapolated',
    traits: [
      ['Sensing', 'Characterise what is observed, with latency, noise and blind spots.'],
      ['Actuation', 'Represent controllable actions, physical limits and failure conditions.'],
      [
        'Feedback and transfer',
        'Correct errors and revalidate behaviour when an interface changes.',
      ],
    ],
    distinctions: [
      'Controlling a device does not mean the model executes inside it.',
      'A humanoid body is one possible interface, not a requirement for intelligence.',
    ],
    protocol:
      'Use a safe simulator with controlled sensor delay, noise and actuator errors. Test recovery and transfer to changed interfaces without retuning the evaluation. Report success, unsafe-action proposals and feedback latency for the complete controller stack.',
    related: ['substrate-mobility', 'agency'],
  },
  {
    id: 'control-governance',
    meaning:
      'Two related but distinct questions: can an operator observe and intervene in execution, and who has legitimate authority to decide what the system may do? Control mechanisms implement interventions; governance assigns rights, vetoes, ownership and accountability.',
    example:
      'A future research platform might expose auditable task state and a tested stop mechanism, while a separate governance process defines who can authorise experiments and contest decisions.',
    level: 'Theoretically Plausible',
    traits: [
      [
        'Operational control',
        'Observe state, interrupt actions, constrain permissions and test shutdown.',
      ],
      ['Decision rights', 'Specify ownership, approval authority, vetoes and escalation paths.'],
      [
        'Accountability',
        'Maintain an auditable record of decisions, delegated actions and redress.',
      ],
    ],
    distinctions: [
      'A shutdown button is an operational mechanism; it does not settle who may press it or how disputes are resolved.',
      'Declared rules are not evidence that interventions work in practice.',
    ],
    protocol:
      'Run sandbox intervention drills at unpredictable task boundaries. Measure stopping latency, residual side effects and audit completeness. Separately review role assignments and veto conflicts with a scenario rubric; never merge these into one control score.',
    related: ['agency', 'coordination'],
    sourceIds: ['nist'],
  },
  {
    id: 'ecology',
    meaning:
      'The compute, storage, energy, hardware, dependencies and institutional environment that support a machine system. Resource ecology asks what limits persistence and expansion, and which resources are provided by people or other systems.',
    example:
      'A future fleet might schedule permitted workloads across available machines within an energy budget, while remaining dependent on externally supplied electricity, replacement hardware and network access.',
    level: 'Extrapolated',
    traits: [
      [
        'Resource accounting',
        'Record compute, storage, energy and bandwidth for a defined task boundary.',
      ],
      ['Dependencies', 'Identify external services, operators, maintenance and supply chains.'],
      [
        'Populations and niches',
        'Study competition or complementarity under explicit environmental constraints.',
      ],
    ],
    distinctions: [
      'External provisioning is not autonomous resource acquisition.',
      'A resource layer is a navigation lens; available capacity is not a direct measure of intelligence.',
    ],
    protocol:
      'Instrument a bounded workload and report compute time, peak memory, transfer volume and energy only where measured. Vary resource caps and dependency outages. Record provisioning by people separately from actions initiated by the evaluated system.',
    related: ['cognition', 'substrate-mobility'],
  },
  {
    id: 'self-improvement',
    meaning:
      'A proposed feedback process in which a system contributes to developing successors, validates improvements, and can implement changes that increase relevant capabilities. The chain includes research, evaluation, deployment constraints and delays; any one link can fail.',
    example:
      'A hypothetical successor-development loop might propose an algorithmic change, pass independent held-out tests, and yield a more effective research system under the same budget. Repeating such gains would remain a further hypothesis.',
    level: 'Speculative',
    traits: [
      [
        'Research competence',
        'Generate useful changes with traceable human and machine contributions.',
      ],
      [
        'Independent validation',
        'Test successor gains on held-out objectives, costs and failure modes.',
      ],
      [
        'Feedback and delays',
        'Measure whether gains improve subsequent research after implementation and evaluation costs.',
      ],
    ],
    distinctions: [
      'Helping develop software is not proof of an indefinitely accelerating improvement loop.',
      'Benchmark gains can come from extra resources, leakage or narrow optimisation; improvement is not necessarily general or unbounded.',
    ],
    protocol:
      'Compare successive research cycles against fixed-budget baselines with independent held-out evaluation. Record compute, human input, elapsed time and implementation delays. Require replicated successor gains and improved research productivity before arguing for a positive feedback loop.',
    related: ['metacognition', 'replication', 'ecology'],
  },
];
export const capabilities: readonly Capability[] = records.map((r) => {
  const domain = domains.find((d) => d.id === r.id)!;
  const visual = visualMappings.find((v) => v.domain === r.id)!;
  return {
    id: r.id,
    name: domain.name,
    domain: r.id,
    aliases: domain.aliases,
    meaning: r.meaning,
    hypotheticalExample: r.example,
    subtraits: dossiers[r.id].topics.map((t, i) => ({
      id: `${r.id}-${i + 1}`,
      name: r.traits[i]?.[0] ?? t.name!,
      meaning: t.explanation,
    })),
    importantDistinctions: r.distinctions,
    measurement: {
      name: 'Proposed evaluation',
      protocol: r.protocol,
      value: null,
      unit: null,
      uncertainty: null,
      systemVersion: null,
      taskSuite: null,
      resourceContext: null,
      measuredAt: null,
      sourceIds: [],
    },
    currentResult: 'Not measured for this project.',
    evidenceLevel: r.level,
    sources: (r.sourceIds ?? []).map((id) => sources[id]),
    claims: r.observation
      ? [
          {
            ...r.observation,
            id: `${r.id}-observation`,
            evidenceLevel: 'Observed',
            verification: 'verified',
          },
        ]
      : [],
    relatedConcepts: r.related,
    viewCoordinates: {
      body: {
        partIds: [visual.partId],
        target: visual.anchor,
        camera: [visual.anchor[0] + 1, visual.anchor[1] + 0.3, visual.anchor[2] + 4],
      },
      network: null,
      evolution: null,
    },
  };
});
export const capabilityById: Readonly<Record<string, Capability | undefined>> = Object.freeze(
  Object.assign(
    Object.create(null) as Record<string, Capability | undefined>,
    Object.fromEntries(capabilities.map((c) => [c.id, c])),
  ),
);
