// URL: /register
import Link from "next/link";
import { AuthBrand } from "@/components/auth/auth-brand";
import { RegisterForm } from "@/components/auth/register-form";
import { ROUTES } from "@/constants/routes";
import "../login/login.css";

export const metadata = { title: "Register" };

export default function RegisterPage() {
  return (
    <main className="login-page">
      {/* Background effects */}
      <div className="login-glow login-glow-top" />
      <div className="login-glow login-glow-bottom" />

      {/* Register card */}
      <div className="login-card">
        <AuthBrand />

        {/* Heading */}
        <div className="login-heading">
          <h2 className="login-title">Create Account</h2>
          <p className="login-subtitle">Register your account</p>
        </div>

        <RegisterForm />

        {/* Login */}
        <p className="login-register">
          Already have an account?{" "}
          <Link href={ROUTES.LOGIN} className="login-register-link">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}
