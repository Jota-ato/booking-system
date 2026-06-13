import 'dotenv/config'
import { auth } from "../../lib/auth";

async function main() {
  const email = "jcesarpro10@gmail.com";
  const name  = "Julio César";

  if (!email || !name) {
    throw new Error(
      "Set ADMIN_EMAIL and ADMIN_NAME in .env.local before running the seed.",
    );
  }

  console.log(`Creating admin user: ${email}`);

  const user = await auth.api.createUser({
    body: {
      name,
      email,
      password: crypto.randomUUID() + crypto.randomUUID(),
      role: "admin",
    },
  });

  console.log("✓ Admin created:", user.user.id);
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});