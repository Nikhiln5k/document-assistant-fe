"use client";
import { cn } from "@/lib/utils";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { ComponentProps, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { register } from "@/services/auth.service";
import "./login-form.css";
import { useRouter } from "next/navigation";

type RegisterFormProps = Omit<ComponentProps<"form">, "onSubmit" | "children">;

const MIN_PASSWORD_LENGTH = 8;

export function RegisterForm({className, ...props}: RegisterFormProps) {

  const router = useRouter();

  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);
    try{
      if (!userFormData.firstName.trim() || !userFormData.lastName.trim() || !userFormData.username.trim() || !userFormData.password.trim()) {
        return setErrorMessage("Please fill in all fields.");
      }
      if (userFormData.password.length < MIN_PASSWORD_LENGTH) {
        return setErrorMessage(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      }
      if (userFormData.password !== confirmPassword) {
        return setErrorMessage("Passwords don't match.");
      }
      const data = {
        ...userFormData,
        firstName: userFormData.firstName.trim(),
        lastName: userFormData.lastName.trim(),
        username: userFormData.username.trim(),
      };
      const response = await register(data);
      if(response && response.statusCode !== 201) {
        return setErrorMessage("Registration failed. Please try again.");
      }
      router.push(ROUTES.DASHBOARD);
    } catch (error) {
      // ApiError already carries a user-friendly message (see services/api.ts).
      setErrorMessage(error instanceof Error ? error.message : "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn("login-form", className)}
      {...props}
    >
      {errorMessage && (
        <div className="login-error" role="alert">
          {errorMessage}
        </div>
      )}

      {/* First Name */}
      <div>
        <label htmlFor="firstName" className="login-label">
          First Name
        </label>

        <div className="login-field">
          <UserRound size={19} className="login-field-icon" />
          <input
            id="firstName"
            type="text"
            placeholder="Enter your first name"
            value={userFormData.firstName}
            onChange={(e) =>
              setUserFormData({
                ...userFormData,
                firstName: e.target.value,
              })
            }
            autoComplete="given-name"
            required
            className="login-input"
          />
        </div>
      </div>

      {/* Last Name */}
      <div>
        <label htmlFor="lastName" className="login-label">
          Last Name
        </label>

        <div className="login-field">
          <UserRound size={19} className="login-field-icon" />
          <input
            id="lastName"
            type="text"
            placeholder="Enter your last name"
            value={userFormData.lastName}
            onChange={(e) =>
              setUserFormData({ ...userFormData, lastName: e.target.value })
            }
            autoComplete="family-name"
            required
            className="login-input"
          />
        </div>
      </div>

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
            value={userFormData.username}
            onChange={(e) =>
              setUserFormData({ ...userFormData, username: e.target.value })
            }
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
            value={userFormData.password}
            onChange={(e) =>
              setUserFormData({ ...userFormData, password: e.target.value })
            }
            autoComplete="new-password"
            minLength={MIN_PASSWORD_LENGTH}
            maxLength={128}
            aria-describedby="password-hint"
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
        <p id="password-hint" className="login-hint">
          Use at least {MIN_PASSWORD_LENGTH} characters.
        </p>
      </div>

      {/* Confirm Password */}
      <div>
        <label htmlFor="confirmPassword" className="login-label">
          Confirm Password
        </label>

        <div className="login-field">
          <LockKeyhole size={19} className="login-field-icon" />
          <input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="Repeat your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
            required
            className="login-input"
          />
        </div>
      </div>

      {/* Submit */}
      <button type="submit" disabled={isLoading} className="login-submit">
        {isLoading ? "Signing up..." : "Sign Up"}
        {!isLoading && (
          <ArrowRight size={18} className="login-submit-icon" />
        )}
      </button>
    </form>
  );
}
