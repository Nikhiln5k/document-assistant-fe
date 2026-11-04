import Image from "next/image";
import "@/app/login/login.css";

export function AuthBrand() {
  return (
    <div className="login-brand">
      {/* Wordmark already contains the "Documind" name, so it doubles as the heading */}
      {/* Two variants: the original dark "Docu" for light theme, a lavender "Docu" for dark theme */}
      <h1 className="login-logo">
        <Image
          src="/assets/documind-logo-dark.png"
          alt="Documind"
          width={2172}
          height={724}
          priority
          className="login-logo-image login-logo-dark"
        />
      </h1>
      <p className="login-brand-tagline">Your documents. One intelligent workspace.</p>
    </div>
  );
}
