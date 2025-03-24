import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { signIn, useSession } from "next-auth/react";
import dynamic from "next/dynamic";
import Navbar from "../../components/Navbar";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-python";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleUp, faAngleDown } from "@fortawesome/free-solid-svg-icons";
// import Editor from "../../components/Editor";
import TipTapEditor from "../../components/TipTapEditor";
import moment from "moment";


export default function QuestionPage() {
  const router = useRouter();
  const { id } = router.query;
  const [question, setQuestion] = useState(null);
  const [solutions, setSolutions] = useState([]);
  const [solutionText, setSolutionText] = useState("");
  const { data: session, status } = useSession();
  const [showFullQuestion, setShowFullQuestion] = useState(false);
  const [content, setContent] = useState("");
  const [editor, setEditor] = useState(null); 

 

  useEffect(() => {
    if (!session && status !== "loading") {
      signIn();
    } 
  }, [session, status]);

  useEffect(() => {
    if (id) {
      fetch(`http://localhost:5000/api/questions/${id}`)
        .then((res) => res.json())
        .then((data) => setQuestion(data));

      fetch(`http://localhost:5000/api/solutions/${id}`)
        .then((res) => res.json())
        .then((data) => {
          setSolutions(
            data.map((sol) => ({
              ...sol,
              solution:
                typeof sol.solution === "string"
                  ? sol.solution
                  : JSON.stringify(sol.solution),
            }))
          );
        });
    }
  }, [id]);

  useEffect(() => {
    if (question?.full_question) {
      Prism.highlightAll();
    }
  }, [question]);

  const submitSolution = () => {
    if (!content || typeof content !== "string" || !content.trim()) {
      alert("Insert your answer first before submitting!");
      return;
    }
    console.log("Submitting solution with user_id:", session?.user?.id); 
    fetch("http://localhost:5000/api/solutions/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question_id: id,
        user_name: session?.user?.name,
        solution: content.trim(),
      }),
    }).then(() => {
      setContent("");
      if (editor) editor.commands.clearContent();
      refreshSolutions();
    });
  };
  
  

  const refreshSolutions = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/solutions/${id}`);
      const data = await res.json();
      setSolutions(
        data.map((sol) => ({
          ...sol,
          solution:
            typeof sol.solution === "string"
              ? sol.solution
              : JSON.stringify(sol.solution),
        }))
      );
    } catch (error) {
      console.error("Error fetching updated solutions:", error);
    }
  };

  const upvoteSolution = async (solutionId) => {
    try {
      const res = await fetch(
        `http://localhost:5000/api/solutions/upvote/${solutionId}`,
        { method: "POST" }
      );
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
      const res = await fetch(
        `http://localhost:5000/api/solutions/downvote/${solutionId}`,
        { method: "POST" }
      );
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
      <Navbar />
      <div className="question-container">
        <h1 className="question-title">{question?.title}</h1>
        {!showFullQuestion ? (
          <>
            <p className="question-summary">
              {question?.summary}
              <button
                className="read-more-btn"
                onClick={() => setShowFullQuestion(true)}
              >
                Read More...
              </button>
            </p>
          </>
        ) : (
          <>
            <div
              className="question-content"
              dangerouslySetInnerHTML={{ __html: question?.full_question }}
            />
            <button
              className="read-more-btn"
              onClick={() => setShowFullQuestion(false)}
            >
              ...Show Less
            </button>
          </>
        )}
        <br/>
        <p className="tag-container">
          {question?.tags?.map((tag, index) => (
            <span key={index} className="tag-item">
              {tag}
            </span>
          ))}
        </p>
        <br/>
        <br/>
        {/* <Editor content={content} setContent={setContent} /> */}
        <TipTapEditor content={content} setContent={setContent} setEditor={setEditor} />
        <br/>

        <button className="submit-btn button" onClick={submitSolution}>
          Submit Solution
        </button>
        <br/>
        <br/>
        <h2>Solutions:</h2>
        <div className="solutions-container">
          {solutions.map((sol) => (
           <div>
            <br/>
            <div className="user-info">
            <div className="profile-pic-container">
            <img src="https://api.dicebear.com/7.x/avataaars/svg" alt="User Avatar" />
            </div>
              <div className="user-name">{sol.user_name}</div>
              <div className="reverse-time"> {moment(sol.created_at).fromNow()}</div>
            </div>
            <br/>   
            <div key={sol.id} className="solution-card">  
              <div className="button-container">
                <button
                  className="upvote-btn"
                  onClick={() => upvoteSolution(sol.id)}
                >
                  <FontAwesomeIcon icon={faAngleUp} />
                </button>
                <p className="solution-votes">Votes: {sol.votes}</p>
                <button
                  className="downvote-btn"
                  onClick={() => downvoteSolution(sol.id)}
                >
                  <FontAwesomeIcon icon={faAngleDown} />
                </button>
              </div>

              <div className="answer-cont">
                {sol.solution.includes("<") ? (
                  <div dangerouslySetInnerHTML={{ __html: sol.solution }} />
                ) : (
                  <p className="solution-text">{sol.solution}</p>
                )}
                <br />

              </div>
            </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
