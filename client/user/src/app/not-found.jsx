// app/not-found.js
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-lg mb-6">Page not found</p>
      <Link
        href="/"
        className="px-4 py-2 bg-primary text-white rounded hover:bg-primary/80 transition"
      >
        Go Home
      </Link>
    </div>
  );
}
