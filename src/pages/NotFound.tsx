import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import notFoundImg from "@/assets/404-illustration.png";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center max-w-lg mx-auto px-6 animate-fade-up">
        <img src={notFoundImg} alt="404 - Pagină negăsită" className="w-72 mx-auto mb-8 rounded-2xl" />
        <div className="font-serif text-2xl tracking-tight mb-2">
          Society<span className="text-gold">HUB</span>
        </div>
        <h1 className="text-6xl font-bold text-gold mb-4">404</h1>
        <p className="text-lg text-dim mb-2">Pagină negăsită</p>
        <p className="text-sm text-dim2 mb-8">
          Ruta <code className="px-2 py-0.5 bg-surface2 rounded text-foreground text-xs">{location.pathname}</code> nu există în aplicație.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 bg-gold text-primary-foreground font-semibold rounded-lg text-sm hover:bg-gold/90 transition-colors"
          >
            ← Dashboard
          </button>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 bg-surface2 text-foreground font-semibold rounded-lg text-sm border border-subtle hover:bg-surface2/80 transition-colors"
          >
            Înapoi
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
