import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-200 dark:text-gray-800 mb-4">404</div>
        <h1 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">Page not found</h1>
        <p className="text-gray-500 mb-6">The page you're looking for doesn't exist.</p>
        <Link href="/" className="text-brand-600 hover:underline text-sm">← Back to home</Link>
      </div>
    </div>
  );
}
