import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoFullLink } from "@/components/ui/shared";

export default function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className={"flex space-x-1"}>
            <div>Welcome to </div>
            <LogoFullLink />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card>
    </main>
  );
}
