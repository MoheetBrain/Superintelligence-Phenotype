import type { DomainId } from './schema';
export const illustrationIds = ['strength', 'precision', 'execution'] as const;
export type IllustrationId = (typeof illustrationIds)[number];
export const executionModes = ['remote', 'migration', 'copy'] as const;
export type ExecutionMode = (typeof executionModes)[number];
export const strengthTasks = [
  {
    id: 'shelf',
    name: 'Place a box on a shelf',
    focus: ['self-improvement', 'embodiment', 'substrate-mobility'],
    detail:
      'The arms supply joint torque, the grasp keeps the box secure, and the stance resists tipping. Raising the box changes leverage and the centre of mass. Payload mass alone cannot specify the required force or joint torque.',
    variables:
      'Box mass and grip surface · shelf height · reach · actuator torque · support polygon',
  },
  {
    id: 'carry',
    name: 'Carry an awkward load',
    focus: ['embodiment', 'self-improvement', 'ecology'],
    detail:
      'A load held away from the body can demand greater joint torque than the same mass held close. Secure contact, balance and a clear route matter. Heat and available energy determine whether the action can be sustained.',
    variables: 'Load geometry · grip friction · leverage · terrain · heat · duration',
  },
  {
    id: 'basketball',
    name: 'Reach for a basketball finish',
    focus: ['substrate-mobility', 'embodiment', 'agency'],
    detail:
      'A successful finish would combine reach, jump impulse, perception, trajectory planning and ball control. Landing stability matters too. Intelligence cannot supply missing actuator power or guarantee a basket.',
    variables:
      'Standing reach · take-off impulse · traction · ball handling · rim position · safe landing',
  },
] as const;
export const precisionSteps = [
  {
    name: 'Sensing',
    domain: 'embodiment',
    text: 'Sensors sample the object and contact. Noise, lighting, calibration and occlusion determine what can actually be observed.',
  },
  {
    name: 'Estimation',
    domain: 'cognition',
    text: 'An estimator combines observations into a belief about position and uncertainty. A repeatable sensor bias can still place that belief in the wrong location.',
  },
  {
    name: 'Planning',
    domain: 'agency',
    text: 'The controller chooses a target, path and acceptable error. It should account for obstacles, uncertainty and the consequences of contact.',
  },
  {
    name: 'Actuation',
    domain: 'self-improvement',
    text: 'Motors and transmissions turn a command into movement. Backlash, compliance, torque limits and delays can change the result.',
  },
  {
    name: 'Correction',
    domain: 'metacognition',
    text: 'New observations reveal the remaining error. The loop revises the next command or stops if uncertainty is too high. More repeats do not automatically eliminate systematic error.',
  },
] as const;
export function mechanicalContext(
  profile: string | null,
  illustration: IllustrationId | null,
  example: string,
  step: number,
): DomainId[] {
  if (illustration === 'strength')
    return [...(strengthTasks.find((t) => t.id === example) ?? strengthTasks[0]).focus];
  if (illustration === 'precision') return [precisionSteps[step % 5].domain];
  if (profile === 'speed' || profile === 'jumping') return ['substrate-mobility', 'embodiment'];
  if (profile === 'strength') return ['self-improvement', 'embodiment', 'substrate-mobility'];
  if (profile === 'precision' || profile === 'dexterity') return ['embodiment', 'self-improvement'];
  if (profile === 'endurance') return ['ecology', 'substrate-mobility'];
  if (profile === 'reaction') return ['cognition', 'agency', 'embodiment'];
  return [];
}

/** Discrete educational states, not an execution engine or physical simulation. */
export function executionSnapshot(
  mode: ExecutionMode,
  step: number,
  body: boolean,
  recovery: boolean,
) {
  const usable = recovery;
  const source = usable && (mode !== 'migration' || step === 0);
  const destination = usable && mode !== 'remote' && step === 2;
  const phase =
    mode === 'remote'
      ? 'Host A runs the controller'
      : mode === 'migration'
        ? ['Source running', 'Source stopped · state transfer', 'Destination resumes'][step]
        : ['One source instance', 'Copy state to Host B', 'Two running instances'][step];
  const detail = !usable
    ? 'Execution cannot continue here: available computation or recoverable state and compatible authorised resources are missing. The illustration does not invent a replacement host or reconstruct lost state.'
    : mode === 'remote'
      ? 'Computation stays on Host A. Commands travel to the robot; observations return to the same host. No controller migrates into the body.'
      : mode === 'migration'
        ? [
            'Host A executes while an authorised destination is prepared. Compatible software, credentials and dependencies must be checked before cutover.',
            'Host A stops accepting work. A consistent checkpoint and final updates transfer to Host B; neither host executes the task during this illustrated pause.',
            'Host B resumes from verified state. Host A remains stopped. Reconciliation of interrupted operations is required to avoid duplicate effects.',
          ][step]
        : [
            'Host A is the only running instance. A copy must specify model parameters, retained records and relevant task state.',
            'State is copied to the authorised Host B while Host A continues. Stored state on B is not yet a running agent.',
            'Host A and Host B both run. Different observations produce diverging states and commitments; shared ancestry does not make them one unified mind.',
          ][step];
  return {
    source,
    destination,
    phase: usable ? phase : 'Required resources unavailable',
    detail,
    bodyStatus: body
      ? 'Body available for authorised actions.'
      : 'Body unavailable. Physical actions stop; continuity still depends on usable hosts, retained state and a working recovery process.',
    sourceLabel: source
      ? mode === 'copy' && step === 2
        ? 'A runs · state α'
        : 'A runs'
      : 'A stopped',
    destinationLabel: destination
      ? mode === 'copy'
        ? 'B runs · state β'
        : 'B runs'
      : usable && step === 1
        ? 'B · checkpoint'
        : 'B idle',
  };
}
