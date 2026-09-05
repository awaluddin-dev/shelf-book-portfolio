import AdminLogin from "@/views/admin-login/ui/AdminLogin";

export default function Page() {
  const turnstileSiteKey = process.env.TURNSTILE_SITE_KEY || "";

  return <AdminLogin turnstileSiteKey={turnstileSiteKey} />;
}
