"use client";

export default function GlobalError({ error, reset }) {
  return (
    <html>
      <body className="flex h-screen flex-col items-center justify-center bg-black text-white">
        <h2 className="text-2xl font-bold text-red-500">Critical Error</h2>
        <p className="mb-4 text-gray-400">Something went wrong globally.</p>
        <button
          onClick={() => reset()}
          className="rounded bg-purple-600 px-4 py-2 hover:bg-purple-700"
        >
          Try again
        </button>
      </body>
    </html>
  );
}