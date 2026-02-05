import { getDocumentById, getAllDocuments } from "@/lib/documents";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import Link from "next/link";
import { ArrowLeft, FileText, Clock, Folder } from "lucide-react";
import { notFound } from "next/navigation";

interface PageProps {
  params: { id: string };
}

export async function generateStaticParams() {
  const docs = await getAllDocuments();
  return docs.map((doc) => ({
    id: doc.id,
  }));
}

export default async function DocumentPage({ params }: PageProps) {
  const doc = await getDocumentById(params.id);

  if (!doc) {
    notFound();
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      {/* Breadcrumb */}
      <Link
        href="/list"
        className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-300 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to documents
      </Link>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">{doc.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <Folder className="w-4 h-4" />
                {doc.category}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                {doc.lastModified.toLocaleDateString()}
              </span>
              <span className="flex items-center gap-1">
                <FileText className="w-4 h-4" />
                {doc.content.length.toLocaleString()} chars
              </span>
            </div>
          </div>
        </div>

        {/* Links */}
        {doc.links.length > 0 && (
          <div className="mt-4">
            <p className="text-xs text-gray-500 mb-2">Linked documents:</p>
            <div className="flex flex-wrap gap-2">
              {doc.links.slice(0, 10).map((link, i) => (
                <span
                  key={i}
                  className="px-2 py-1 bg-gray-800 rounded text-xs text-gray-400"
                >
                  {link}
                </span>
              ))}
              {doc.links.length > 10 && (
                <span className="text-xs text-gray-600">
                  +{doc.links.length - 10} more
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <article className="prose prose-invert max-w-none">
        <MarkdownRenderer content={doc.content} />
      </article>

      {/* Footer */}
      <div className="mt-12 pt-6 border-t border-gray-800 text-sm text-gray-500">
        <p>Source: {doc.path}</p>
      </div>
    </div>
  );
}
