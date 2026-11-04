"use client";
import { cn } from "@/lib/utils";
import { ArrowRight, Eye, EyeOff, LockKeyhole, UserRound } from "lucide-react";
import { ComponentProps, useState } from "react";
import { ROUTES } from "@/constants/routes";
import { register } from "@/services/auth.service";
import "./login-form.css";
import { useRouter } from "next/navigation";

type RegisterFormProps = Omit<ComponentProps<"form">, "onSubmit" | "children">;

export function RegisterForm({className, ...props}: RegisterFormProps) {

  const router = useRouter();

  const [userFormData, setUserFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try{
      if (!userFormData.firstName.trim() || !userFormData.lastName.trim() || !userFormData.username.trim() || !userFormData.password.trim()) {
        return alert("Please fill in all fields.");
      }
      const data = userFormData;
      const response = await register(data);
      if(response && response.statusCode !== 201) {
        return alert("Registration failed. Please try again.");
      }
      router.push(ROUTES.DASHBOARD);
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
