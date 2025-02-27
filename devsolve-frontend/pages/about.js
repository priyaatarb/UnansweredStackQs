import Navbar from "../components/Navbar";

export default function About() {
  return (
    <>
      <Navbar />
      <div className="about-container">
            
           <div className="text-box">
                <h1>About DevSolve</h1>
                    <br/>
                    <p>
                    DevSolve is a platform that helps developers find and solve unanswered coding questions.
                    </p>
                    Users can browse, submit solutions, and contribute to collaborative learning.
                    <p>
                    Built using Next.js, Node.js, and Postgres Database, it integrates authentication via NextAuth and supports GitHub/Google login.
                    </p>
                    <p>
                    Our mission is to create a community-driven problem-solving space where developers can share knowledge and improve their skills.
                    </p>

                    <footer style={{ marginTop: "20px", textAlign: "center" }}>
                    <p>&copy; 2025 DevSolve</p>
                </footer>
           </div>
            
        </div>
        
      
    </>
  );
}
