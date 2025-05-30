"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
export default function ForgotPasswordPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process request");
      }

      setMessage({
        text:
          data.message ||
          "The admin has been notified and will reset your password shortly.",
        isError: false,
      });

      setUsername("");
    } catch (error) {
      setMessage({
        text:
          error instanceof Error ? error.message : "Failed to process request",
        isError: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-6 text-center">Reset Password</h1>

      <p className="mb-4 text-gray-600">
        Enter your username to request a password reset. An admin will process
        your request shortly.
      </p>

      {message && (
        <div
          className={`mb-4 p-3 rounded-md ${
            message.isError
              ? "bg-red-100 text-red-800"
              : "bg-green-100 text-green-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="username" className="block text-sm font-medium mb-1">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            autoFocus
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? "Processing..." : "Request Reset"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        <button
          onClick={() => router.push("/login")}
          className="text-blue-600 hover:underline"
        >
          Remember your password? Sign in
        </button>
      </div>
    </div>
  );
}
