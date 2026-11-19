/**
 * The Hamiltonian Recovery mark: two ledger columns joined by a reconciling bar.
 * Kept in sync with public/favicon.svg and the generated PNG icons.
 */
export function BrandMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      className="brand-mark"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      aria-hidden="true"
      focusable="false"
    >
      <rect width="32" height="32" rx="6" fill="#0b1f33" />
      <rect x="8.5" y="8" width="4" height="16" rx="0.75" fill="#ffffff" />
      <rect x="19.5" y="8" width="4" height="16" rx="0.75" fill="#ffffff" />
      <rect x="12.5" y="14.25" width="7" height="3.5" fill="#5fb08c" />
    </svg>
  );
}
