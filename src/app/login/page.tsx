// URL: /login
import Link from "next/link";
import { AuthBrand } from "@/components/auth/auth-brand";
import { LoginForm } from "@/components/auth/login-form";
import { ROUTES } from "@/constants/routes";
import "./login.css";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <main className="login-page">
      {/* Background effects */}
      <div className="login-glow login-glow-top" />
      <div className="login-glow login-glow-bottom" />

      {/* Login card */}
      <div className="login-card">
        <AuthBrand />

        {/* Heading */}
        <div className="login-heading">
          <h2 className="login-title">Welcome Back</h2>
          <p className="login-subtitle">Sign in to your account</p>
        </div>

        <LoginForm />

        {/* Register */}
        <p className="login-register">
          Don&apos;t have an account?{" "}
          <Link href={ROUTES.REGISTER} className="login-register-link">
            Register
          </Link>
        </p>
      </div>
    </main>
  );
}
