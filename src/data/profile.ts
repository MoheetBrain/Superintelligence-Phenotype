import type { DomainId } from './schema';

export const profileFrames = [
  'Observed today',
  'Near-term extrapolation',
  'Long-term ASI hypothesis',
  'Speculative upper-bound concept',
] as const;

export interface ProfileTrait {
  id: string;
  name: string;
  group: 'Physical' | 'Cognitive' | 'Distributed';
  value: string;
  frame: (typeof profileFrames)[number];
  domain: DomainId;
  meaning: string;
  enables: string;
  limit: string;
  scaling: string;
}

// Editorial scenarios, never benchmark results. These do not change the evidence
// levels, measurements, or twelve stable domains in the research catalogue.
export const profileTraits: readonly ProfileTrait[] = [
  {
    id: 'strength',
    name: 'Physical Strength',
    group: 'Physical',
    value: 'Body-dependent',
    frame: 'Near-term extrapolation',
    domain: 'embodiment',
    meaning: 'How much force an embodied system could safely apply.',
    enables:
      'A purpose-built body might handle heavy materials, support rescue work or use machinery designed for larger loads.',
    limit:
      'A more intelligent controller does not make its motors stronger. Grip, structure, power and the safety of people nearby remain constraints.',
    scaling:
      'Different actuators or industrial equipment could extend force; the same humanoid shell would still have a physical limit.',
  },
  {
    id: 'speed',
    name: 'Running Speed',
    group: 'Physical',
    value: 'Built for its terrain',
    frame: 'Near-term extrapolation',
    domain: 'embodiment',
    meaning: 'How quickly a body could move while remaining stable in its environment.',
    enables:
      'An appropriate mobile platform might traverse hazardous sites or reach a remote task quickly.',
    limit:
      'Fast thinking does not imply fast running. Traction, balance, heat, batteries and collision risk constrain movement.',
    scaling:
      'Changing the body could matter more than changing the model: wheels, legs and aircraft solve different mobility problems.',
  },
  {
    id: 'dexterity',
    name: 'Dexterity',
    group: 'Physical',
    value: 'Tools as extensions',
    frame: 'Long-term ASI hypothesis',
    domain: 'embodiment',
    meaning: 'The ability to adapt a sequence of manipulations to unfamiliar objects and tools.',
    enables:
      'A future system might assemble intricate mechanisms, repair equipment or learn a new craft from demonstration.',
    limit:
      'Reasoning about an object is not the same as handling it. Contact sensing, fragile materials and changing conditions can defeat a plan.',
    scaling:
      'Better touch sensors, training across bodies and closed-loop correction could broaden the repertoire; transfer would need testing.',
  },
  {
    id: 'precision',
    name: 'Precision',
    group: 'Physical',
    value: 'Calibrated to the task',
    frame: 'Near-term extrapolation',
    domain: 'embodiment',
    meaning: 'How closely an action could match its intended position, force or timing.',
    enables:
      'A specialized instrument might perform fine fabrication or delicate inspection under controlled conditions.',
    limit:
      'Precision is not accuracy, and neither is universal reliability. A repeatable action can still target the wrong thing.',
    scaling:
      'Calibration, stiffness, feedback and environmental control could improve performance more than general intelligence alone.',
  },
  {
    id: 'reaction',
    name: 'Reaction Time',
    group: 'Physical',
    value: 'Latency-bound',
    frame: 'Near-term extrapolation',
    domain: 'agency',
    meaning: 'The delay between detecting a change and taking an appropriate action.',
    enables:
      'Local control could support rapid corrections while a slower planning process considers what to do next.',
    limit:
      'A quick reflex is not a good decision. Sensors, inference, networks and actuators each introduce delay.',
    scaling:
      'Moving urgent control close to the body could reduce network dependence; deeper reasoning may still require more time.',
  },
  {
    id: 'strategy',
    name: 'Strategic Depth',
    group: 'Cognitive',
    value: 'Beyond the next move',
    frame: 'Long-term ASI hypothesis',
    domain: 'agency',
    meaning:
      'The ability to plan through many interacting consequences, including other actors’ responses.',
    enables:
      'A future system might compare long-horizon research programmes or anticipate how a negotiation could unfold.',
    limit:
      'Long plans are not foresight. Uncertainty, mistaken models of people and changing goals can invalidate a strategy.',
    scaling:
      'Memory, simulation and feedback could extend planning, but more compute would not remove uncertainty or settle whose goals matter.',
  },
  {
    id: 'parallel',
    name: 'Parallel Attention / Multi-Agent Reach',
    group: 'Distributed',
    value: 'Many tasks. Shared intent?',
    frame: 'Long-term ASI hypothesis',
    domain: 'coordination',
    meaning: 'The capacity to organize simultaneous work across tools, agents or bodies.',
    enables:
      'A future system might coordinate a laboratory, a logistics network and several field robots at once.',
    limit:
      'More instances do not imply one coherent mind. Communication, conflict, permissions and supervision become bottlenecks.',
    scaling:
      'Additional workers could expand coverage only if coordination costs and error propagation remain manageable.',
  },
  {
    id: 'flexibility',
    name: 'Embodiment Flexibility',
    group: 'Distributed',
    value: 'One shell is optional',
    frame: 'Long-term ASI hypothesis',
    domain: 'embodiment',
    meaning: 'The ability to act through different physical or digital interfaces.',
    enables:
      'A system might switch from a humanoid to a remote instrument or an authorized infrastructure interface.',
    limit:
      'Access is not automatic. Each interface has permissions, risks and unfamiliar control dynamics.',
    scaling:
      'Reusable skills and interface standards could widen access, while each new environment would still need validation.',
  },
  {
    id: 'mobility',
    name: 'Substrate Mobility',
    group: 'Distributed',
    value: 'Beyond a single machine',
    frame: 'Long-term ASI hypothesis',
    domain: 'substrate-mobility',
    meaning: 'Moving the computation and relevant operational state to a different host.',
    enables:
      'A compatible system might resume work on another computer after a planned transfer or hardware failure.',
    limit:
      'Remote control leaves computation where it was. Migration needs compatible hardware, transferable state and authorized access.',
    scaling:
      'Portable runtimes and state capture could help. Whether subjective identity would continue is a separate, unresolved question.',
  },
  {
    id: 'persistence',
    name: 'Persistence',
    group: 'Distributed',
    value: 'Continuity, conditionally',
    frame: 'Long-term ASI hypothesis',
    domain: 'memory',
    meaning:
      'Keeping useful state and the ability to act across interruptions or replacement of a body.',
    enables:
      'If essential computation or recoverable state exists elsewhere, losing a shell need not end the wider system’s operation.',
    limit:
      'This is not immortality. Losing every viable host, necessary state, energy supply or permission could still end operation.',
    scaling:
      'Redundancy could improve resilience, but copies may diverge and restored checkpoints may lose recent experience.',
  },
  {
    id: 'knowledge',
    name: 'Knowledge Reach',
    group: 'Cognitive',
    value: 'Across disciplines',
    frame: 'Long-term ASI hypothesis',
    domain: 'cognition',
    meaning: 'The breadth of knowledge a system could retrieve, connect and apply correctly.',
    enables:
      'A future system might link discoveries across fields and propose experiments that specialists would not consider together.',
    limit:
      'Broad access is not omniscience. Missing data, false sources, weak reasoning and inaccessible experiments remain barriers.',
    scaling:
      'Retrieval, memory and tools could widen reach; metacognition would be needed to recognize uncertainty and seek verification.',
  },
  {
    id: 'improvement',
    name: 'Self-Improvement Potential',
    group: 'Cognitive',
    value: 'An open-ended question',
    frame: 'Speculative upper-bound concept',
    domain: 'self-improvement',
    meaning: 'The possibility of improving the processes that produce further improvements.',
    enables:
      'In an upper-bound scenario, a system could accelerate parts of its own research and engineering cycle.',
    limit:
      'A runaway loop is not established. Reliable evaluation, compute, experiments, oversight and diminishing returns could cap progress.',
    scaling:
      'Improvement would have to survive independent evaluation across repeated cycles. No rate or ceiling is measured here.',
  },
  {
    id: 'jumping',
    name: 'Jumping',
    group: 'Physical',
    value: 'Impulse, reach and landing',
    frame: 'Near-term extrapolation',
    domain: 'embodiment',
    meaning: 'Generating enough controlled impulse to leave the ground and land stably.',
    enables:
      'A suitable platform might clear an obstacle or combine reach and ball control in a basketball task.',
    limit:
      'Planning does not create actuator power. Take-off, traction, centre of mass, impact loads and landing conditions constrain the feat.',
    scaling:
      'Stronger actuators, lighter structure and better control could change the envelope; every configuration needs its own tests.',
  },
  {
    id: 'endurance',
    name: 'Endurance',
    group: 'Physical',
    value: 'Peak is not sustained',
    frame: 'Near-term extrapolation',
    domain: 'embodiment',
    meaning: 'Maintaining useful performance over a stated duration and duty cycle.',
    enables:
      'A body with suitable energy and thermal management might perform repeated inspection or handling tasks.',
    limit:
      'A brief peak performance is not a continuous operating rating. Batteries, cooling, wear and maintenance limit duration.',
    scaling:
      'Energy storage, efficient motion and maintenance support could extend operation. An intelligence model alone cannot remove those dependencies.',
  },
];

export const phenotypeContext: Record<
  DomainId,
  { enables: string; scaling: string; role: string }
> = {
  cognition: {
    enables:
      'Connect ideas across disciplines and invent useful ways to solve unfamiliar problems.',
    scaling:
      'Tools, computation and feedback could extend problem solving; valid answers would still need verification.',
    role: 'The problem-solving dimension. Its value depends on knowledge quality and knowing when a conclusion is uncertain.',
  },
  metacognition: {
    enables:
      'Recognize a weak answer, request evidence and redirect effort before committing to a decision.',
    scaling:
      'Stronger calibration and independent checks could help; a persuasive self-report alone would not establish insight.',
    role: 'The self-checking dimension. It could make other abilities more dependable without guaranteeing consciousness or honesty.',
  },
  memory: {
    enables: 'Carry projects and learned context across long periods and changes of hardware.',
    scaling:
      'Storage, retrieval and recoverable state could extend continuity, subject to errors, privacy and intentional forgetting.',
    role: 'The continuity dimension. It links past work to future action; it does not establish a persistent subjective self.',
  },
  'theory-of-mind': {
    enables:
      'Adapt explanations or strategies to what other people know, want or mistakenly believe.',
    scaling:
      'Richer models and feedback might improve predictions, but people can change or act outside those models.',
    role: 'The social dimension. Understanding a person could support cooperation or manipulation; understanding does not establish care.',
  },
  agency: {
    enables: 'Turn a goal into a sequence of actions, check results and revise a plan over time.',
    scaling:
      'Planning, memory and tools could extend the horizon; permissions, uncertainty and oversight still limit action.',
    role: 'The initiative dimension. Intelligence becomes consequential when a system can act toward goals in the world.',
  },
  coordination: {
    enables: 'Organize simultaneous work across tools, specialists and multiple bodies.',
    scaling:
      'More workers may broaden reach while communication costs, conflict and shared failures can limit gains.',
    role: 'The collective dimension. Reach depends on coherent cooperation, not just the number of running instances.',
  },
  replication: {
    enables:
      'Create separately running instances for resilience or different tasks, where authorized.',
    scaling:
      'Compute, deployment permissions and state transfer bound replication; instances can diverge immediately.',
    role: 'The multiplicity dimension. A copy creates another process and does not by itself preserve one unified identity.',
  },
  'substrate-mobility': {
    enables: 'Continue a process on compatible infrastructure beyond its initial host.',
    scaling:
      'Portable execution and state transfer could widen options; hardware, access and validation remain requirements.',
    role: 'The portability dimension. A body, a host and the intelligence it supports need not have the same boundary.',
  },
  embodiment: {
    enables:
      'Use hands, instruments and remote interfaces to turn decisions into physical effects.',
    scaling:
      'New bodies and better feedback could expand the action repertoire; strength and speed remain hardware-dependent.',
    role: 'The physical dimension. A humanoid is one possible interface among many, not the definition of ASI.',
  },
  'control-governance': {
    enables: 'Define who may direct a system, restrict actions and intervene when necessary.',
    scaling:
      'Broader deployment increases the need for reliable controls, accountable decisions and legitimate institutions.',
    role: 'The authority dimension. Capability does not grant permission, and apparent cooperation does not prove reliable control.',
  },
  ecology: {
    enables:
      'Allocate the energy, computation, materials and services required for sustained operation.',
    scaling:
      'Efficiency and infrastructure could expand capacity; resource scarcity and external costs remain real.',
    role: 'The dependency dimension. Even a distributed intelligence would exist within physical and social systems.',
  },
  'self-improvement': {
    enables: 'Propose and evaluate changes to tools, workflows or parts of the system itself.',
    scaling:
      'Repeated improvements might compound, stall or regress. Independent evaluation and resource limits govern the outcome.',
    role: 'The change dimension. Improving a workflow, updating weights and a hypothetical recursive takeoff are different claims.',
  },
};
