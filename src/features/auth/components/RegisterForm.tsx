import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getErrorMessage } from "../../../lib/api-response";
import FormField from "./FormField";
import PasswordField from "./PasswordField";
import SubmitButton from "./SubmitButton";

const MIN_PASSWORD_LENGTH = 8;

const initialValues = {
  firstName: "",
  lastName: "",
  username: "",
  password: "",
  confirmPassword: "",
};

function RegisterForm() {
  const { register } = useAuth();
  const [values, setValues] = useState(initialValues);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (values.password !== values.confirmPassword) {
      setErrorMessage("Passwords don't match.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await register({
        username: values.username.trim(),
        password: values.password,
        // The API treats names as optional, so empty ones are left out entirely.
        firstName: values.firstName.trim() || undefined,
        lastName: values.lastName.trim() || undefined,
      });
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

      <div className="form-row">
        <FormField
          name="firstName"
          label="First name"
          value={values.firstName}
          onChange={handleChange}
          autoComplete="given-name"
          placeholder="Jane"
          maxLength={200}
          autoFocus
        />
        <FormField
          name="lastName"
          label="Last name"
          value={values.lastName}
          onChange={handleChange}
          autoComplete="family-name"
          placeholder="Doe"
          maxLength={200}
        />
      </div>

      <FormField
        name="username"
        label="Username"
        value={values.username}
        onChange={handleChange}
        autoComplete="username"
        placeholder="Choose a username"
        maxLength={150}
        required
      />

      <PasswordField
        name="password"
        label="Password"
        value={values.password}
        onChange={handleChange}
        autoComplete="new-password"
        placeholder="Create a password"
        hint={`Use at least ${MIN_PASSWORD_LENGTH} characters.`}
        minLength={MIN_PASSWORD_LENGTH}
        maxLength={128}
        required
      />

      <PasswordField
        name="confirmPassword"
        label="Confirm password"
        value={values.confirmPassword}
        onChange={handleChange}
        autoComplete="new-password"
        placeholder="Repeat your password"
        required
      />

      <SubmitButton isLoading={isSubmitting} loadingText="Creating account…">
        Create account
      </SubmitButton>
    </form>
  );
}

export default RegisterForm;
