export const relevantState = [
  'model/runtime reference',
  'task state',
  'working memory',
  'persistent memory',
  'plans',
  'tool state',
  'action history',
  'environment references',
  'permissions',
  'lineage information',
];
export const requirements = [
  'State available',
  'Compatible runtime',
  'Sufficient compute',
  'Required memory',
  'Valid permissions',
  'Working I/O',
];
export const failures = [
  'Missing state or an interrupted transfer can prevent a consistent restart.',
  'Incompatible hardware/runtime or insufficient compute can prevent execution.',
  'Corrupted memory and inconsistent distributed copies require validation and reconciliation.',
  'Missing credentials, inaccessible tools or invalid permissions can block authorised actions.',
  'Different sensors/actuators and environment references require adaptation; restoring state alone does not restore a body’s abilities.',
];
export const mobilityExplanations = {
  migrate:
    'Relevant operational state is transferred and execution resumes elsewhere. Whether this counts as the “same agent” is an operational and philosophical question.',
  copy: 'A second instance begins from shared state. There are now two running instances. Shared state at one moment does not guarantee future agreement.',
  fork: 'Copies sharing an earlier state can accumulate different memories, actions, and contexts. Common ancestry does not make their later histories identical.',
};
