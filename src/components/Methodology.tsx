import { evidenceLevels, evidenceMeaning, metaphor } from '../content/methodology';
import { EvidenceBadge } from './EvidenceBadge';
export function Methodology() {
  return (
    <div className="methodology">
      <h2>Reading this atlas</h2>
      <p>{metaphor}</p>
      <p>
        The twelve domains are editable navigation choices, not measured biological or computational
        categories. Memory and Control and Governance are provisional groupings adapted for this
        first release.
      </p>
      <h3>Evidence language</h3>
      {evidenceLevels.map((level) => (
        <div key={level}>
          <EvidenceBadge level={level} />
          <p>{evidenceMeaning[level]}</p>
        </div>
      ))}
      <p>
        Source verification records what was checked; it is separate from evidence classification.
        Reviewed paper abstracts support only the narrow statements attributed to them. No
        experiments have been reproduced for this project.
      </p>
      <h3>Credits</h3>
      <p>
        Original procedural robot and application: Super Intelligence Inc. Interaction reference:{' '}
        <a href="https://github.com/ashemag/human-atlas" target="_blank" rel="noreferrer">
          Human Atlas by ashemag
        </a>
        . Its MIT-licensed PointerTap helper is reused with attribution. No anatomy assets are
        distributed.
      </p>
      <p>
        Built with React, Three.js, Vite and Lucide icons. See the repository’s third-party notices
        and asset ledger for licence details.
      </p>
      <p>
        <a href="/third-party-notices.txt" target="_blank" rel="noreferrer">
          Read the distributed third-party licence notices
        </a>
      </p>
    </div>
  );
}
