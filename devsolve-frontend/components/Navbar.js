import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false }); // Sign out from the session
    router.push("/"); // Redirect to home page after logout
  };

  return (
    <nav className="navbar">
      <div>
      <Link href="/"> <h2 className="logo"> DevSolve</h2></Link>
        <p>Welcome, {session?.user?.name || "Guest"}</p> {/* Added optional chaining */}
      </div>
      <div className="nav-links">
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
      </div>
      <div>
        {session ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <button onClick={() => signIn()}>Login</button>
        )}
      </div>
    </nav>
  );
}
