import { SessionProvider, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";
import "../styles/globals.css";

function AuthGuard({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/");
    }
  }, [status, router]);

  if (status === "loading") return <p>Loading...</p>;
  return children;
}

export default function App({ Component, pageProps }) {
  return (
    <SessionProvider session={pageProps.session}>
      <Navbar />
      <AuthGuard>
        <Component {...pageProps} />
      </AuthGuard>
    </SessionProvider>
  );
}
