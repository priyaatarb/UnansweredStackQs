import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import { useRouter } from "next/router";


export default function Home() {
  const [questions, setQuestions] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [tag, setTag] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { data: session, status } = useSession();
  const router = useRouter();
const { id } = router.query;


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
    if (id) {

      fetch(`http://localhost:5000/api/solutions/${id}`)
        .then(res => res.json())
        .then(data => setSolutions(data));
    }
  }, [id]);

  useEffect(() => {
    fetchQuestions();
  }, [tag, sortBy]);

  return (
    <div>
      
      <div>
        <h1 className="main-heading">Unanswered StackOverflow Questions</h1>

        <div className="filter-bar">
          <div className="span-div">
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
                  <option value="difficulty">Recently Added</option>
                  <option value="popularity">Most Voted</option>
                </select>

                <button onClick={fetchQuestions}>Apply</button>
              </span>
          </div>
        </div>

        {loading && <p>Loading questions...</p>}
        {error && <p style={{ color: "red" }}>Error: {error}</p>}

        <ul>
          {questions.length > 0
            ? questions.map((q) => (
              
                  <li key={q.id} className="question-card">
                    <div className="question-info">
                      <p><strong>{q.vote_count} Votes</strong> </p>  
                      <p><strong>{q.answer_count} Answers </strong></p> 
                    </div>
                    {}
                    <div className="question-text">
                      <Link href={`/question/${q.id}`} className="question-link">
                        {q.title}
                      </Link> 
                      <p>{q.summary}</p>
                      <p className="tag-container">
                        {q?.tags.map((tag, index) => (
                          <span key={index} className="tag-item">
                            {tag}
                          </span>
                        ))}
                      </p>
                    </div>
                  </li>
                
              ))
            : !loading && <p>No questions found.</p>}
        </ul>
      </div>
    </div>
  );
}
