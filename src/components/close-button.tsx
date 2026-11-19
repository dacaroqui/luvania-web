export function CloseButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className="close-x" onClick={onClick} aria-label="Cerrar">
      <svg viewBox="0 0 16 16" aria-hidden="true">
        <path d="M3.5 3.5 12.5 12.5M12.5 3.5 3.5 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </button>
  );
}
