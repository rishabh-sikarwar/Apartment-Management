import QRCodeDisplay from "@/components/QrCodeDisplay";
import { db } from "@/lib/prisma";

export default async function VisitorPage({ params }) {
  let ID = await params.id;
  if (!ID) {
    return <div className="text-red-500 p-4 text-center">Visitor ID is required</div>;
  }

  const visitor = await db.visitor.findUnique({
    where: { id: ID},
  })

  if (!visitor) {
    return <div className="text-red-500 p-4 text-center">Visitor not found</div>;
  }

  const visitorUrl = `${visitor.qrCodeToken}`;

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold mb-4">Visitor QR Code</h1>
      <QRCodeDisplay qrCodeUrl={visitorUrl} task="visitor" name={visitor.name} />
      <p className="mt-4 text-gray-600">
        Visitor Name: <strong>{visitor.name}</strong>
      </p>
    </div>
  );
}
