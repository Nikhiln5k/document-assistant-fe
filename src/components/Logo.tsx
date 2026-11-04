interface LogoProps {
  className?: string;
}

function Logo({ className = "" }: LogoProps) {
  return (
    <span className={`logo ${className}`}>
      <span className="logo-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
          <path d="M14 3v5h5" />
          <path d="M9 13h6M9 17h4" />
        </svg>
      </span>
      <span className="logo-text">Document Assistant</span>
    </span>
  );
}

export default Logo;
