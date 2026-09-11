import { useEffect, useRef, type ReactNode } from 'react';
import { X } from 'lucide-react';
import { Button } from './ui/Button';
export function Modal({
  label,
  children,
  onClose,
}: {
  label: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const restoreTarget = useRef<Element | null>(null);
  useEffect(() => {
    const dialog = ref.current;
    // Preserve the original trigger through Strict Mode's setup/cleanup replay.
    restoreTarget.current ??= document.activeElement;
    dialog?.showModal();
    return () => {
      dialog?.close();
      const previous = restoreTarget.current;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus();
    };
  }, []);
  return (
    <dialog
      className="modal"
      aria-label={label}
      ref={ref}
      onCancel={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="modal-inner">
        <Button className="modal-close" size="icon" aria-label={`Close ${label}`} onClick={onClose}>
          <X size={18} />
        </Button>
        {children}
      </div>
    </dialog>
  );
}
