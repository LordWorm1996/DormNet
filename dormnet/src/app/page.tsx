import { redirect } from "next/navigation";

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

const fromNode = async () => {
  const res = await fetch("http://localhost:5000/random-quote"); //change port if different
  return res.json();
};

export async function Main() {
  const nodeMsg = await fromNode();

  return <div>{nodeMsg.quote}</div>;
}

export default function HomePage() {
  redirect("/dashboard");
}
