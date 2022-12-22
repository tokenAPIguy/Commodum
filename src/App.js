import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./App.css";

/***************************************************************
Category Definitions
***************************************************************/
const CATEGORIES = [
  { name: "CLI", color: "#008a00" },
  { name: "CSS", color: "#1774bb" },
  { name: "GIT", color: "#707071" },
  { name: "HTML", color: "#f16529" },
  { name: "JavaScript", color: "#d8a52f" },
  { name: "NGINX", color: "#35954e" },
  { name: "PHP", color: "#787cb4" },
  { name: "REGEX", color: "#c54131" },
  { name: "SQL", color: "#db2777" },
  { name: "WordPress", color: "#1b769c" },
];

/***************************************************************
Component: Main Application
***************************************************************/
function App() {
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [cmds, setCmds] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState("all");
  const [searchValue, setSearchValue] = useState("");

  // Persistent Search Bar
  function search(value) {
    const searchValue = value.toLowerCase();
    const filteredResults = cmds.filter((cmd) =>
      cmd.title.toLowerCase().includes(value)
    );
    return filteredResults;
  }
  // Fetch CMDs from DB for "recently added / all"
  useEffect(
    function () {
      async function getCmds() {
        setIsLoading(true);

        let query = supabase.from("cmd").select("*");

        if (currentCategory !== "all")
          query = query.eq("category", currentCategory);

        const { data: cmds, error } = await query
          .order("id", { ascending: false })
          .limit(1000);

        if (!error) setCmds(cmds);
        else alert("There was a problem getting data! Check the console.");

        setIsLoading(false);
      }
      getCmds();
    },
    [currentCategory]
  );

  return (
    <>
      <Header
        showForm={showForm}
        setShowForm={setShowForm}
        showSearch={showSearch}
        setShowSearch={setShowSearch}
      />
      {showForm ? (
        <NewCmdForm setCmds={setCmds} setShowForm={setShowForm} />
      ) : null}
      {!showForm ? (
        <div className="cmd-search">
          <span>🔎</span>
          <input
            type="text"
            placeholder="Search..."
            value={searchValue}
            onChange={(event) => setSearchValue(event.target.value)}
          />
        </div>
      ) : null}
      <main className="main">
        <CategoryFilter setCurrentCategory={setCurrentCategory} />
        {isLoading ? (
          <Loader />
        ) : (
          <CmdList cmds={searchValue ? search(searchValue) : cmds} />
        )}
      </main>
    </>
  );
}

/***************************************************************
Component: Loader
***************************************************************/
function Loader() {
  return <p className="message">Loading...</p>;
}

/***************************************************************
Component: Header
***************************************************************/
function Header({ showForm, setShowForm }) {
  return (
    <header className="header">
      <div className="logo">
        <img src="Commodum-logos_transparent.png" alt="commodum logo" />
        <title>Commodum</title>
        <h1>ommodum</h1>
      </div>
      <button
        className="btn btn-large"
        onClick={() => setShowForm((show) => !show)}
        style={!showForm ? null : { color: "#ee523f" }}
      >
        {showForm ? "Close" : "New"}
      </button>
    </header>
  );
}

/***************************************************************
Component: Add New CMD
***************************************************************/
function NewCmdForm({ setCmds, setShowForm }) {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const textLength = text.length;

  async function handleSubmit(e) {
    // Prevent browser reload
    e.preventDefault();

    // Data validation
    if (title && text && category && textLength <= 200) {
      // Add new cmd to Supabase + receive cmd obj response
      setIsUploading(true);
      const { data: newCmd, error } = await supabase
        .from("cmd")
        .insert([{ title, text, category }])
        .select();
      setIsUploading(false);

      // Add new cmd to UI
      setCmds((cmds) => [newCmd[0], ...cmds]);

      // Reset Input Fields
      setTitle("");
      setText("");
      setCategory("");

      // Close Form
      setShowForm(false);
    }
  }
  return (
    <form className="cmd-form" onSubmit={handleSubmit}>
      <input
        value={title}
        type="text"
        placeholder="What is the CMD?"
        onChange={(e) => setTitle(e.target.value)}
        disabled={isUploading}
      />
      <input
        type="text"
        placeholder="<...>"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <span>{200 - textLength}</span>
      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        disabled={isUploading}
      >
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large btn-post" disabled={isUploading}>
        POST
      </button>
    </form>
  );
}

/***************************************************************
Component: Category Filter
***************************************************************/
function CategoryFilter({ setCurrentCategory }) {
  return (
    <aside>
      <ul>
        <li>
          <button
            className="btn btn-all-cmds"
            onClick={() => setCurrentCategory("all")}
          >
            All
          </button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
              onClick={() => setCurrentCategory(cat.name)}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/***************************************************************
Component: List of CMDs
***************************************************************/
function CmdList({ cmds }) {
  return (
    <section>
      <ul className="cmds-list">
        {cmds.map((cmd) => (
          <Cmd key={cmd.id} cmd={cmd} />
        ))}
      </ul>
      <p>There are {cmds.length} cmd(s) in this category.</p>
    </section>
  );
}

/***************************************************************
Component: CMD Object
***************************************************************/
// Copy CMD to clipboard
function Cmd({ cmd }) {
  function copyText() {
    navigator.clipboard.writeText(cmd.text);
  }

  return (
    <li className="cmd">
      <h4>{cmd.title} </h4>
      <p className="cmd-content ">{cmd.text}</p>
      <span
        className="tag"
        style={{
          backgroundColor: CATEGORIES.find((cat) => cat.name === cmd.category)
            .color,
        }}
      >
        {cmd.category}
      </span>
      <div className="cmd-buttons">
        <button className="copy" onClick={copyText}>
          📄
        </button>
      </div>
    </li>
  );
}

export default App;
