"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@bizflow/ui";

import { apiFetch } from "../../lib/api";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setLoading(true);
      setError("");

      const result = await apiFetch(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({
            email,
            password
          })
        }
      );

      localStorage.setItem(
        "accessToken",
        result.accessToken
      );

      router.push("/dashboard");
    } catch (err) {
      setError(
        "Invalid email or password"
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="mb-2 text-3xl font-bold">
          BizFlow
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Sign in to continue
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          <div>
            <label className="mb-1 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              className="w-full rounded-md border border-slate-300 px-3 py-2"
              required
            />
          </div>

          {error ? (
            <p className="text-sm text-red-600">
              {error}
            </p>
          ) : null}

          <Button
            type="submit"
            disabled={loading}
            className="w-full"
          >
            {loading
              ? "Signing In..."
              : "Sign In"}
          </Button>
        </form>
      </div>
    </main>
  );
}