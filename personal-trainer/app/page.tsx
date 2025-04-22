"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignIn = async (event: React.FormEvent) => {
    event.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement)
      .value;

    const res = await fetch("/api/authenticate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (data.success) {
      // Set token here

      router.push("/pages/dashboard");
    } else {
      alert("Authentication failed: " + (data.error || "Invalid credentials"));
    }
  };

  return (
    <div>
      <h1>Personal Trainer</h1>
      <br />
      <form onSubmit={handleSignIn}>
        <label>E-mail</label>
        <br />
        <input id="email" placeholder="Your e-mail here" required />
        <br />
        <label>Password</label>
        <br />
        <input id="password" placeholder="Your password here" required />
        <br />
        <br />
        <button type="submit">Sign In</button>
      </form>
      <br />
      <p>
        Don't have an account?{" "}
        <Link href="/pages/create-account">Create an Acount</Link>
      </p>
    </div>
  );
}
