import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Sign out from the session
    router.push("/"); // Redirect to home page after logout(bug fixed)
  };

  return (
    <nav className="navbar">
      <h2> DevSolve</h2>
      <div className="nav-links">
          <Link href="/">Home</Link>
      </div>
      <div>
        {session ? (
          <>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
      </div>
    </nav>
  );
}
