
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { Link } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="text-center bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md">
        <h1 className="text-4xl font-bold mb-2 text-guardai-red">404</h1>
        <p className="text-xl text-guardai-darkgray mb-6">Page not found</p>
        <p className="text-guardai-gray mb-6">
          The page you are looking for might have been removed or is temporarily unavailable.
        </p>
        <Button asChild className="bg-guardai-red hover:bg-guardai-red/90">
          <Link to="/" className="flex items-center gap-2">
            <Home size={18} />
            <span>Return to Command Center</span>
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
