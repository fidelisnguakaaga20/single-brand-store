// app/login/page.tsx
"use client";

import { FormEvent, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function LoginPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

  const [email, setEmail] = useState("admin@example.com");
  const [password, setPassword] = useState("Admin123!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Invalid credentials.");
        setLoading(false);
        return;
      }

      router.push(callbackUrl);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            Sign in to Admin
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Use the admin credentials to access the dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-red-600 border border-red-200 rounded-md px-3 py-2 bg-red-50">
              {error}
            </p>
          )}

          <div className="space-y-1">
            <label className="text-sm font-medium text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              autoComplete="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="space-y-1">
            <label
              className="text-sm font-medium text-gray-700"
              htmlFor="password"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="text-center text-xs text-gray-500 space-y-1">
          <p>
            Admin: <span className="font-mono">admin@example.com</span>
          </p>
          <p>
            Password: <span className="font-mono">Admin123!</span>
          </p>
        </div>

        <div className="text-center text-sm">
          <Link
            href="/shop"
            className="text-gray-600 hover:text-black underline underline-offset-4"
          >
            ← Back to shop
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  // Suspense wrapper required by Next 16 for useSearchParams
  return (
    <Suspense fallback={null}>
      <LoginPageInner />
    </Suspense>
  );
}


// // app/login/page.tsx
// "use client";

// import { FormEvent, useState } from "react";
// import { useRouter, useSearchParams } from "next/navigation";
// import Link from "next/link";

// export default function LoginPage() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const callbackUrl = searchParams.get("callbackUrl") ?? "/admin";

//   const [email, setEmail] = useState("admin@example.com");
//   const [password, setPassword] = useState("Admin123!");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   async function handleSubmit(e: FormEvent) {
//     e.preventDefault();
//     setError(null);
//     setLoading(true);

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok || !data.success) {
//         setError(data.message || "Invalid credentials.");
//         setLoading(false);
//         return;
//       }

//       router.push(callbackUrl);
//     } catch (err) {
//       console.error(err);
//       setError("Something went wrong. Please try again.");
//       setLoading(false);
//     }
//   }

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
//       <div className="w-full max-w-md bg-white rounded-xl shadow-md p-6 space-y-6">
//         <div className="text-center">
//           <h1 className="text-2xl font-semibold tracking-tight">
//             Sign in to Admin
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">
//             Use the admin credentials to access the dashboard.
//           </p>
//         </div>

//         <form onSubmit={handleSubmit} className="space-y-4">
//           {error && (
//             <p className="text-sm text-red-600 border border-red-200 rounded-md px-3 py-2 bg-red-50">
//               {error}
//             </p>
//           )}

//           <div className="space-y-1">
//             <label className="text-sm font-medium text-gray-700" htmlFor="email">
//               Email
//             </label>
//             <input
//               id="email"
//               type="email"
//               autoComplete="email"
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           <div className="space-y-1">
//             <label
//               className="text-sm font-medium text-gray-700"
//               htmlFor="password"
//             >
//               Password
//             </label>
//             <input
//               id="password"
//               type="password"
//               autoComplete="current-password"
//               className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-black focus:border-black"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full rounded-md bg-black text-white py-2.5 text-sm font-medium hover:bg-gray-900 disabled:opacity-60"
//           >
//             {loading ? "Signing in..." : "Sign in"}
//           </button>
//         </form>

//         <div className="text-center text-xs text-gray-500 space-y-1">
//           <p>
//             Admin: <span className="font-mono">admin@example.com</span>
//           </p>
//           <p>
//             Password: <span className="font-mono">Admin123!</span>
//           </p>
//         </div>

//         <div className="text-center text-sm">
//           <Link
//             href="/shop"
//             className="text-gray-600 hover:text-black underline underline-offset-4"
//           >
//             ← Back to shop
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }
