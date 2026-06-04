"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";

import {
  loginWithGoogle,
  loginWithEmail,
  signupWithEmail,
} from "@/firebase/auth";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function AuthModal({ open, onClose }: Props) {
  const [isSignup, setIsSignup] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  if (!open) return null;

  async function handleSubmit() {
    if (isSignup) {
      await signupWithEmail(name, email, password);
    } else {
      await loginWithEmail(email, password);
    }
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="paper-panel relative w-[92%] max-w-md overflow-hidden rounded-[32px] border border-border bg-background p-8 shadow-xl"
      >
        <button
          onClick={onClose}
          className="absolute right-5 top-5 text-muted-foreground transition hover:text-foreground"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-8 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[16px] bg-foreground shadow-sm">
            <Sparkles className="h-5 w-5 text-background" />
          </div>
          <div>
            <h2 className="font-display text-2xl font-bold text-foreground">
              {isSignup ? "Create account" : "Welcome back"}
            </h2>
            <p className="text-sm font-medium text-muted-foreground">
              Continue into corTeX
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {isSignup && (
            <input
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-[16px] border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-foreground focus:bg-background"
            />
          )}

          <input
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-[16px] border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-foreground focus:bg-background"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-[16px] border border-border bg-secondary px-4 py-3 text-sm font-medium text-foreground outline-none transition-colors focus:border-foreground focus:bg-background"
          />

          <button
            onClick={handleSubmit}
            className="w-full rounded-[16px] bg-foreground py-3 text-sm font-bold text-background shadow-sm transition-transform hover:scale-[1.01]"
          >
            {isSignup ? "Create account" : "Sign in"}
          </button>

          <button
            onClick={loginWithGoogle}
            className="w-full rounded-[16px] border border-border bg-background py-3 text-sm font-bold text-foreground transition-colors hover:border-foreground hover:bg-secondary"
          >
            Continue with Google
          </button>
        </div>

        <button
          onClick={() => setIsSignup(!isSignup)}
          className="mt-6 w-full text-center text-sm font-medium text-muted-foreground transition hover:text-foreground"
        >
          {isSignup
            ? "Already have an account? Sign in"
            : "Don't have an account? Create one"}
        </button>
      </motion.div>
    </div>
  );
}