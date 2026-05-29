"use client";

import { useState } from "react";

import { motion } from "framer-motion";

import {
  Sparkles,
  X,
} from "lucide-react";

import {
  loginWithGoogle,
  loginWithEmail,
  signupWithEmail,
} from "@/firebase/auth";

interface Props {
  open: boolean;

  onClose: () => void;
}

export function AuthModal({
  open,
  onClose,
}: Props) {
  const [isSignup, setIsSignup] =
    useState(false);

  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  if (!open) return null;

  async function handleSubmit() {
    if (isSignup) {
      await signupWithEmail(
        name,
        email,
        password
      );
    } else {
      await loginWithEmail(
        email,
        password
      );
    }

    onClose();
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/50 backdrop-blur-xl">

      <motion.div
        initial={{
          opacity: 0,
          scale: 0.95,
          y: 10,
        }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
        }}
        transition={{
          duration: 0.25,
        }}
        className="glass-strong relative w-[92%] max-w-md overflow-hidden rounded-[32px] border border-white/10 p-8 shadow-glow"
      >

        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-white/60 transition hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 flex items-center gap-3">

          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-aurora shadow-glow">

            <Sparkles className="h-5 w-5 text-black" />

          </div>

          <div>

            <h2 className="font-display text-2xl font-semibold text-white">

              {isSignup
                ? "Create account"
                : "Welcome back"}

            </h2>

            <p className="text-sm text-muted-foreground">

              Continue into corTeX.ai

            </p>

          </div>

        </div>

        <div className="space-y-4">

          {isSignup && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) =>
                setName(
                  e.target.value
                )
              }
              className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-white/20"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-white/20"
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
            className="w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3 text-white outline-none transition focus:border-white/20"
          />

          <button
            onClick={handleSubmit}
            className="w-full rounded-2xl bg-aurora py-3 font-medium text-black shadow-glow transition hover:scale-[1.01]"
          >

            {isSignup
              ? "Create account"
              : "Sign in"}

          </button>

          <button
            onClick={loginWithGoogle}
            className="w-full rounded-2xl border border-white/10 bg-white/[0.03] py-3 font-medium text-white transition hover:bg-white/[0.06]"
          >
            Continue with Google
          </button>

        </div>

        <button
          onClick={() =>
            setIsSignup(
              !isSignup
            )
          }
          className="mt-6 text-sm text-muted-foreground transition hover:text-white"
        >

          {isSignup
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}

        </button>

      </motion.div>

    </div>
  );
}