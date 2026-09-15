"""Reproduce the portfolio's conditional sensitivity analysis.

Usage: python scripts/research-sensitivity.py /path/to/ASI-Arrival-Calculator
Requires that project's public dependencies. No network calls or source edits.
"""
import copy
import importlib.metadata
import json
from pathlib import Path
import subprocess
import sys

import yaml

SOURCE_COMMIT = 'a33ad3e9bf798580907ea39d21a93cb523f40a46'
source = Path(sys.argv[1]).resolve()
assert subprocess.check_output(['git', '-C', str(source), 'rev-parse', 'HEAD'], text=True).strip() == SOURCE_COMMIT, 'Use the documented source revision.'
assert not subprocess.check_output(['git', '-C', str(source), 'status', '--porcelain', '--untracked-files=no'], text=True).strip(), 'Source checkout must be clean.'
sys.path.insert(0, str(source / 'src'))
from asi_forecast.monte_carlo import simulate_forecast
from asi_forecast.analyze import summarize_arrivals, batch_means_convergence
from asi_forecast.drivers import combined_sensitivity

root = Path(__file__).resolve().parents[1]
output = root / 'public' / 'research'
output.mkdir(parents=True, exist_ok=True)
base = yaml.safe_load((source / 'forecast_inputs/base_forecast_inputs.yaml').read_text())
scenarios = [('baseline', 'Published input set', 'Original fast-takeoff inputs, unchanged.', copy.deepcopy(base))]
slower = copy.deepcopy(base)
for key in ['ai_rnd_automation_lag_after_agi_months', 'superhuman_ai_researcher_lag_months', 'takeoff_lag_months']:
    for parameter in ['low', 'mode', 'high', 'mean', 'std']:
        if parameter in slower['asi_stage'][key]:
            slower['asi_stage'][key][parameter] *= 2
scenarios.append(('double-cognitive-lags', '2× cognitive lags', 'Double low, mode, high, mean and standard deviation for all three cognitive transition lags; other inputs unchanged.', slower))
infra = copy.deepcopy(base)
for parameter in ['low', 'mode', 'high', 'mean', 'std']:
    infra['asi_stage']['infrastructure_friction_months'][parameter] *= 2
scenarios.append(('double-infrastructure', '2× infrastructure delay', 'Double low, mode, high, mean and standard deviation of infrastructure friction; other inputs unchanged.', infra))
result = {
    'runDate': '2026-09-14', 'sourceCommit': SOURCE_COMMIT,
    'simulationsPerScenario': 100000, 'seed': 42,
    'status': 'Conditional model outputs; not calibrated arrival probabilities.',
    'packages': {p: importlib.metadata.version(p) for p in ['numpy','pandas','scipy','pyyaml']},
    'scenarios': [],
}
for key, label, description, config in scenarios:
    simulations = simulate_forecast(config, sims=100000, seed=42)
    summary = summarize_arrivals(simulations)
    result['scenarios'].append({'id': key, 'label': label, 'description': description, 'targets': summary.to_dict('records')})
    if key == 'baseline':
        drivers = combined_sensitivity(simulations)
        drivers.to_csv(output / 'forecast-drivers-2026-09-14.csv', index=False)
        result['drivers'] = drivers[drivers.target == 'internal_asi'].head(5).to_dict('records')
        result['convergence'] = batch_means_convergence(simulations).to_dict('records')[0]
json_text = json.dumps(result, indent=2, allow_nan=False) + '\n'
(output / 'forecast-sensitivity-2026-09-14.json').write_text(json_text)
(root / 'src/content/forecast-results.json').write_text(json_text)
print(json.dumps({'scenarios':[{s['id']: [(t['target'], t['median_month']) for t in s['targets']]} for s in result['scenarios']], 'convergence':result['convergence']}, indent=2))
