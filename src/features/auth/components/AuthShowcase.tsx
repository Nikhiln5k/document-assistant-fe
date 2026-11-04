import Logo from "../../../components/Logo";

const highlights = [
  "Upload PDFs, Word files and notes in seconds",
  "Ask questions in plain language",
  "Get answers that point back to the source",
];

/** The branded side of the auth page. Hidden on smaller screens to keep the form front and centre. */
function AuthShowcase() {
  return (
    <aside className="auth-showcase col-lg-6 d-none d-lg-flex">
      <Logo className="logo-inverse" />

      <div className="auth-showcase-body">
        <h2 className="auth-showcase-title">Your documents, ready to answer back.</h2>
        <p className="auth-showcase-text">
          Stop scrolling through pages to find one detail. Ask, and get a clear answer in seconds.
        </p>

        <ul className="auth-highlights">
          {highlights.map((highlight) => (
            <li key={highlight}>
              <CheckIcon />
              {highlight}
            </li>
          ))}
        </ul>
      </div>

      <div className="chat-preview" aria-hidden="true">
        <span className="chat-preview-file">Service-Agreement.pdf</span>
        <p className="chat-bubble chat-bubble-question">What are the payment terms?</p>
        <p className="chat-bubble chat-bubble-answer">
          Invoices are due within 30 days, with a 2% late fee after that.
          <span className="chat-source">Section 4.2</span>
        </p>
      </div>
    </aside>
  );
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}

export default AuthShowcase;
