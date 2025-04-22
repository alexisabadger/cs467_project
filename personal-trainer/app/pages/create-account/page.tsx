import React from "react";

export default function CreateAccount() {
  return (
    <div>
      <h1>Create Account</h1>
      <form>
        <label>First Name</label>
        <br />
        <input />
        <label>Last Name</label>
        <br />
        <input />
        <label>E-mail</label>
        <br />
        <input />
        <br />
        <label>Password</label>
        <input />
        <br />
        <label>Confirm Password</label>
        <input />
        <br />
        <br />
        <button>Create Account</button>
      </form>
    </div>
  );
}
