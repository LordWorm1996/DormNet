import { Card, CardContent, CardHeader, CardTitle } from "@ui/card";
import { LogoFullLink } from "@ui/shared";
import { getSession } from "@lib/session";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await getSession();

  if (!session.user) {
    redirect("/login");
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader>
          <CardTitle className="flex space-x-1">
            <div>Welcome to </div>
            <LogoFullLink />
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <p className="text-sm text-gray-600">Logged in as:</p>
            <p className="font-medium">{session.user.email}</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
