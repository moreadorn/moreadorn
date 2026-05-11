import { Link } from "react-router";
import { Home } from "lucide-react";

export function NotFound() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-[#C8A96A] mb-4">404</h1>
        <h2 className="text-4xl font-bold text-[#0B0B0B] mb-4">Page Not Found</h2>
        <p className="text-[#6B7280] text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        <Link
          to="/"
          className="inline-flex items-center space-x-2 bg-[#C8A96A] text-white px-6 py-3 rounded-md hover:bg-[#E6D3A3] transition-colors"
        >
          <Home size={20} />
          <span>Back to Home</span>
        </Link>
      </div>
    </div>
  );
}
