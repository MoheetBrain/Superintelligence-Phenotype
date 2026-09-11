import type { DomainId } from './schema';
interface TopicDetail {
  name?: string;
  explanation: string;
  related: DomainId[];
}
export interface Dossier {
  mechanism: string;
  prerequisites: string;
  limits: string;
  scenario: string;
  question: string;
  topics: TopicDetail[];
}
/** Editorial explanations and explicitly hypothetical worked scenarios.
 * These are not empirical claims; evidence lives in capabilities.ts. */
export const dossiers: Record<DomainId, Dossier> = {
  cognition: {
    mechanism:
      'A useful reasoning system would combine retrieved knowledge, candidate explanations and predictions. It could move between mathematical models, language and experiments, asking which observation would change its conclusion. A world model is useful when it helps anticipate consequences; it need not reconstruct every detail of reality.',
    prerequisites:
      'It would require access to relevant observations, reliable tools, representations that transfer between domains, and a way to notice unfamiliar conditions. Access to private, unrecorded or future events cannot be created by reasoning alone.',
    limits:
      'Incomplete observations can leave several explanations equally plausible. Computation, noisy data and misleading premises constrain the answer. Expertise on familiar tasks may fail when a new problem has different causal structure.',
    scenario:
      'Imagine a greenhouse whose plants suddenly wilt. The system compares heat stress, irrigation failure and disease, then requests a moisture reading before recommending treatment. If that reading conflicts with the sensor log, it tests the sensor itself. Success means choosing a useful next observation and revising the explanation, not producing the longest answer.',
    question:
      'Can a system recognise when a successful model has stopped applying, before an expensive failure supplies the lesson?',
    topics: [
      {
        explanation:
          'A chain of plausible sentences can contain an invalid step. Reasoning compares assumptions, derives consequences and tests alternatives. In the greenhouse example, heat and a blocked water line may predict similar symptoms; a useful argument identifies a test that separates them.',
        related: ['metacognition', 'agency'],
      },
      {
        explanation:
          'A world model represents relationships that support prediction and action. It may be a simulation, a learned representation or a compact causal diagram. Its value depends on which interventions it predicts correctly, especially when conditions differ from the data used to build it.',
        related: ['embodiment', 'memory'],
      },
      {
        explanation:
          'An intelligent observer still has blind spots. A weather sensor samples one place at one time; a document may omit a decisive event. Observation coverage asks what was sampled, what was missed and whether a new measurement would resolve the uncertainty.',
        related: ['embodiment', 'ecology'],
      },
      {
        name: 'Cross-domain transfer',
        explanation:
          'Transfer uses a useful structure from one problem in another: a bottleneck in a factory may resemble congestion in a computer network. The analogy is a starting hypothesis. Different constraints, objectives or feedback can make the apparently familiar solution fail.',
        related: ['self-improvement', 'metacognition'],
      },
      {
        name: 'Knowledge without omniscience',
        explanation:
          'Knowledge must be current, relevant and supported. A huge archive can contain mutually inconsistent records, and some facts were never recorded. A capable system would distinguish what it remembers, what it infers and what nobody can establish from the available observations.',
        related: ['memory', 'theory-of-mind'],
      },
    ],
  },
  metacognition: {
    mechanism:
      'Monitoring would link an answer to evidence about its reliability: alternative solutions, tool checks, error patterns or an independent verifier. A checking policy could spend effort where it is likely to change a decision. This differs from merely generating a confident-sounding explanation of its own reasoning.',
    prerequisites:
      'Useful monitoring requires feedback about actual correctness, a cost for mistakes and checks, and tests beyond familiar examples. The system must be able to abstain, gather information or ask a competent reviewer when confidence is insufficient.',
    limits:
      'A checker can share the same blind spot as the generator. Confidence learned on one task distribution can become misleading elsewhere. An explanation of an internal process is not direct access to everything that caused an answer.',
    scenario:
      'Consider a bridge-design assistant comparing two calculations. It notices that both rely on the same uncertain load assumption. Instead of repeating the arithmetic, it requests the missing specification and withholds the recommendation. After receiving it, the assistant recomputes the result and records why its confidence changed.',
    question:
      'How can a system identify novel errors when neither its confidence model nor its usual checker has encountered them?',
    topics: [
      {
        explanation:
          'Calibration compares stated confidence with observed correctness across a defined set of cases. It is a property of predictions under an evaluation, not a personality trait. A system can be well calibrated while often uncertain, or highly accurate while overconfident about its rare mistakes.',
        related: ['cognition', 'self-improvement'],
      },
      {
        explanation:
          'Detecting an error means finding a reason to distrust a result before relying on it. Consistency checks, executable tests and independent measurements offer different signals. Agreement between repeated outputs is weak reassurance if every attempt inherits the same faulty premise.',
        related: ['cognition', 'coordination'],
      },
      {
        explanation:
          'Checking consumes time and compute. Allocation asks whether to verify a calculation, inspect a source or gather a new observation. A sensible policy considers the chance of changing the answer and the consequence of being wrong, rather than checking every detail equally.',
        related: ['ecology', 'agency'],
      },
      {
        name: 'Asking for information',
        explanation:
          'Sometimes the best next action is a question. The system should identify exactly which missing fact would distinguish competing answers, and who or what can supply it. Asking vague questions indefinitely is not a substitute for making progress with the information available.',
        related: ['theory-of-mind', 'embodiment'],
      },
      {
        name: 'Abstention and escalation',
        explanation:
          'A useful boundary is operational: pause a consequential action, explain the unresolved issue and route it to an authorised reviewer. Abstention quality includes whether it catches dangerous uncertainty without refusing routine cases that the system can reliably handle.',
        related: ['control-governance', 'agency'],
      },
    ],
  },
  memory: {
    mechanism:
      'Working state holds the current problem; persistent records retain information between runs; retrieval brings selected records back into use. A coherent system would attach provenance, time and status to those records, then reconcile them with new observations before treating them as instructions or facts.',
    prerequisites:
      'Continuity needs durable storage, meaningful identifiers, versioned checkpoints and an explicit record of completed actions. It also needs permission to retain and retrieve information, plus procedures for correction, deletion and recovery from damaged records.',
    limits:
      'Keeping everything can make retrieval harder and preserve falsehoods. Old facts may become stale. A restored checkpoint can repeat an action unless the external world and action log are reconciled. Retained information alone does not establish personal identity.',
    scenario:
      'An assistant resumes a multi-week materials study after a power failure. It reads the checkpoint, checks instrument logs, and discovers that an experiment completed after the last save. It records the result instead of ordering a duplicate run, marks an outdated sample label as corrected and resumes the remaining work.',
    question:
      'What is the smallest recoverable state that preserves useful commitments without retaining unnecessary or misleading personal information?',
    topics: [
      {
        explanation:
          'Retrieval is selective access, not just storage capacity. A useful memory search finds the right version of a record and exposes its source. A result with matching words can still describe the wrong project, time period or individual, so relevance needs contextual checks.',
        related: ['cognition', 'theory-of-mind'],
      },
      {
        explanation:
          'A commitment includes an intended action, responsible party, deadline or trigger, and conditions for revision. Remembering that a promise was discussed differs from knowing it was accepted. Structured status helps prevent a hypothetical plan from becoming an unauthorised task.',
        related: ['agency', 'control-governance'],
      },
      {
        explanation:
          'Recovery reconstructs where execution stopped and what already affected the world. A checkpoint alone may lag behind a payment, message or physical action. Reconciliation and operations designed to tolerate retries help prevent the restored process from repeating consequential work.',
        related: ['substrate-mobility', 'agency'],
      },
      {
        name: 'Working state and persistent records',
        explanation:
          'Working state tracks what matters now; an archive spans many tasks and times. Moving information between them requires selection. A compact summary may omit a crucial qualification, while replaying an entire history may overwhelm the context available for the present decision.',
        related: ['cognition', 'ecology'],
      },
      {
        name: 'Forgetting and corrupted information',
        explanation:
          'Forgetting can be deliberate maintenance: expire stale claims, remove unauthorised data and keep corrections attached to earlier versions. Corruption requires detection and recovery. A copied false record is still false, even when many instances confidently retrieve it.',
        related: ['replication', 'control-governance'],
      },
    ],
  },
  'theory-of-mind': {
    mechanism:
      'A system could maintain alternative models of what another actor knows, wants and expects. It would update those models from statements, behaviour and information access, while keeping its own knowledge separate. Predictions concern observable decisions; they do not provide direct access to another person’s private experience.',
    prerequisites:
      'Useful modelling needs relevant context, explicit uncertainty, and sensitivity to language and social setting. The actor must have a way to correct the system’s assumptions. Permission to act on another person’s behalf remains a separate requirement.',
    limits:
      'The same behaviour can arise from different motives. Cultural differences, strategic behaviour and missing context make interpretation fragile. A model that predicts a person well can still misunderstand their values or fail on a new situation.',
    scenario:
      'Two researchers disagree about whether a sample is safe to handle. The assistant notices that only one has received the latest contamination report. It shares the authorised report, checks their understanding and revises its prediction of the disagreement. It does not label either person irrational merely because their initial decisions differ.',
    question:
      'How can evaluation distinguish tracking another actor’s information from memorising familiar patterns in social stories?',
    topics: [
      {
        explanation:
          'A belief model represents what an actor may take to be true, including mistaken beliefs. The system should not silently substitute its own facts. Tracking who saw a changed label, for example, can explain why two equally capable people choose different containers.',
        related: ['memory', 'cognition'],
      },
      {
        explanation:
          'Intentions connect possible goals to actions, but observed movement is ambiguous. Someone reaching for a switch might be turning equipment on, testing it or stopping it. A useful model maintains alternatives until context or a direct question resolves the difference.',
        related: ['agency', 'metacognition'],
      },
      {
        explanation:
          'Perspective revision updates a model when someone learns, forgets or behaves unexpectedly. Maintain uncertainty when several explanations fit. A good forecast identifies which new information would change it, and avoids turning statistical tendencies into fixed judgments about an individual.',
        related: ['metacognition', 'coordination'],
      },
      {
        name: 'Different information access',
        explanation:
          'People and agents receive different observations at different times. A shared workspace does not guarantee shared knowledge. Recording which update reached which participant helps explain disagreement, coordinate handoffs and decide whether to inform someone before asking them to act.',
        related: ['coordination', 'memory'],
      },
      {
        name: 'Perspective and consent',
        explanation:
          'Understanding a likely preference does not grant authority to fulfil it. An assistant may infer that someone wants an appointment moved while still needing their permission. Perspective-taking supports clearer requests and explanations; decision rights determine what action is allowed.',
        related: ['control-governance', 'agency'],
      },
    ],
  },
  agency: {
    mechanism:
      'An agent would turn a goal into a sequence of decisions, invoke tools, observe outcomes and revise its plan. Long tasks need explicit state and stopping conditions so that progress can be checked. The operational loop links intention to consequences through an interface with defined permissions.',
    prerequisites:
      'Reliable action requires dependable tools, current observations, delegated authority and a way to detect partial failures. The agent must know which decisions it may take alone, which require review, and how to pause or reverse a mistaken step.',
    limits:
      'A plan can become obsolete while it is executing. Tool success messages may conceal an incomplete result, and locally sensible actions can conflict with the larger objective. More persistence can amplify a wrong goal unless feedback changes the plan.',
    scenario:
      'A future assistant coordinates a replacement component for a laboratory. It checks compatibility, requests approval for the purchase, tracks delivery and schedules installation. When the supplier changes the part, it reopens the compatibility check instead of continuing from a stale plan. The owner can cancel the remaining work at any stage.',
    question:
      'How should an agent recognise that changed circumstances require revisiting the goal rather than simply repairing the next step?',
    topics: [
      {
        explanation:
          'Planning compares paths to a goal under constraints. A useful plan identifies dependencies, uncertain steps and fallback routes. It is a revisable prediction about actions, not a guarantee that the world will follow the sequence written at the start.',
        related: ['cognition', 'ecology'],
      },
      {
        explanation:
          'Delegated authority defines the actions a system may perform for someone else. Access to a tool is only one boundary; spending limits, purpose, affected people and review requirements also matter. A technically executable operation may still fall outside the current mandate.',
        related: ['control-governance', 'theory-of-mind'],
      },
      {
        explanation:
          'Goal revision asks whether a changed plan still serves the authorised objective. New observations may require different steps, while a changed purpose requires renewed authority. Keep revisions explicit so that repairing a local failure does not silently become pursuing a different goal.',
        related: ['memory', 'metacognition'],
      },
      {
        name: 'Tools and observations',
        explanation:
          'Tools extend action and perception: querying a database differs from changing it. Tool outputs need interpretation, provenance and error handling. A returned success code is evidence about an operation, but the actual task outcome may require a separate observation.',
        related: ['embodiment', 'cognition'],
      },
      {
        name: 'Changing goals and long tasks',
        explanation:
          'A long-running task spans changes in priorities, permissions and facts. The system should keep the accepted goal and its revisions explicit. A newly received suggestion is not automatically an instruction from the owner, and completed steps should remain distinguishable from future commitments.',
        related: ['memory', 'control-governance'],
      },
    ],
  },
  coordination: {
    mechanism:
      'Several agents could divide a problem, exchange results and combine them into a shared outcome. Coordination involves task assignment, communication protocols and reconciliation when participants disagree. Shared memory can reduce repeated work, but its entries still need ownership, versioning and evidence.',
    prerequisites:
      'A collective needs interfaces that participants understand, a way to resolve conflicts and visibility into task status. Independent checking requires some diversity of observations or methods. Communication and shared infrastructure must remain available at the scale being attempted.',
    limits:
      'Adding agents also adds messages, waiting and integration work. Agents trained or prompted similarly can make correlated errors. A shared mistake may spread faster than a correction, and a central coordinator can become a bottleneck or single point of failure.',
    scenario:
      'A future research team assigns literature review, experiment design and statistical criticism to different agents. The critic flags a shared assumption copied from an early note. The team returns to the source and changes the experiment before collecting data. The gain comes from useful division and correction, not from counting how many agents participated.',
    question:
      'At what task size does additional useful work exceed the communication and verification cost of another participant?',
    topics: [
      {
        explanation:
          'Division of labour separates tasks with clear inputs and outputs. It helps when subtasks can proceed independently and integrate cleanly. Splitting a tightly coupled argument may instead create repeated explanations, hidden assumptions and results that do not fit together.',
        related: ['agency', 'cognition'],
      },
      {
        explanation:
          'Shared state records observations, decisions and progress that participants need to coordinate. Message volume is not shared understanding. Explicit versions and acknowledgments distinguish a received update from an update incorporated into work. Concurrent changes need reconciliation so that local plans do not silently conflict.',
        related: ['memory', 'theory-of-mind'],
      },
      {
        explanation:
          'Collective checking asks whether multiple contributions improve reliability. Independent methods can reveal different failure modes; identical prompts to similar systems may produce reassuring agreement around the same error. Evaluate the combined result against a resource-matched single-agent baseline.',
        related: ['metacognition', 'self-improvement'],
      },
      {
        name: 'Communication and conflict',
        explanation:
          'A shared record needs rules for concurrent changes. If two agents update the same plan, the collective must decide which version is authoritative and preserve useful dissent. Silent overwrites can make each participant act rationally on incompatible state.',
        related: ['memory', 'control-governance'],
      },
      {
        name: 'Coordination costs',
        explanation:
          'Every handoff has a cost: transmission, explanation, delay and review. More parallelism can shorten independent work while lengthening integration. Measure useful completed work and failure recovery at equal total resources, including the compute spent coordinating the agents themselves.',
        related: ['ecology', 'agency'],
      },
    ],
  },
  replication: {
    mechanism:
      'Replication creates another instance from specified code, model parameters and selected state. A lineage record can describe what was inherited and what changed. Evolution would additionally require variation, some differential continuation or reproduction, and inheritance of the differences affecting that process.',
    prerequisites:
      'Copying needs compatible execution resources, permission, a sufficiently complete starting state and a way to identify the new instance. An evolutionary process also needs an explicit selection environment and a record linking outcomes to heritable differences.',
    limits:
      'Two initial copies may diverge as soon as their observations differ. More copies can reproduce the same weakness and compete for scarce resources. Choosing a successful variant on one benchmark can reward shortcuts that do not generalise outside the selection setting.',
    scenario:
      'A research group tests three authorised variants of a planning system in a local sandbox. Each starts from the same checkpoint but receives a documented change. The group retains a variant only after independent tests and records its ancestry. Running unchanged copies for extra capacity would be replication without demonstrating an evolutionary improvement process.',
    question:
      'Which improvements persist across new tasks, and which merely exploit the environment used to choose the successor?',
    topics: [
      {
        explanation:
          'A copy must specify its contents. Model weights alone omit transient goals, tool sessions and memory; a full disk image may still omit external services. Two runnable instances need separate identifiers and permissions even if they begin with identical computational state.',
        related: ['substrate-mobility', 'memory'],
      },
      {
        explanation:
          'Variation is a difference among instances that can affect outcomes. It might involve code, parameters or inherited records. A different random output is not automatically an inherited trait, and an undocumented change makes it difficult to connect performance to a cause.',
        related: ['self-improvement', 'cognition'],
      },
      {
        explanation:
          'Selection changes which variants continue or produce successors according to some process. Faster copying alone does not establish evolution. The selection criterion matters: rewarding a narrow score can favour brittle strategies, while uncontrolled resource competition can undermine the intended task.',
        related: ['ecology', 'control-governance'],
      },
      {
        name: 'Lineage and inheritance',
        explanation:
          'Lineage connects an instance to its predecessors and records what passed between them. It supports comparison, rollback and responsibility for changes. Inheritance should distinguish persistent modifications from temporary task state that was never intended to shape later generations.',
        related: ['memory', 'self-improvement'],
      },
      {
        name: 'Diverging copies',
        explanation:
          'Copies that see different events accumulate different memories and commitments. They can later exchange information, but merging conflicting state requires a rule. Shared ancestry does not mean the instances remain interchangeable or constitute a single continuing subjective identity.',
        related: ['coordination', 'substrate-mobility'],
      },
    ],
  },
  'substrate-mobility': {
    mechanism:
      'Operational migration would save relevant state, transfer it to an authorised compatible host, check integrity and resume execution there. A handoff protocol must identify when the source stops accepting work and when the destination becomes authoritative. Remote control and copying follow different execution patterns.',
    prerequisites:
      'The destination needs adequate computation, storage, software support, credentials and reachable dependencies. Recoverable state must exist and be sufficiently recent. A tested recovery process must reconcile interrupted operations rather than assuming that moving files recreates a working system.',
    limits:
      'Lost credentials, incompatible hardware, unavailable services or corrupted checkpoints can prevent recovery. State held only in a failed body may be lost. An available backup does not guarantee immediate service or preservation of every recent commitment, and operational continuity does not settle personal identity.',
    scenario:
      'An inspection robot loses power while its controller remains on a remote host. That controller can retain its task state, but it cannot inspect the site through the unavailable body. If computation was instead local, an authorised replacement host could resume only from recoverable state and after reconciling what the robot already did.',
    question:
      'Which state and dependencies must survive for a particular service to resume acceptably, and how much interruption is tolerable?',
    topics: [
      {
        explanation:
          'Compatibility concerns the entire execution environment: instructions, libraries, memory, accelerators and external services. A host may store a checkpoint without being able to run it. Authorisation and credentials must also be valid at the destination; technical compatibility cannot substitute for permission.',
        related: ['memory', 'agency'],
      },
      {
        explanation:
          'State transfer includes more than a model file: active tasks, retained records, configuration and unresolved operations may matter. A transfer should define a consistent checkpoint. Otherwise the destination may combine a recent plan with an old log and repeat actions that already occurred.',
        related: ['ecology', 'control-governance'],
      },
      {
        explanation:
          'A migration protocol must decide which host owns new work during the handoff. It may pause the source, transfer final updates and resume the destination. If both keep acting without reconciliation, the system risks duplicate effects and conflicting commitments.',
        related: ['memory', 'replication'],
      },
      {
        name: 'Operational continuity',
        explanation:
          'Continuity needs a chosen operational test: retained commitments, restored service or acceptable interruption. These criteria can be evaluated without claiming a conscious self travelled between machines. A successful restart may preserve some records while losing recent observations or interactive sessions.',
        related: ['coordination', 'agency'],
      },
      {
        name: 'Recovery versus copying',
        explanation:
          'Recovery restores a service after interruption; copying creates another instance that can continue alongside the source. A stored checkpoint is a potential recovery input, not an active agent. Restoring it requires working resources, appropriate access and an explicit recovery procedure.',
        related: ['replication', 'ecology'],
      },
    ],
  },
  embodiment: {
    mechanism:
      'An embodied system closes a loop between sensing, estimating the environment, choosing an action and observing its consequences. The body supplies the sensors and actuators through which intelligence affects the world. Different bodies expose different actions, observations and failure modes, even with the same controller.',
    prerequisites:
      'Physical action requires calibrated sensors, sufficient actuator force and torque, stable power, reliable communication and appropriate contact with the environment. The controller must respect the body’s geometry and dynamics and be able to detect when an intended movement did not occur.',
    limits:
      'Strength depends on load geometry and joint leverage; speed depends on traction and stability. Accuracy differs from repeatability, and a fast inference is only one part of sensor-to-actuator latency. Heat and stored energy separate a brief peak from sustained performance.',
    scenario:
      'Imagine placing a fragile container on a high shelf. The system estimates the shelf edge, chooses a stable stance, grasps the container and corrects its path from new observations. A heavier container, slippery surface or delayed sensor can defeat the same plan. Success depends on intelligence, body hardware and task conditions together.',
    question:
      'How well can a controller detect and adapt to a body whose friction, calibration or available power has changed?',
    topics: [
      {
        explanation:
          'Sensors sample particular signals within a range, field of view and time interval. A camera can miss a hidden contact; force sensing can detect contact without identifying the object. Combining sensors requires calibration and a model of their noise and delays.',
        related: ['cognition', 'metacognition'],
      },
      {
        explanation:
          'Actuators convert commands into physical work. Available joint torque, speed, gearing and thermal limits constrain a movement. Payload mass is not a force or torque specification: the same mass held farther from a joint can require a substantially different effort.',
        related: ['ecology', 'agency'],
      },
      {
        explanation:
          'A feedback loop measures the consequence of movement and adjusts the next command. Its response includes sampling, transmission, inference, control and mechanical motion. Improving one stage may not improve the total if another stage dominates the delay or limits stability.',
        related: ['metacognition', 'agency'],
      },
      {
        name: 'Movement and manipulation',
        explanation:
          'Moving a body and manipulating an object share constraints of contact and balance. Grasp friction, reachable configurations and landing stability matter alongside planning. A basketball finish, for example, combines reach, impulse and ball control; reasoning alone cannot supply missing mechanical capability.',
        related: ['agency', 'ecology'],
      },
      {
        name: 'Different bodies and interfaces',
        explanation:
          'A controller might use a wheeled platform, arm or software interface. Transferring between them requires new action mappings and feedback, not just a change in appearance. Remote computation can remain available when a body fails while losing all ability to act through that body.',
        related: ['substrate-mobility', 'control-governance'],
      },
    ],
  },
  'control-governance': {
    mechanism:
      'Control combines mechanisms that constrain execution with institutions that decide who may use them. Permissions can limit tools and resources; monitoring can detect departures; an intervention path can pause or stop work. Governance assigns authority, records decisions and establishes accountability for consequences.',
    prerequisites:
      'Effective oversight needs clear owners, enforceable boundaries, observable actions and an intervention route independent enough to remain useful during failure. People need timely information and the ability to exercise their decision rights, not merely a nominal approval button.',
    limits:
      'A shutdown switch may not control every connected service or copy. Ownership of equipment does not settle authority over affected people. Logs can be incomplete, and oversight may fail if reviewers lack time, expertise or access to the relevant state.',
    scenario:
      'A laboratory delegates scheduling to an agent but reserves purchases and physical access for named operators. When an instrument behaves unexpectedly, an operator pauses new commands, preserves the action log and checks related services. The incident review distinguishes a controller defect, an unclear policy and an action that exceeded the granted permission.',
    question:
      'Can an authorised person intervene reliably when the system’s execution spans multiple organisations and dependent services?',
    topics: [
      {
        explanation:
          'Technical intervention changes what a system can do: pause execution, revoke credentials or block an actuator. Its scope must be tested. Stopping one interface may leave a remote host or queued operation active, so a visible stop button is not sufficient evidence of effective control.',
        related: ['agency', 'substrate-mobility'],
      },
      {
        explanation:
          'Authority answers who may decide, on whose behalf and under what limits. Ownership, operation and responsibility can belong to different parties. A permission should encode the purpose and scope of an action rather than treating possession of a credential as unrestricted approval.',
        related: ['theory-of-mind', 'agency'],
      },
      {
        explanation:
          'Accountability links decisions and effects to responsible actors and review processes. It requires usable records of instructions, changes and interventions. Logging everything without an owner who can interpret and act on the record can create documentation without effective accountability.',
        related: ['memory', 'coordination'],
      },
      {
        name: 'Permissions and dependencies',
        explanation:
          'A system may depend on external storage, communication and execution services. Revoking one permission can leave other paths open or break recovery. Map the dependencies, identify who controls them and test how restricted operation behaves when a service is unavailable.',
        related: ['ecology', 'substrate-mobility'],
      },
      {
        name: 'Effective oversight',
        explanation:
          'Decision rights specify what an operator, owner, reviewer or affected person can approve, stop or contest. Good interfaces expose the consequential choice and relevant evidence. Oversight must also account for workload, so reviewers can meaningfully assess the requests routed to them.',
        related: ['metacognition', 'theory-of-mind'],
      },
    ],
  },
  ecology: {
    mechanism:
      'A deployed intelligence would sit within a resource system: compute executes work, energy powers equipment, hardware supplies capacity and networks move data. A population of agents also creates demand for storage, communication and maintenance. Allocation decisions shape which capabilities can operate, for how long and for whom.',
    prerequisites:
      'Sustained operation requires provisioning, cooling, replacement parts, bandwidth and people or systems that maintain those services. A useful resource account includes external providers and coordination overhead, not just the inference cost visible at one interface.',
    limits:
      'Resources can become bottlenecks or fail together. More computation does not repair missing observations or a mistaken objective. Competition can increase costs and concentrate access; cooperation also has communication and governance requirements. Physical supply cannot be assumed to scale instantly with software demand.',
    scenario:
      'An organisation considers running several research agents continuously. It budgets inference, experiments, shared storage and review time, then discovers that instrument access is the bottleneck. Adding agents produces longer queues rather than more validated findings. A better schedule and selective checking improve useful throughput within the same laboratory capacity.',
    question:
      'Which bottleneck limits useful work after improvements to the model, and who supplies the resources needed to remove it?',
    topics: [
      {
        explanation:
          'Resource demand is task-specific. A short text answer, long search and physical experiment consume different mixes of compute, energy and time. Report what is included in an account and distinguish instantaneous power demand from total energy used over a run.',
        related: ['agency', 'embodiment'],
      },
      {
        explanation:
          'Dependencies include infrastructure the agent does not own or directly control. A cloud service, chip supply, network link or human reviewer can determine availability. Understanding the dependency chain helps distinguish an apparently autonomous interface from the provisioning that keeps it running.',
        related: ['control-governance', 'substrate-mobility'],
      },
      {
        explanation:
          'Population effects arise when many instances share finite resources. Copies can compete for bandwidth, tasks and attention, or cooperate through scheduling. Outcomes depend on allocation rules and incentives; population growth alone does not imply greater collective capability or stable coexistence.',
        related: ['replication', 'coordination'],
      },
      {
        name: 'Hardware and bandwidth',
        explanation:
          'Execution needs suitable hardware and enough communication capacity for its task. Transferring large state can take longer than local computation, while a fast network cannot replace unavailable memory or accelerators. Evaluate the complete arrangement rather than a single advertised component rate.',
        related: ['substrate-mobility', 'embodiment'],
      },
      {
        name: 'Competition and cooperation',
        explanation:
          'Agents sharing infrastructure can reserve resources, exchange useful results or duplicate one another’s work. Cooperation needs trust and coordination; competition may reward wasteful behaviour under poor incentives. Compare useful outcomes alongside total cost, resource concentration and the consequences for other users.',
        related: ['coordination', 'control-governance'],
      },
    ],
  },
  'self-improvement': {
    mechanism:
      'A research system could propose changes to algorithms, training data, tools or its own workflow, then test candidates and help produce a successor. A recursive improvement loop requires the validated successor to improve the subsequent research process. Generating suggestions is only the first part of that chain.',
    prerequisites:
      'The loop needs reliable evaluations, access to implementation and training resources, reproducible experiments and authority to introduce a successor. Independent checks must distinguish real gains from benchmark leakage, extra compute or changes that only optimise the chosen test.',
    limits:
      'Each cycle can face diminishing returns and new bottlenecks. Training, engineering, testing and deployment impose delays. A better task solver may be no better at research, and changes that help one objective can degrade reliability or increase operating cost elsewhere.',
    scenario:
      'A future research agent proposes a more efficient retrieval method. Engineers implement it in a sandbox, compare it with fixed-resource baselines and check unfamiliar tasks. Only a validated candidate becomes a successor. A later cycle then tests whether that successor discovers better improvements faster, rather than assuming a benchmark gain guarantees acceleration.',
    question:
      'Do successive validated improvements raise research productivity after the full costs and delays of each cycle are counted?',
    topics: [
      {
        explanation:
          'A proposal specifies a change, a predicted benefit and a way to test it. Novel-sounding ideas may be infeasible or already known. Research capability includes finding informative failures and choosing experiments that discriminate among candidate mechanisms within a limited budget.',
        related: ['cognition', 'metacognition'],
      },
      {
        explanation:
          'A successor is validated only relative to explicit objectives and tests. Hold out new tasks, compare equal resource budgets and check regressions. A higher aggregate score can conceal a severe loss in a consequential area, so promotion requires more than selecting the best headline number.',
        related: ['control-governance', 'replication'],
      },
      {
        explanation:
          'Feedback becomes recursive when a gain improves the next round of research. Implementation and evaluation delays determine how rapidly the loop can run. A faster idea generator has little effect if experiments, training or independent review dominate the cycle time.',
        related: ['ecology', 'coordination'],
      },
      {
        name: 'Diminishing returns',
        explanation:
          'Early changes may remove obvious inefficiencies; later gains may require much greater effort. Improving one component can expose a different bottleneck. Plot useful gains against full resources and elapsed time before extrapolating a short sequence into continued acceleration.',
        related: ['ecology', 'metacognition'],
      },
      {
        name: 'Implementation and rollback',
        explanation:
          'A promising modification must survive integration with existing tools, data and controls. Versioned experiments and recoverable releases help separate research from adoption. If a successor fails outside the test setting, a workable rollback path matters as much as a record-breaking local result.',
        related: ['memory', 'control-governance'],
      },
    ],
  },
};
