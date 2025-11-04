import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/infrastructure/shared/ui/card";
import { Skeleton } from "@/infrastructure/shared/ui/skeleton";
import { LiveOperationsMap } from "../components/LiveOperationsMap";

interface LiveOperationsPanelProps {
  loading: boolean;
  heading: string;
  description: string;
}

export const LiveOperationsPanel = ({
  loading,
  heading,
  description,
}: LiveOperationsPanelProps) => (
  <Card className="h-full overflow-hidden">
    <CardHeader>
      <CardTitle className="text-2xl font-semibold tracking-tight">
        {heading}
      </CardTitle>
      <CardDescription>{description}</CardDescription>
    </CardHeader>
    <CardContent className="pb-6">
      {loading ? (
        <Skeleton className="h-[360px] w-full rounded-3xl" />
      ) : (
        <LiveOperationsMap />
      )}
    </CardContent>
  </Card>
);
