'use client';

import React, { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen">
      <div className="container-max py-16">
        <div className="mx-auto max-w-2xl rounded-[2rem] border border-white/10 bg-white/5 p-8 backdrop-blur">
          <p className="text-sm uppercase tracking-[0.28em] text-gray-500">
            Something went wrong
          </p>
          <h1 className="mt-4 text-3xl font-bold md:text-4xl">
            The page failed to render.
          </h1>
          <p className="mt-3 text-gray-300">
            Check the browser console for details. You can also try again.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              onClick={reset}
              className="btn btn-primary rounded-full px-6 py-3"
            >
              Try again
            </button>
            <a
              href="/"
              className="btn btn-outline rounded-full px-6 py-3 text-center"
            >
              Go home
            </a>
          </div>
          {error?.digest ? (
            <p className="mt-6 text-xs text-gray-500">Digest: {error.digest}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

