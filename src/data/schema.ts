export type EvidenceLevel = 'Observed' | 'Extrapolated' | 'Theoretically Plausible' | 'Speculative';

export type VerificationStatus = 'verified' | 'needs-review';

export type DomainId =
  | 'cognition'
  | 'metacognition'
  | 'memory'
  | 'theory-of-mind'
  | 'agency'
  | 'coordination'
  | 'replication'
  | 'substrate-mobility'
  | 'embodiment'
  | 'control-governance'
  | 'ecology'
  | 'self-improvement';

export type Vec3 = readonly [number, number, number];

export interface Domain {
  id: DomainId;
  name: string;
  aliases: readonly string[];
  provisional: boolean;
  provisionalNote: string | null;
}

export interface Source {
  id: string;
  title: string;
  url: string | null;
  publisher: string | null;
  publishedAt: string | null;
  verifiedAt: string | null;
  locator: string | null;
  verification: VerificationStatus;
}

export interface Claim {
  id: string;
  text: string;
  evidenceLevel: EvidenceLevel;
  scope: string;
  verification: VerificationStatus;
  sourceIds: readonly string[];
  limitations: readonly string[];
}

export interface Measurement {
  name: string;
  protocol: string;
  value: number | string | null;
  unit: string | null;
  uncertainty: string | null;
  systemVersion: string | null;
  taskSuite: string | null;
  resourceContext: string | null;
  measuredAt: string | null;
  sourceIds: readonly string[];
}

export interface Capability {
  id: string;
  name: string;
  domain: DomainId;
  aliases: readonly string[];
  meaning: string;
  hypotheticalExample: string;
  subtraits: readonly {
    id: string;
    name: string;
    meaning: string;
  }[];
  importantDistinctions: readonly string[];
  measurement: Measurement;
  currentResult: string;

  // Classification of the stated future hypothesis, not every claim
  // on the card and not an evaluation of an unspecified current model.
  evidenceLevel: EvidenceLevel;

  sources: readonly Source[];
  claims: readonly Claim[];
  relatedConcepts: readonly string[];

  viewCoordinates: {
    body: {
      partIds: readonly string[];
      target: Vec3;
      camera: Vec3;
    };
    network: Vec3 | null;
    evolution: Vec3 | null;
  };
}
