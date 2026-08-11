type LogoProps = { compact?: boolean };

export function Logo({ compact = false }: LogoProps) {
  if (compact) {
    return (
      <img
        src="/logo-icon.svg"
        alt="ResUme NoW"
        className="h-12 w-12"
      />
    );
  }

  return (
    <img
      src="/logo-full.svg"
      alt="ResUme NoW"
      className="w-full max-w-[481px]"
      style={{ height: '140px', objectFit: 'contain' }}
    />
  );
}
