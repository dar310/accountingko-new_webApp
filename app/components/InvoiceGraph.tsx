import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Graph } from "./Graph";
import { prisma } from "../utils/db";
import { requireUser } from "../utils/hooks";

async function getInvoices(userId: string) {
  const rawData = await prisma.invoice.findMany({
    where: {
      status: "PAID",
      userId: userId,
      createdAt: {
        lte: new Date(),
        gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // last 30 days
      },
    },
    select: {
      date: true,
      total: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  // ✅ Group totals by date in YYYY-MM-DD format
  const aggregatedData = rawData.reduce(
    (acc: { [date: string]: number }, curr) => {
      const date = curr.date.toLocaleDateString("en-CA"); 
      acc[date] = (acc[date] || 0) + Number(curr.total);
      return acc;
    },
    {}
  );

  // ✅ Convert to array and sort by date
  const transformedData = Object.entries(aggregatedData)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return transformedData;
}

export async function InvoiceGraph() {
  const session = await requireUser();
  const data = await getInvoices(session.user?.id as string);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Paid Invoices</CardTitle>
        <CardDescription>
          Invoices which have been paid in the last 30 days.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Graph data={data} />
      </CardContent>
    </Card>
  );
}
