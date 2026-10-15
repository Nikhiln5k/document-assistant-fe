import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getErrorMessage } from "../../../lib/api-response";
import type { LoginCredentials } from "../types";
import FormField from "./FormField";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

const initialValues: LoginCredentials = {
  username: "",
  password: "",
};

function LoginForm() {
  const { login } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      // On success the guest route redirects away, so there is nothing else to do here.
      await login({ ...values, username: values.username.trim() });
    } catch (error) {
      setErrorMessage(getErrorMessage(error));
      setIsSubmitting(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit}>
      {errorMessage && (
        <div className="alert alert-danger" role="alert">
          {errorMessage}
        </div>
      )}

      <FormField
        name="username"
        label="Username"
        value={values.username}
        onChange={handleChange}
        autoComplete="username"
        placeholder="Enter your username"
        required
        autoFocus
      />

      <PasswordField
        name="password"
        label="Password"
        value={values.password}
        onChange={handleChange}
        autoComplete="current-password"
        placeholder="Enter your password"
        required
      />

      <SubmitButton isLoading={isSubmitting} loadingText="Signing in…">
        Sign in
      </SubmitButton>
    </form>
  );
}

export default LoginForm;
