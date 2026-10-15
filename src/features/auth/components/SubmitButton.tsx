import type { ReactNode } from "react";

interface SubmitButtonProps {
  isLoading: boolean;
  loadingText: string;
  children: ReactNode;
}

function SubmitButton({ isLoading, loadingText, children }: SubmitButtonProps) {
  return (
    <button type="submit" className="btn btn-primary btn-lg w-100" disabled={isLoading}>
      {isLoading ? (
        <>
          <span className="spinner-border spinner-border-sm" aria-hidden="true" />
          <span role="status">{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default SubmitButton;
