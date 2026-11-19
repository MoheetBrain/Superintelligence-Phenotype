import { buildMailtoUrl, type MailtoField } from '../lib/mailto';

/**
 * Enquiry composer: turns the four fields into a pre-addressed email in the visitor's own mail app.
 * Nothing is transmitted or stored by the website.
 *
 * Before navigating, a cancelable `composer:mailto` event (detail: { url }) is dispatched on the
 * form so integrations and tests can observe or intercept the composed URL.
 */

export const COMPOSER_EVENT = 'composer:mailto';

function fieldLabel(
  form: HTMLFormElement,
  control: HTMLInputElement | HTMLTextAreaElement,
): string {
  const label = control.id ? form.querySelector(`label[for="${control.id}"]`) : null;
  return (label?.textContent ?? control.name).trim();
}

export function initComposer(root: Document = document): void {
  const forms = root.querySelectorAll<HTMLFormElement>('form[data-composer]');
  forms.forEach((form) => {
    const to = form.dataset.mailtoTo;
    const subject = form.dataset.mailtoSubject ?? '';
    if (!to) return;

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!form.reportValidity()) return;

      const controls = Array.from(
        form.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>(
          'input[name], textarea[name]',
        ),
      );
      const toField = (control: HTMLInputElement | HTMLTextAreaElement): MailtoField => ({
        label: fieldLabel(form, control),
        value: control.value,
      });
      const fields = controls.filter((control) => control.tagName !== 'TEXTAREA').map(toField);
      const textarea = controls.find((control) => control.tagName === 'TEXTAREA');

      const url = buildMailtoUrl({
        to,
        subject,
        fields,
        message: textarea ? toField(textarea) : undefined,
      });

      const proceed = form.dispatchEvent(
        new CustomEvent(COMPOSER_EVENT, { detail: { url }, cancelable: true }),
      );
      if (proceed) window.location.href = url;
    });
  });
}
