import { createFileRoute } from "@tanstack/react-router";

import {
  motion,
} from "framer-motion";

import {
  Brain,
  Sparkles,
} from "lucide-react";

import {
  useState,
} from "react";

import {
  useNavigate,
} from "@tanstack/react-router";

import {
  useAuthStore,
} from "@/store/auth-store";

export const Route =
  createFileRoute("/auth")({
    component: AuthPage,
  });

function AuthPage() {
  const navigate =
    useNavigate();

  const [
    isLogin,
    setIsLogin,
  ] = useState(true);

  const [
    email,
    setEmail,
  ] = useState("");

  const [
    password,
    setPassword,
  ] = useState("");

  const [
    error,
    setError,
  ] = useState("");

  const {
    signIn,
    signUp,
    loading,
  } = useAuthStore();

  const submit =
    async () => {
      setError("");

      if (
        !email ||
        !password
      ) {
        setError(
          "Please fill all fields"
        );

        return;
      }

      const response =
        isLogin
          ? await signIn(
              email,
              password
            )
          : await signUp(
              email,
              password
            );

      if (
        response.error
      ) {
        setError(
          response.error
        );

        return;
      }

      navigate({
        to: "/workspace",
      });
    };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-black px-6 text-white">

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(168,85,247,0.2),transparent_25%),radial-gradient(circle_at_bottom_right,rgba(34,211,238,0.16),transparent_25%)]" />

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
          y: 30,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        className="relative w-full max-w-md overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.03] p-8 shadow-[0_0_80px_rgba(168,85,247,0.2)] backdrop-blur-3xl"
      >

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(168,85,247,0.16),transparent_50%)]" />

        <div className="relative">

          <div className="flex items-center gap-4">

            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 shadow-[0_0_40px_rgba(168,85,247,0.35)]">

              <Brain className="h-7 w-7 text-white" />

            </div>

            <div>

              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-zinc-300">

                <Sparkles className="h-3 w-3 text-purple-300" />

                AI Workspace

              </div>

              <h1 className="mt-3 text-4xl font-black tracking-tight">

                corTeX.ai

              </h1>

            </div>

          </div>

          <p className="mt-6 text-sm leading-relaxed text-zinc-400">

            Your intelligent productivity and second-brain operating system.

          </p>

          <div className="mt-8 flex rounded-2xl border border-white/10 bg-white/[0.03] p-1">

            <button
              onClick={() =>
                setIsLogin(
                  true
                )
              }
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                isLogin
                  ? "bg-purple-500 text-white"
                  : "text-zinc-400"
              }`}
            >

              Login

            </button>

            <button
              onClick={() =>
                setIsLogin(
                  false
                )
              }
              className={`flex-1 rounded-xl px-4 py-3 text-sm font-medium transition ${
                !isLogin
                  ? "bg-purple-500 text-white"
                  : "text-zinc-400"
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
              onChange={(e) =>
                setEmail(
                  e.target.value
                )
              }
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500/30"
            />

            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) =>
                setPassword(
                  e.target.value
                )
              }
              className="h-14 w-full rounded-2xl border border-white/10 bg-white/[0.03] px-5 text-sm text-white outline-none transition placeholder:text-zinc-500 focus:border-purple-500/30"
            />

          </div>

          {error && (
            <div className="mt-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">

              {error}

            </div>
          )}

          <button
            onClick={submit}
            disabled={loading}
            className="mt-6 flex h-14 w-full items-center justify-center rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-400 text-sm font-semibold text-white shadow-[0_0_40px_rgba(168,85,247,0.35)] transition hover:scale-[1.02] disabled:opacity-50"
          >

            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}

          </button>

        </div>

      </motion.div>

    </div>
  );
}

export default AuthPage;