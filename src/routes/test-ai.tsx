import {
  createFileRoute,
} from "@tanstack/react-router";

import {
  useState,
} from "react";

import {
  askGemini,
} from "@/lib/gemini";

export const Route =
  createFileRoute(
    "/test-ai"
  )({
    component: TestAI,
  });

function TestAI() {
  const [
    response,
    setResponse,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  async function test() {
    try {
      setLoading(true);

      const res =
        await askGemini(
          "Say hello like a futuristic AI assistant."
        );

      console.log(
        "Gemini Response:",
        res
      );

      setResponse(res);
    } catch (err) {
      console.error(
        "Gemini Error:",
        err
      );

      setResponse(
        "ERROR: " +
          String(err)
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-black p-10 text-white">

      <button
        onClick={test}
        className="rounded-xl bg-purple-500 px-6 py-3"
      >

        {loading
          ? "Loading..."
          : "Test Gemini"}

      </button>

      <pre className="mt-8 whitespace-pre-wrap text-sm text-zinc-300">

        {response}

      </pre>

    </div>
  );
}