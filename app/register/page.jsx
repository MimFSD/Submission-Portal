"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import bcrypt from "bcryptjs";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "STUDENT",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Hash password on client (optional, can also do on server)
    const hashedPassword = bcrypt.hashSync(form.password, 10);

    // Send to API route to create user
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, password: hashedPassword }),
    });

    if (res.ok) {
      router.push("/login");
    } else {
      const data = await res.json();
      setError(data.error || "Something went wrong");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded shadow">
      <h2 className="text-2xl font-bold mb-4">Register</h2>

      {error && <p className="text-red-500 mb-2">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          placeholder="Name"
          className="input"
        />
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          placeholder="Email"
          className="input"
        />
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          required
          placeholder="Password"
          className="input"
        />
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="input"
        >
          <option value="STUDENT">Student</option>
          <option value="INSTRUCTOR">Instructor</option>
        </select>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary w-full"
        >
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
}
