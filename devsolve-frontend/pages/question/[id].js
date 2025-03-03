import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import Navbar from "../../components/Navbar";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";

export default function QuestionPage() {
  const router = useRouter();
  const { id } = router.query;
  const [question, setQuestion] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionText, setSolutionText] = useState("");
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session && status !== "loading") {
      signIn();
    }
  }, [session, status]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/questions/${id}`)
        .then(res => res.json())
        .then(data => setQuestion(data));

      fetch(`http://localhost:5000/api/solutions/${id}`)
        .then(res => res.json())
        .then(data => setSolutions(data));
    }
  }, [id]);

  const submitSolution = () => {
    if (!solutionText.trim()) {
      alert("Insert your answer first before submitting!");
      return;
    }

    fetch("http://localhost:5000/api/solutions/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: id, user_id: session.user.id, solution: solutionText }),
    }).then(() => {
      setSolutionText("");
      refreshSolutions();
    });
  };

  const refreshSolutions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/solutions/${id}`);
      const data = await res.json();
      setSolutions(data); // Update the state with the latest solutions
    } catch (error) {
      console.error("Error fetching updated solutions:", error);
    }
  };
  

  const upvoteSolution = async (solutionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/solutions/upvote/${solutionId}`, { method: "POST" });
      const updated = await res.json();
  
      if (updated.success) {
        refreshSolutions(); 
      } else {
        console.error("Upvote failed");
      }
    } catch (error) {
      console.error("Error in upvoteSolution:", error);
    }
  };
  
  const downvoteSolution = async (solutionId) => {
    try {
      const res = await fetch(`http://localhost:5000/api/solutions/downvote/${solutionId}`, { method: "POST" });
      const updated = await res.json();
  
      if (updated.success) {
        refreshSolutions(); 
      } else {
        console.error("Downvote failed");
      }
    } catch (error) {
      console.error("Error in downvoteSolution:", error);
    }
  };
  
  
  return (
    <>
      
      <div className="question-container">
        <h1 className="question-title">{question?.title}</h1>
        <p>{question?.summary}</p>
        <p className="question-tags">{question?.tags.join(", ")}</p>

        <textarea
          className="solution-input"
          value={solutionText}
          onChange={(e) => setSolutionText(e.target.value)}
        />
        <button className="submit-btn" onClick={submitSolution}>Submit Solution</button>

        <h2>Solutions:</h2>
        <div className="solutions-container">
          {solutions.map(sol => (
            <div key={sol.id} className="solution-card">

              <div className="button-container">
                <button className="upvote-btn" onClick={() => upvoteSolution(sol.id)}>
                  <FontAwesomeIcon icon={faAngleUp} />
                </button>
                <p className="solution-votes">Votes: {sol.votes}</p>
                <button className="downvote-btn" onClick={() => downvoteSolution(sol.id)}>
                  <FontAwesomeIcon icon={faAngleDown}/>
                </button>
              </div>

              <div className="answer-cont">
                <p className="solution-text"><strong>{sol.solution}</strong></p>
                <br/>
                <span>On: {new Date(sol.created_at).toLocaleString()}</span>
              </div>
             
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
