type Props = { documentId: string; onComplete?: () => void };

export default function ReviewExtraction({ documentId, onComplete }: Props) {
  return (
    <div className="p-6 border rounded">
      <h2 className="text-xl font-semibold mb-2">Review Extraction (placeholder)</h2>
      <p className="text-gray-600">Document ID: {documentId}</p>
      {onComplete && (
        <button className="mt-4 border rounded px-3 py-1" onClick={() => onComplete()}>
          Mark Complete
        </button>
      )}
    </div>
  );
}
