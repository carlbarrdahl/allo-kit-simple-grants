"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import { Variables } from "~/hooks/use-indexer";
import { useAllocations } from "~/hooks/use-allocate";

export function AllocationsTable({ query }: { query: Variables }) {
  const { data: allocations } = useAllocations(query);
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Amount</TableHead>
          <TableHead>From</TableHead>
          <TableHead>Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {allocations?.items.map((allocation) => (
          <TableRow key={allocation.id}>
            <TableCell>{allocation.amount}</TableCell>
            <TableCell>{allocation.from}</TableCell>
            <TableCell>
              {new Intl.DateTimeFormat("en-GB", {
                dateStyle: "short",
                timeStyle: "short",
              }).format(new Date(allocation.createdAt * 1000))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
