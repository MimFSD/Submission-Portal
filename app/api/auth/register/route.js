import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req) {
  const { name, email, password, role } = await req.json();

  // Validate data (simple example)
  if (!name || !email || !password || !role)
    return new Response(JSON.stringify({ error: "Missing fields" }), {
      status: 400,
    });

  // Check if user exists
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser)
    return new Response(JSON.stringify({ error: "Email already registered" }), {
      status: 400,
    });

  // Create user (password already hashed by client)
  const user = await prisma.user.create({
    data: { name, email, password, role },
  });

  return new Response(JSON.stringify({ message: "User created" }), {
    status: 201,
  });
}
