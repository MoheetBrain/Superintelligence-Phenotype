/**
 * Builds the mailto: URL used by the enquiry composer.
 * Pure and framework-free so it can run in the browser module and be unit tested.
 */

export interface MailtoField {
  label: string;
  value: string;
}

export interface MailtoInput {
  to: string;
  subject: string;
  /** Short fields rendered as "Label: value", one per line. */
  fields: MailtoField[];
  /** Optional long-form field rendered as a labelled paragraph after the short fields. */
  message?: MailtoField;
}

const CRLF = '\r\n';

/** Normalises line endings to CRLF, as RFC 6068 requires for mailto bodies. */
function normaliseLineBreaks(value: string): string {
  return value.replace(/\r\n?|\n/g, CRLF);
}

export function composeMailtoBody({
  fields,
  message,
}: Pick<MailtoInput, 'fields' | 'message'>): string {
  const lines = fields.map(({ label, value }) => `${label}: ${value.trim()}`);
  if (message) {
    lines.push('', `${message.label}:`, message.value.trim());
  }
  return normaliseLineBreaks(lines.join('\n'));
}

/**
 * Percent-encodes a header value for a mailto: URL (RFC 6068).
 * encodeURIComponent leaves ! ' ( ) * unescaped; they are legal but encoded here for mail-client robustness.
 */
export function encodeMailtoComponent(value: string): string {
  return encodeURIComponent(value).replace(
    /[!'()*]/g,
    (char) => `%${char.charCodeAt(0).toString(16).toUpperCase()}`,
  );
}

export function buildMailtoUrl(input: MailtoInput): string {
  const to = input.to.trim();
  if (!/^[^\s@?&#]+@[^\s@?&#]+$/.test(to)) {
    throw new Error(`Invalid recipient address: ${to}`);
  }
  const subject = encodeMailtoComponent(input.subject.trim());
  const body = encodeMailtoComponent(composeMailtoBody(input));
  return `mailto:${to}?subject=${subject}&body=${body}`;
}
