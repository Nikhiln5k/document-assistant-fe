import { NavLink } from "react-router";
import Logo from "../../../components/Logo";
import { paths } from "../../../app/router/paths";
import AuthShowcase from "./AuthShowcase";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import "./AuthPage.css";

type AuthMode = "login" | "register";

const headings: Record<AuthMode, { title: string; subtitle: string }> = {
  login: {
    title: "Welcome back",
    subtitle: "Sign in to pick up right where you left off.",
  },
  register: {
    title: "Create your account",
    subtitle: "Start asking questions about your documents in under a minute.",
  },
};

interface AuthPageProps {
  mode: AuthMode;
}

function AuthPage({ mode }: AuthPageProps) {
  const { title, subtitle } = headings[mode];

  return (
    <main className="auth-page row g-0">
      <AuthShowcase />

      <section className="auth-panel col-12 col-lg-6">
        <div className="auth-card">
          <Logo className="d-lg-none mb-4" />

          <h1 className="auth-title">{title}</h1>
          <p className="auth-subtitle">{subtitle}</p>

          <nav className="auth-tabs" aria-label="Choose how to continue">
            <NavLink to={paths.login} replace className="auth-tab">
              Sign in
            </NavLink>
            <NavLink to={paths.register} replace className="auth-tab">
              Create account
            </NavLink>
          </nav>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}
        </div>
      </section>
    </main>
  );
}

export default AuthPage;
