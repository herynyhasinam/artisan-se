export default function Logo({ size = 40, withWord = true }: { size?: number; withWord?: boolean }) {
  return (
    <span className="logo">
      <svg width={size} height={size} viewBox="0 0 120 120" role="img" aria-label="Artis'Anse">
        <path d="M30 96L60 28L90 96" fill="none" stroke="#1F3A5F" strokeWidth="10" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M43 74Q51.5 64 60 74T77 74" fill="none" stroke="#B5532B" strokeWidth="8" strokeLinecap="round" />
      </svg>
      {withWord && <span className="logo-word">Artis'Anse</span>}
    </span>
  );
}
