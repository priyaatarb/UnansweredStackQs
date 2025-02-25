import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import Navbar from "../components/Navbar";

export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status !== "loading") {
      signIn(); // Redirect if not logged in 
    }
  }, [session, status]);

  const fetchQuestions = async () => {
    setLoading(true);
    setError(null);

    let url = `http://localhost:5000/api/questions/`;
    const params = [];
    if (tag) params.push(`tag=${tag}`);
    if (sortBy) params.push(`sortBy=${sortBy}`);
    if (params.length) url += "?" + params.join("&");

    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error(`API Error: ${res.status}`);

      const data = await res.json();
      if (!Array.isArray(data)) throw new Error("Invalid response format");

      setQuestions(data);
    } catch (err) {
      console.error("Error fetching questions:", err);
      setError(err.message);
      setQuestions([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [tag, sortBy]);

  return (
    <div>
      
      <div>
        <h1>Unanswered StackOverflow Questions</h1>

        <div className="filter-bar">
          <span>
            <label>Filter by Tag:</label>
            <input
              type="text"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              placeholder="e.g., javascript"
            />
          </span>
          <span>
            <label>Sort by:</label>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="">None</option>
              <option value="difficulty">Difficulty (Votes)</option>
              <option value="popularity">Popularity (Recent)</option>
            </select>

            <button onClick={fetchQuestions}>Apply</button>
          </span>
        </div>

        {loading && <p>Loading questions...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <ul>
          {questions.length > 0
            ? questions.map((q) => (
              <Link href={`/question/${q.id}`} className="question-link">
                  <li key={q.id}>
                    {}
                    <Link href={`/question/${q.id}`} className="question-link">
                      {q.title}
                    </Link>
                    <p>
                      Votes: {q.votes} | Tags: {q.tags?.join(", ")}
                    </p>
                  </li>
                </Link>
              ))
            : !loading && <p>No questions found.</p>}
        </ul>
      </div>
    </div>
  );
}
