import Logo from "../../components/Logo";
import { useAuth } from "../../hooks/useAuth";

// Placeholder landing page for signed-in users until the documents module is built.
function HomePage() {
  const { user, logout } = useAuth();
  const displayName = user?.firstName || user?.username;

  return (
    <main className="container py-5">
      <div className="d-flex align-items-center justify-content-between gap-3 mb-5">
        <Logo />
        <button type="button" className="btn btn-outline" onClick={logout}>
          Sign out
        </button>
      </div>

      <h1>Hi {displayName}, you're signed in.</h1>
      <p className="text-muted">Your documents will show up here.</p>
    </main>
  );
}

export default HomePage;
