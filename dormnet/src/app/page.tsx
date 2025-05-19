import { redirect } from "next/navigation";
// import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

/*
export function DashboardPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle>Welcome to DormNet</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4"></CardContent>
      </Card>
    </main>
  );
}
*/

export default function HomePage() {
  redirect("/login");
}
