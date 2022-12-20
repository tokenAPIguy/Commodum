import { useEffect, useState } from "react";
import supabase from "./supabase";
import "./App.css";

const CATEGORIES = [
  { name: "CLI", color: "#2f8d46" },
  { name: "CSS", color: "#1774bb" },
  { name: "GIT", color: "#707071" },
  { name: "HTML", color: "#f05c2a" },
  { name: "JavaScript", color: "#d8a52f" },
  { name: "PHP", color: "#787cb4" },
  { name: "REGEX", color: "#c54131" },
  { name: "SQL", color: "#db2777" },
  { name: "WordPress", color: "#1b769c" },
];

const initialCmds = [
  {
    id: 9,
    text: "test4",
    title: "test4",
    category: "CLI",
    tagged: 0,
    createdIn: 2021,
  },
  {
    id: 8,
    text: "test2",
    title: "test2",
    category: "GIT",
    tagged: 0,
    createdIn: 2019,
  },
  {
    id: 10,
    text: "test1",
    title: "test1",
    category: "WordPress",
    tagged: 1,
    createdIn: 2015,
  },
];

function App() {
  const [showForm, setShowForm] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  return (
    <>
      <Header showForm={showForm} setShowForm={setShowForm} />
      {showForm ? <NewCmdForm /> : null}
      <CmdSearch />
      <main className="main">
        <CategoryFilter />
        <CmdList />
      </main>
    </>
  );
}

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
        style={!showForm ? null : { backgroundColor: "#643311" }}
      >
        {showForm ? "Close" : "New"}
      </button>
    </header>
  );
}
function NewCmdForm() {
  return (
    <form className="cmd-form">
      <input type="text" placeholder="What is the CMD?" />
      <input type="text" placeholder="<...>" />
      <span>{200}</span>
      <select>
        <option value="">Choose category:</option>
        {CATEGORIES.map((cat) => (
          <option key={cat.name} value={cat.name}>
            {cat.name.toUpperCase()}
          </option>
        ))}
      </select>
      <button className="btn btn-large btn-post">Post</button>
    </form>
  );
}

function CmdSearch() {
  return (
    <div className="cmd-form">
      <input type="text" placeholder="..."></input>
      <button className="btn btn-large btn-post">🔎</button>
    </div>
  );
}

function CategoryFilter() {
  return (
    <aside>
      <ul>
        <li>
          <button className="btn btn-all-cmds">Recently Added</button>
        </li>
        {CATEGORIES.map((cat) => (
          <li key={cat.name} className="category">
            <button
              className="btn btn-category"
              style={{ backgroundColor: cat.color }}
            >
              {cat.name}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
}

function CmdList() {
  const cmds = initialCmds;
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

function Cmd({ cmd }) {
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
        <button className="copy">📄</button>
      </div>
    </li>
  );
}
// function App() {
//   const [showForm, setShowForm] = useState(false);
//   const [cmds, setCmds] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [currentCategory, setCurrentCategory] = useState("tagged");

//   useEffect(
//     function () {
//       async function getCmds() {
//         setIsLoading(true);

//         let query = supabase
//           .from("cmd")
//           .select("*")
//           .eq("category", currentCategory);

//         if (currentCategory === "tagged")
//           query = supabase.from("cmd").select("*").eq("tagged", 1);

//         const { data: cmds, error } = await query
//           .order("title", { ascending: false })
//           .limit(1000);

//         if (!error) setCmds(cmds);
//         else alert(`There was a problem getting data.`);

//         setCmds(cmds);
//         setIsLoading(false);
//       }
//       getCmds();
//     },
//     [currentCategory]
//   );

//   return (
//     <>
//       <Header showForm={showForm} setShowForm={setShowForm} />
//       {showForm ? (
//         <NewCmdForm setShowForm={setShowForm} setCmds={setCmds} />
//       ) : null}

//       <main className="main">
//         <CategoryFilter setCurrentCategory={setCurrentCategory} />
//         {isLoading ? <Loader /> : <CmdList cmds={cmds} setCmds={setCmds} />}
//       </main>
//     </>
//   );
// }

// function Loader() {
//   return <p className="message">Loading...</p>;
// }

// function Header({ showForm, setShowForm }) {
//   const appTitle = "ommodum";
//   return (
//     <header className="header">
//       <div className="logo">
//         <img src="Commodum-logos_transparent.png" alt="Commodum Logo" />
//         <h1>{appTitle}</h1>
//       </div>
//       <button
//         className="btn btn-large btn-open"
//         onClick={() => setShowForm((show) => !show)}
//       >
//         {showForm ? "Close" : "New"}
//       </button>
//     </header>
//   );
// }

// function NewCmdForm({ setCmds, setShowForm }) {
//   const [text, setText] = useState("");
//   const [title, setTitle] = useState("");
//   const [category, setCategory] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const textLength = text.length;

//   async function handleSubmit(e) {
//     e.preventDefault();

//     if (text && title && textLength <= 200) {
//       setIsUploading(true);
//       const { data: newCmd, error } = await supabase
//         .from("cmd")
//         .insert([{ text, title, category }])
//         .select();
//       setIsUploading(false);
//       if (!error) setCmds((cmds) => [newCmd[0], ...cmds]);
//       setText("");
//       setTitle("");
//       setCategory("");
//       setShowForm(false);
//     }
//   }

//   return (
//     <form className="cmd-form" onSubmit={handleSubmit}>
//       <input
//         type="text"
//         placeholder="What is the CMD?"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         disabled={isUploading}
//       />
//       <input
//         type="text"
//         placeholder="<...>"
//         value={text}
//         onChange={(e) => setText(e.target.value)}
//       />
//       <span>{200 - textLength}</span>
//       <select
//         value={category}
//         onChange={(e) => setCategory(e.target.value)}
//         disabled={isUploading}
//       >
//         <option value="">Choose category:</option>
//         {CATEGORIES.map((cat) => (
//           <option key={cat.name} value={cat.name}>
//             {cat.name.toUpperCase()}
//           </option>
//         ))}
//       </select>
//       <button className="btn btn-large" disabled={isUploading}>
//         Post
//       </button>
//     </form>
//   );
// }

// function CategoryFilter({ setCmds, setCurrentCategory }) {
//   return (
//     <aside>
//       <ul>
//         <li className="category">
//           <button
//             className="btn btn-tagged-cmds"
//             onClick={() => setCurrentCategory("tagged")}
//           >
//             📑
//           </button>
//         </li>
//         {CATEGORIES.map((cat) => (
//           <li
//             key={cat.name}
//             className="category"
//             onClick={() => setCurrentCategory(cat.name)}
//           >
//             <button
//               className="btn btn-category"
//               style={{ backgroundColor: cat.color }}
//             >
//               {cat.name}
//             </button>
//           </li>
//         ))}
//       </ul>
//     </aside>
//   );
// }

// function CmdList({ cmds, setCmds }) {
//   if (cmds.length === 0)
//     return <p className="message">No cmds for this category yet!</p>;

//   return (
//     <section>
//       <ul className="cmds-list">
//         {cmds.map((cmd) => (
//           <Cmd key={cmd.id} cmd={cmd} setCmds={setCmds} />
//         ))}
//       </ul>
//       <p>There are {cmds.length} cmd(s) in this category.</p>
//     </section>
//   );
// }

// function Cmd({ cmd, setCmds }) {
//   const [isTagged, setIsTagged] = useState(false);
//   async function handleTag(columnName) {
//     setIsTagged(true);
//     if (cmd[columnName] === 0) {
//       const { data: updatedCmd, error } = await supabase
//         .from("cmd")
//         .update({ [columnName]: cmd[columnName] + 1 })
//         .eq("id", cmd.id)
//         .select();
//       if (!error)
//         setCmds((cmds) =>
//           cmds.map((c) => (c.id === cmd.id ? updatedCmd[0] : c))
//         );
//       setIsTagged(true);
//     } else {
//       const { data: updatedCmd, error } = await supabase
//         .from("cmd")
//         .update({ [columnName]: cmd[columnName] - 1 })
//         .eq("id", cmd.id)
//         .select();
//       setIsTagged(false);
//       if (!error)
//         setCmds((cmds) =>
//           cmds.map((c) => (c.id === cmd.id ? updatedCmd[0] : c))
//         );
//     }
//     setIsTagged(false);
//   }

//   return (
//     <li className="cmd">
//       <h4>{cmd.title} </h4>
//       <p className="cmd-content ">{cmd.text}</p>
//       <span
//         className="tag"
//         style={{
//           backgroundColor: CATEGORIES.find((cat) => cat.name === cmd.category)
//             .color,
//         }}
//       >
//         {cmd.category}
//       </span>
//       <div className="cmd-buttons">
//         <button onClick={() => handleTag("tagged")}>📑 {cmd.bookmark}</button>
//         <button className="copy">📄</button>
//       </div>
//     </li>
//   );
// }

export default App;
