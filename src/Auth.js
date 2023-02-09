import { useState } from "react";
import supabase from "./supabase";
import "./Auth.css";

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOtp({ email });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error) {
      alert(error.error_description || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <header className="header">
        <div className="logo">
          <img src="Commodum-logos_transparent.png" alt="commodum logo" />
          <title>Commodum</title>
          <h1>ommodum</h1>
        </div>
      </header>
      <body>
        <div className="form">
          <div aria-live="polite">
            <h3>Sign in using the link with your email below 👇</h3>
            {loading ? (
              "Sending link..."
            ) : (
              <form className="submit" onSubmit={handleLogin}>
                <input
                  id="email"
                  className="input"
                  type="email"
                  placeholder="Your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <button
                  className="btn btn-post"
                  style={{ padding: 20 }}
                  aria-live="polite"
                >
                  Send link
                </button>
              </form>
            )}
          </div>
        </div>
      </body>
    </>
  );
}
