import { Helmet } from "react-helmet";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { ArrowLeft, ShieldCheck, Lock, Database, Mail, Cookie, UserCheck, AlertTriangle } from "lucide-react";

export default function Trust() {
  return (
    <>
      <Helmet>
        <title>Trust & Security — Mabior Agau</title>
        <meta name="description" content="How mabioragau.com handles security, privacy, and your data." />
        <link rel="canonical" href="/trust" />
        <meta property="og:title" content="Trust & Security — Mabior Agau" />
        <meta property="og:description" content="How mabioragau.com handles security, privacy, and your data." />
        <meta property="og:url" content="/trust" />
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-20 max-w-3xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-primary hover:text-primary-glow transition-colors font-mono text-sm"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>cd ../home</span>
          </Link>
        </div>

        <header className="space-y-4 mb-10">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/30">
              [TRUST_CENTER]
            </span>
          </div>
          <h1 className="font-display font-extrabold tracking-tight text-[clamp(1.875rem,5vw,3rem)] leading-[1.05] text-foreground">
            Trust &amp; Security
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            This page is maintained by Mabior Agau to answer common security and privacy questions about
            mabioragau.com. It describes current, app-visible practices &mdash; it is not an independent
            certification or audit report.
          </p>
        </header>

        <div className="space-y-6">
          <Section icon={<ShieldCheck className="h-5 w-5 text-primary" />} title="Shared responsibility">
            <p>
              mabioragau.com is built on the Lovable platform and uses Supabase for authentication,
              database, storage, and serverless functions. Platform-level infrastructure security is
              managed by those providers; application configuration, content, and access controls are
              maintained by Mabior Agau.
            </p>
          </Section>

          <Section icon={<UserCheck className="h-5 w-5 text-primary" />} title="Access &amp; authentication">
            <ul className="list-disc pl-5 space-y-1">
              <li>Email/password authentication via Supabase Auth.</li>
              <li>Administrative actions are gated by a server-side role check against a dedicated roles table.</li>
              <li>Row-Level Security policies are enabled on user-facing tables.</li>
            </ul>
          </Section>

          <Section icon={<Lock className="h-5 w-5 text-primary" />} title="Data in transit &amp; at rest">
            <p>
              Traffic to the site is served over HTTPS. Application data is stored in Supabase, which
              encrypts data at rest and in transit using its managed infrastructure. We do not implement
              additional end-to-end encryption beyond what the platform provides.
            </p>
          </Section>

          <Section icon={<Database className="h-5 w-5 text-primary" />} title="Data we collect">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Contact submissions:</strong> name, email, and message you send via the contact form or chatbot.</li>
              <li><strong>Newsletter subscriptions:</strong> email address and confirmation status.</li>
              <li><strong>Account data:</strong> for admin accounts only &mdash; email and authentication metadata.</li>
              <li><strong>Visitor analytics:</strong> aggregated, non-identifying usage signals to understand traffic.</li>
            </ul>
          </Section>

          <Section icon={<Mail className="h-5 w-5 text-primary" />} title="Email">
            <p>
              Transactional emails (contact confirmations, newsletter confirmations, admin notifications)
              are sent via Resend. User-supplied content is HTML-escaped before being placed into email
              templates to prevent injection.
            </p>
          </Section>

          <Section icon={<Cookie className="h-5 w-5 text-primary" />} title="Cookies &amp; tracking">
            <p>
              The site uses functional cookies/local storage required for session management and theme
              preferences. We do not sell personal data or run third-party advertising trackers.
            </p>
          </Section>

          <Section icon={<AlertTriangle className="h-5 w-5 text-primary" />} title="Reporting a vulnerability">
            <p>
              If you believe you have found a security issue, please email{" "}
              <a className="text-primary hover:underline" href="mailto:info@mabioragau.com">
                info@mabioragau.com
              </a>{" "}
              with a description and reproduction steps. Please do not publicly disclose the issue before
              we have had an opportunity to investigate and respond.
            </p>
          </Section>

          <Section title="Subprocessors">
            <ul className="list-disc pl-5 space-y-1">
              <li><strong>Lovable</strong> &mdash; hosting and application platform.</li>
              <li><strong>Supabase</strong> &mdash; authentication, database, storage, edge functions.</li>
              <li><strong>Resend</strong> &mdash; transactional email delivery.</li>
            </ul>
          </Section>

          <Section title="Compliance">
            <p>
              mabioragau.com is an independent professional website. It does not claim SOC 2, ISO 27001,
              HIPAA, or PCI DSS certification. For specific compliance questions related to a
              consulting engagement, please contact Mabior Agau directly.
            </p>
          </Section>

          <Card className="p-4 text-xs text-muted-foreground font-mono">
            Last updated: {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </Card>
        </div>
      </main>
    </>
  );
}

function Section({
  icon,
  title,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <Card className="p-6 glass-panel border-border">
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="font-display text-xl font-bold tracking-tight">{title}</h2>
      </div>
      <div className="text-foreground/90 leading-relaxed space-y-2 text-sm">{children}</div>
    </Card>
  );
}
