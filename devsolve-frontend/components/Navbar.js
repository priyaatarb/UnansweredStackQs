import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
import { useRouter } from "next/router";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/");
  };

  return (
    <nav className="navbar">
      <div>
        <Link href="/">
          <h2 className="logo">DevSolve</h2>
        </Link>
        <p>Welcome, {session?.user?.name || "Guest"}</p>
      </div>
      <div className="nav-links">
        <Link href="/" className={router.pathname === "/" ? "active" : ""}>
          Home
        </Link>
        <Link href="/about" className={router.pathname === "/about" ? "active" : ""}>
          About
        </Link>
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
