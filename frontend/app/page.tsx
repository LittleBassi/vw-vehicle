import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
const token = (await cookies()).get("token")?.value ?? null;

if (!token) {
redirect("/login");
}
redirect("/dashboard");
}