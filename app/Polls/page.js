import { parseDatabaseArray } from "@/utils/dbHelpers";

export default function PollsPage() {
  return (
    <div className="p-8 space-y-4 bg-white text-blue-900 min-h-screen">
      <h1 className="text-3xl font-bold text-blue-900">Polls & Voting</h1>
      <p className="text-gray-700">
        Create secure polls and record votes for community decisions with
        automated results.
      </p>
      <a
        href="/dashboard"
        className="text-blue-600 underline hover:text-blue-800"
      >
        ← Back to Dashboard
      </a>
    </div>
  );
}
