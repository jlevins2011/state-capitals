export function Maggie({ size = 72 }: { size?: number }) {
  return (
    <svg className="maggie" width={size} height={size} viewBox="0 0 80 80" aria-hidden="true">
      <ellipse cx="40" cy="72" rx="18" ry="4" fill="rgba(0,0,0,0.16)" />
      <ellipse cx="40" cy="50" rx="18" ry="14" fill="#c4a06a" />
      <ellipse cx="40" cy="54" rx="10" ry="7" fill="#efe0c4" />
      <circle cx="38" cy="32" r="13" fill="#c4a06a" />
      <ellipse cx="24" cy="36" rx="7" ry="11" fill="#5a3a22" />
      <ellipse cx="52" cy="36" rx="7" ry="11" fill="#5a3a22" />
      <ellipse cx="38" cy="36" rx="5" ry="4" fill="#efe0c4" />
      <circle cx="34" cy="30" r="2" fill="#1a1714" />
      <circle cx="42" cy="30" r="2" fill="#1a1714" />
      <ellipse cx="38" cy="36" rx="2.2" ry="1.6" fill="#1a1714" />
      <path d="M38 38 Q34 42 30 40" fill="none" stroke="#1a1714" strokeWidth="1.2" />
      <rect x="28" y="60" width="6" height="10" rx="3" fill="#8a6a3d" />
      <rect x="46" y="60" width="6" height="10" rx="3" fill="#8a6a3d" />
      <path d="M56 48 Q68 44 62 56" fill="#c4a06a" />
    </svg>
  );
}
