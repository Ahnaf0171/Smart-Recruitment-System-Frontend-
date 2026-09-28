import { Card, CardContent } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function StatCard({
  icon = <Users className="w-6 h-6 text-primary" />,
  title = "Title",
  description = "Description",
}: {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
}) {
  return (
    <Card className="group animate-fade-in">
      <CardContent>
        <div className="flex items-center ">
          <div className="rounded-lg bg-primary/10 border p-3 mr-4 group-hover:border-primary/30 transition-all duration-300">
            {icon}
          </div>
          <div>
            <div className="text-2xl font-bold text-foreground">{title}</div>
            <div className="text-sm text-muted-foreground">{description}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
