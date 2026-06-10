import Link from "next/link";

export default function HomePage() {
  return (
    <main>
      <h1>BizFlow SA</h1>

      <p>
        Business Management Platform for South African SMEs
      </p>

      <div>
        <Link href="/login">Login</Link>
      </div>

      <div>
        <Link href="/register">Register</Link>
      </div>
    </main>
  );
}