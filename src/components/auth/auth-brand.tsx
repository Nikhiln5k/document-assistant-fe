import { FileText, Sparkles } from "lucide-react";
import "@/app/login/login.css";

export function AuthBrand() {
  return (
    <div className="login-brand">
      <div className="login-logo">
        <FileText size={30} />
        <Sparkles size={14} className="login-logo-sparkle" />
      </div>
      <h1 className="login-brand-name">Documind</h1>
      <p className="login-brand-tagline">Your documents. One intelligent workspace.</p>
    </div>
  );
}
