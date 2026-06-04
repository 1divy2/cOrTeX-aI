import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/store/auth-store";

export const Route = createFileRoute("/auth")({
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { signIn, signUp, loading } = useAuthStore();

  const submit = async () => {
    setError("");

    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }

    const response = isLogin
      ? await signIn(email, password)
      : await signUp(email, password);

    if (response.error) {
      setError(response.error);
      return;
    }

    navigate({ to: "/workspace" });
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-6">
      <div className="absolute inset-0 opacity-[0.4] [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:64px_64px]" />

      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 30 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="paper-panel relative w-full max-w-md overflow-hidden rounded-[32px] border border-border bg-background p-8 shadow-xl"
      >
        <div className="relative">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-[20px] bg-foreground text-background shadow-sm">
              <Brain className="h-7 w-7" />
            </div>
            <div>
              <div className="inline-flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                <Sparkles className="h-3 w-3 text-accent" />
                AI Workspace
              </div>
              <h1 className="mt-3 font-display text-3xl font-bold tracking-tight text-foreground">
                corTeX<span className="italic text-accent">.ai</span>
              </h1>
            </div>
          </div>

          <p className="mt-6 text-sm font-medium leading-relaxed text-muted-foreground">
            Your intelligent productivity and second-brain operating system.
          </p>

          <div className="mt-8 flex rounded-[16px] border border-border bg-secondary p-1">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 rounded-[12px] px-4 py-3 text-sm font-bold transition-all ${
                isLogin
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 rounded-[12px] px-4 py-3 text-sm font-bold transition-all ${
                !isLogin
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-6 space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-14 w-full rounded-[16px] border border-border bg-background px-5 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-14 w-full rounded-[16px] border border-border bg-background px-5 text-sm font-medium text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-foreground"
            />
          </div>

          {error && (
            <div className="mt-4 rounded-[12px] border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm font-bold text-red-500">
              {error}
            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 flex h-14 w-full items-center justify-center rounded-[16px] bg-foreground text-sm font-bold text-background shadow-sm transition-transform hover:scale-[1.02] disabled:opacity-50"
          >
            {loading ? "Please wait..." : isLogin ? "Login" : "Create Account"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default AuthPage;