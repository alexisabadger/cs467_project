import React from "react";

export default function CreateAccount() {
  return (
    <div>
      <h1>Create Account</h1>
      <form>
        <label htmlFor="firstname">First Name:</label>
        <br />
        <input type="text" id="firstname" name="firstname" required />
        <br />
        <br />

        <label htmlFor="lastname">Last Name:</label>
        <br />
        <input type="text" id="lastname" name="lastname" required />
        <br />
        <br />

        <label htmlFor="email">Email:</label>
        <br />
        <input type="email" id="email" name="email" required />
        <br />
        <br />

        <label htmlFor="password">Password:</label>
        <br />
        <input type="password" id="password" name="password" required />
        <br />
        <br />

        <label htmlFor="confirm-password">Confirm Password:</label>
        <br />
        <input
          type="password"
          id="confirm-password"
          name="confirm_password"
          required
        />
        <br />
        <br />
        <button>Create Account</button>
      </form>
    </div>
  );
}
