const form = document.querySelector('#atlas-filters');
if (form instanceof HTMLFormElement) {
  const rows = Array.from(document.querySelectorAll('[data-thesis]'));
  const searchable = new Map(rows.map((row) => [row, row.textContent.toLowerCase()]));
  const fields = ['id', 'provenance', 'epistemic_status', 'primary_destination'];
  const params = new URLSearchParams(location.search);
  const input = (name) => form.elements.namedItem(name);
  for (const name of ['search', ...fields]) {
    if (params.has(name)) input(name).value = params.get(name);
  }
  const destination = params.get('destination');
  if (/^RN[1-4]$/.test(destination ?? '')) {
    const value = rows.find((row) => row.dataset.primary_destination.startsWith(destination))
      ?.dataset.primary_destination;
    if (value) input('primary_destination').value = value;
  }
  function filter(updateUrl = true) {
    const search = input('search').value.trim().toLowerCase();
    const idQuery = /^t?(\d+)$/.exec(search)?.[1];
    let count = 0;
    for (const row of rows) {
      const match =
        fields.every((key) => !input(key).value || input(key).value === row.dataset[key]) &&
        (!search || (idQuery ? row.dataset.id === idQuery : searchable.get(row).includes(search)));
      row.hidden = !match;
      if (match) count++;
    }
    document.querySelector('#atlas-count').textContent =
      `${count} of ${rows.length} thesis records`;
    document.querySelector('#atlas-empty').hidden = count !== 0;
    if (updateUrl) {
      const next = new URLSearchParams();
      for (const name of ['search', ...fields])
        if (input(name).value) next.set(name, input(name).value);
      history.replaceState(null, '', location.pathname + (next.size ? `?${next}` : ''));
    }
  }
  function revealHash() {
    if (!/^#T\d+$/.test(location.hash)) return;
    const row = document.getElementById(location.hash.slice(1));
    if (!row?.matches('[data-thesis]')) return;
    if (row.hidden) {
      for (const name of ['search', ...fields]) input(name).value = '';
      filter(false);
    }
    row.querySelector('details').open = true;
    row.scrollIntoView({ block: 'start' });
  }
  form.hidden = false;
  form.addEventListener('submit', (event) => event.preventDefault());
  form.addEventListener('input', () => filter());
  form.addEventListener('reset', () => requestAnimationFrame(() => filter()));
  addEventListener('hashchange', revealHash);
  filter(false);
  revealHash();
}
