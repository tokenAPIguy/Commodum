import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./App.css";
import Auth from "./Auth";
import Dashboard from "./Dashboard";

/***************************************************************
Component: Main Application
***************************************************************/
export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
  }, []);

  return (
    <div>
      {!session ? (
        <Auth />
      ) : (
        <Dashboard key={session.user.id} session={session} />
      )}
    </div>
  );
}
