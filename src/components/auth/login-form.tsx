"use client"; // Needed because forms use state and click handlers

import { useState, type ComponentProps, type FormEvent } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { cn } from "@/lib/utils";
import "./login-form.css";
import { login } from "@/services/auth.service";
import { ROUTES } from "@/constants/routes";
import { useRouter } from "next/navigation";

type LoginFormProps = Omit<ComponentProps<"form">, "onSubmit" | "children">;

export function LoginForm({ className, ...props }: LoginFormProps) {

  const router = useRouter();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username.trim() || !password.trim()) return;
    setLoading(true);

    try {
      if (!username.trim() || !password.trim()) {
        return alert("Please fill in all fields.");
      }
      const data = {username, password};
      const response = await login(data);
      if(response && response.statusCode !== 200) {
        return alert("Login failed. Please try again.");
      }
      router.push(ROUTES.DASHBOARD);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("login-form", className)} {...props}>
      {/* Username */}
      <div>
        <label htmlFor="username" className="login-label">
          Username
        </label>

        <div className="login-field">
          <UserRound size={19} className="login-field-icon" />
          <input
            id="username"
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoComplete="username"
            required
            className="login-input"
          />
        </div>
      </div>

      {/* Password */}
      <div>
        <label htmlFor="password" className="login-label">
          Password
        </label>

        <div className="login-field">
          <LockKeyhole size={19} className="login-field-icon" />
          <input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
            className="login-input"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="login-toggle-password"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={19} /> : <Eye size={19} />}
          </button>
        </div>
      </div>

      {/* Forgot password */}
      <div className="login-forgot">
        <Link href="/forgot-password" className="login-forgot-link">
          Forgot password?
        </Link>
      </div>

      {/* Submit */}
      <button type="submit" disabled={loading} className="login-submit">
        {loading ? "Signing in..." : "Sign In"}
        {!loading && <ArrowRight size={18} className="login-submit-icon" />}
      </button>
    </form>
  );
}
