"use client";
import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const handleSignIn = (event: React.FormEvent) => {
    event.preventDefault();
    // Form submission logic here

    router.push("/pages/dashboard");
  };

  return (
    <div>
      <h1>Personal Trainer</h1>
      <br />
      <form onSubmit={handleSignIn}>
        <label>E-mail</label>
        <br />
        <input placeholder="Your e-mail here" />
        <br />
        <label>Password</label>
        <br />
        <input placeholder="Your password here" />
        <br />
        <br />
        <button type="submit">Sign In</button>
      </form>
      <br />
      <p>Don't have an account?</p>
      <Link href="/pages/create-account">Create an Acount</Link>
    </div>
  );
}
