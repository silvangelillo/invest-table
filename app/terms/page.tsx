"use client";

import Link from "next/link";
import { TrendingUp, ArrowLeft, Shield, AlertTriangle, Scale } from "lucide-react";
import { NPSSurvey } from "@/components/ui/NPSSurvey";

const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');
  * { -webkit-font-smoothing: antialiased; box-sizing: border-box; }
  @keyframes fadeUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:translateY(0)} }
  .fade { animation: fadeUp 0.6s ease both; }
`;

// ─── Section heading ──────────────────────────────────────────────────────────
function Section({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section style={{ paddingBottom: 36, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: 14 }}>
        <span style={{
          fontSize: 11, fontWeight: 700, color: "rgba(59,130,246,0.7)",
          fontVariantNumeric: "tabular-nums", letterSpacing: "0.04em",
          flexShrink: 0,
        }}>
          {String(n).padStart(2, "0")}
        </span>
        <h2 style={{
          fontSize: 17, fontWeight: 600, color: "rgba(255,255,255,0.88)",
          letterSpacing: "-0.01em", margin: 0,
        }}>
          {title}
        </h2>
      </div>
      <div style={{ paddingLeft: 30 }}>
        {children}
      </div>
    </section>
  );
}

// ─── Body text helpers ────────────────────────────────────────────────────────
const P: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{ fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 300, lineHeight: 1.75, marginBottom: 12 }}>
    {children}
  </p>
);

const Li: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <li style={{
    fontSize: 14, color: "rgba(255,255,255,0.5)", fontWeight: 300,
    lineHeight: 1.7, marginBottom: 6, paddingLeft: 8,
  }}>
    {children}
  </li>
);

const Strong: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <strong style={{ color: "rgba(255,255,255,0.75)", fontWeight: 600 }}>{children}</strong>
);

const Ul: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <ul style={{ paddingLeft: 20, marginBottom: 12, listStyleType: "disc", color: "rgba(255,255,255,0.25)" }}>
    {children}
  </ul>
);

const SubHeading: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p style={{
    fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)",
    marginBottom: 8, marginTop: 16, letterSpacing: "-0.005em",
  }}>
    {children}
  </p>
);

const CapsBlock: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{
    fontSize: 12, color: "rgba(255,255,255,0.4)", lineHeight: 1.75,
    background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
    borderRadius: 12, padding: "16px 18px", marginBottom: 12,
    fontWeight: 400,
  }}>
    {children}
  </div>
);

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function TermsPage() {
  const UPDATED = "1 March 2026";

  return (
    <div style={{ background: "#060608", minHeight: "100vh", fontFamily: "'DM Sans', sans-serif", color: "white" }}>
      <style>{STYLES}</style>

      {/* Ambient orb */}
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, overflow: "hidden" }}>
        <div style={{
          position: "absolute", top: "-15%", left: "-10%", width: 600, height: 600,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(59,130,246,0.07) 0%, transparent 70%)",
        }} />
      </div>

      {/* Nav */}
      <header style={{
        position: "sticky", top: 0, zIndex: 40,
        background: "rgba(6,6,8,0.85)", backdropFilter: "blur(20px)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        padding: "14px 40px", display: "flex", alignItems: "center", gap: 16,
      }}>
        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 8, textDecoration: "none",
        }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8,
            background: "linear-gradient(135deg,#3b82f6,#1d4ed8)",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <TrendingUp size={13} color="#fff" />
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>InvestTable</span>
        </Link>

        <div style={{ flex: 1 }} />

        <Link href="/" style={{
          display: "flex", alignItems: "center", gap: 6, fontSize: 12,
          color: "rgba(255,255,255,0.3)", textDecoration: "none",
          transition: "color 0.15s",
        }}
          onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.6)")}
          onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.3)")}
        >
          <ArrowLeft size={13} /> Back
        </Link>
      </header>

      {/* Content */}
      <main style={{ position: "relative", zIndex: 1, maxWidth: 740, margin: "0 auto", padding: "60px 24px 100px" }}>

        {/* Hero */}
        <div className="fade" style={{ marginBottom: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
            <Scale size={18} color="rgba(59,130,246,0.6)" />
            <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(59,130,246,0.6)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Legal
            </span>
          </div>
          <h1 style={{
            fontFamily: "'DM Serif Display', serif",
            fontSize: "clamp(2rem, 5vw, 3rem)",
            color: "rgba(255,255,255,0.92)",
            letterSpacing: "-0.02em",
            marginBottom: 12,
          }}>
            Terms of Service
          </h1>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.3)", fontWeight: 300 }}>
            Last updated: {UPDATED}
          </p>

          {/* Summary pills */}
          <div style={{ display: "flex", gap: 10, marginTop: 28, flexWrap: "wrap" }}>
            {[
              { icon: Shield, label: "GDPR compliant",         color: "#10b981" },
              { icon: AlertTriangle, label: "Not investment advice", color: "#f59e0b" },
              { icon: Scale, label: "EU law governed",         color: "#3b82f6" },
            ].map(({ icon: Icon, label, color }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: 6,
                padding: "6px 12px", borderRadius: 999, fontSize: 12,
                background: `${color}10`, border: `1px solid ${color}25`,
                color: `${color}`,
              }}>
                <Icon size={12} />
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: 36 }}>

          <Section n={1} title="Acceptance of Terms">
            <P>
              By accessing or using <Strong>InvestTable</Strong> ("the Platform," "we," "us," or "our"), you confirm
              that you have read, understood, and agree to be bound by these Terms of Service ("Terms"). If you do not
              agree to all of these Terms, you must immediately discontinue your use of the Platform.
            </P>
            <P>
              We reserve the right to amend these Terms at any time. When we make material changes, we will update the
              "Last updated" date at the top of this page and, where applicable, notify active account holders by email.
              Your continued use of the Platform after any modification constitutes acceptance of the revised Terms.
            </P>
          </Section>

          <Section n={2} title="What InvestTable Is — and Is Not">
            <P>
              InvestTable is a curated digital marketplace designed to connect European startups with institutional and
              private investors. The Platform provides tools for startup discovery, filtering, and direct engagement.
            </P>
            <div style={{
              background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)",
              borderRadius: 14, padding: "16px 18px", marginBottom: 14,
            }}>
              <p style={{ fontSize: 13, color: "rgba(245,158,11,0.9)", fontWeight: 500, marginBottom: 4 }}>
                Important disclaimer
              </p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", fontWeight: 300, lineHeight: 1.7 }}>
                <Strong>InvestTable is not a regulated investment service, financial advisor, broker-dealer,
                crowdfunding platform, or authorised payment institution.</Strong> Nothing published on the Platform —
                including startup metrics, funding stages, valuations, pitch decks, or company descriptions — constitutes
                investment advice, a securities offering, or a recommendation to buy or sell any financial instrument.
                All investment decisions are made solely at your own risk and discretion.
              </p>
            </div>
            <P>
              We strongly encourage all users — particularly investors — to conduct thorough independent due diligence
              and seek advice from appropriately licensed legal, financial, and tax professionals before making any
              investment.
            </P>
          </Section>

          <Section n={3} title="Eligibility & Account Registration">
            <P>
              To access certain features of the Platform, you must register an account. By registering, you represent
              and warrant that:
            </P>
            <Ul>
              <Li>You are at least <Strong>18 years old</Strong> (or at least 16 with verifiable parental consent for
                non-investment features);</Li>
              <Li>All information you provide during registration is accurate, complete, and up to date;</Li>
              <Li>You will maintain the confidentiality of your login credentials and are solely responsible for all
                activity occurring under your account;</Li>
              <Li>You will notify us promptly at <Strong>support@investtable.eu</Strong> upon becoming aware of any
                unauthorised use of your account;</Li>
              <Li>You are not prohibited from using the Platform under the laws of any applicable jurisdiction.</Li>
            </Ul>
            <P>
              We reserve the right to suspend or permanently terminate accounts that violate these Terms, engage in
              fraudulent activity, or otherwise harm the Platform or its users.
            </P>
          </Section>

          <Section n={4} title="User Roles & Obligations">
            <SubHeading>4.1 Investor Accounts</SubHeading>
            <P>
              Investor accounts are granted access to startup listings, contact details, pitch decks, and analytical
              tools. As an investor, you agree to:
            </P>
            <Ul>
              <Li>Use startup data exclusively for lawful due-diligence and investment evaluation within your
                organisation;</Li>
              <Li>Not reproduce, resell, or distribute startup information — including pitch decks — outside your
                organisation without the startup's explicit written consent;</Li>
              <Li>Treat non-public information shared by startups with strict confidentiality;</Li>
              <Li>Comply with all applicable securities regulations, anti-money-laundering laws, and investor
                qualification requirements in your jurisdiction.</Li>
            </Ul>

            <SubHeading>4.2 Startup Accounts</SubHeading>
            <P>
              Startup accounts allow founders to list and manage their company profile on the Platform. As a startup,
              you agree to:
            </P>
            <Ul>
              <Li>Provide only accurate, truthful, and up-to-date information about your company;</Li>
              <Li>Not misrepresent financial metrics, team composition, product stage, traction, or any other material
                fact;</Li>
              <Li>Confirm and maintain GDPR compliance before your profile is published;</Li>
              <Li>Update your profile promptly whenever material information changes;</Li>
              <Li>Acknowledge that your listing information will be made available to verified investors registered on
                the Platform.</Li>
            </Ul>
            <P>
              Providing materially false information constitutes a breach of these Terms and may result in immediate
              account termination and potential legal liability.
            </P>
          </Section>

          <Section n={5} title="Subscriptions & Payments">
            <P>
              Certain Platform features are available only through a paid subscription (currently Investor Pro plans
              starting at €39 per seat per month). By subscribing, you authorise InvestTable to charge your designated
              payment method on a recurring basis at the applicable rate.
            </P>
            <Ul>
              <Li>Subscriptions renew automatically unless cancelled before the next billing date;</Li>
              <Li>Refunds are not provided for unused portions of a billing period;</Li>
              <Li>We reserve the right to adjust pricing with <Strong>30 days' written notice</Strong> to active
                subscribers; continued use after the notice period constitutes acceptance of new pricing;</Li>
              <Li>All payments are processed securely by <Strong>Stripe, Inc.</Strong> Your payment data is governed
                by Stripe's Privacy Policy and Terms of Service;</Li>
              <Li>All prices are exclusive of applicable taxes, which may be added depending on your billing
                country.</Li>
            </Ul>
          </Section>

          <Section n={6} title="Data, Privacy & GDPR">
            <P>
              We process personal data in accordance with the EU General Data Protection Regulation (GDPR 2016/679)
              and our Privacy Policy, which forms part of these Terms by reference.
            </P>
            <P>
              <Strong>Startups:</Strong> By enabling the GDPR Compliance Declaration on your profile, you confirm
              that your company processes personal data lawfully under GDPR and consent to InvestTable sharing your
              listing information with verified investors registered on the Platform. You may request removal of your
              profile at any time by contacting us.
            </P>
            <P>
              <Strong>Investors:</Strong> We process your account details, usage activity, and communication history
              to provide and improve the Service. We do not sell your personal data to third parties.
            </P>
            <P>
              For data subject requests (access, rectification, erasure, portability) or to lodge a complaint,
              contact <Strong>privacy@investtable.eu</Strong>. You also have the right to lodge a complaint with
              your national data protection supervisory authority.
            </P>
          </Section>

          <Section n={7} title="Intellectual Property">
            <P>
              The Platform's design, codebase, trademarks, trade dress, and original editorial content are owned by
              InvestTable and protected under applicable EU and international intellectual property law.
            </P>
            <P>
              Company names, logos, trademarks, and descriptions submitted by startups remain the intellectual property
              of their respective owners. InvestTable claims no ownership over third-party content.
            </P>
            <P>
              You may not reproduce, scrape, frame, resell, or create derivative works from any Platform content
              without prior written permission from InvestTable.
            </P>
          </Section>

          <Section n={8} title="User-Submitted Content">
            <P>
              By submitting content to InvestTable — including company listings, pitch decks, financial summaries, and
              descriptions — you grant us a <Strong>non-exclusive, worldwide, royalty-free licence</Strong> to host,
              display, and distribute that content for the purposes of operating and improving the Platform.
            </P>
            <P>
              You represent that you hold all necessary rights to submit such content and that it does not infringe
              upon any third-party rights, including intellectual property, privacy, or contractual rights. We reserve
              the right to remove or modify any user-submitted content that violates these Terms or applicable law,
              without prior notice.
            </P>
          </Section>

          <Section n={9} title="Prohibited Uses">
            <P>You agree not to:</P>
            <Ul>
              <Li>Use the Platform for any purpose that violates applicable law or regulation;</Li>
              <Li>Submit false, misleading, fabricated, or fraudulent information;</Li>
              <Li>Attempt to gain unauthorised access to any part of the Platform or its underlying infrastructure;</Li>
              <Li>Use automated means (bots, scrapers, crawlers, spiders) to access or extract Platform data without
                prior written permission;</Li>
              <Li>Reverse-engineer, decompile, or attempt to extract source code from the Platform;</Li>
              <Li>Impersonate any person, organisation, or entity on the Platform;</Li>
              <Li>Use the Platform to transmit unsolicited commercial communications (spam);</Li>
              <Li>Post or transmit any content that is unlawful, defamatory, abusive, hateful, or obscene;</Li>
              <Li>Take any action that could damage, disable, overburden, or impair the Platform's infrastructure or
                disrupt other users' access.</Li>
            </Ul>
          </Section>

          <Section n={10} title="Disclaimers of Warranty">
            <CapsBlock>
              THE PLATFORM IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED.
              TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, INVESTTABLE EXPRESSLY DISCLAIMS ALL WARRANTIES,
              INCLUDING IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
              WE DO NOT WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, SECURE, OR VIRUS-FREE, THAT
              STARTUP OR INVESTOR DATA IS ACCURATE, COMPLETE, OR CURRENT, OR THAT ANY EXPECTED OUTCOME WILL RESULT
              FROM USE OF THE PLATFORM.
            </CapsBlock>
            <P>
              Startup information is self-reported and has not been independently verified by InvestTable unless
              explicitly stated. We accept no responsibility for the accuracy, reliability, or completeness of any
              listing, financial metric, or pitch deck published on the Platform.
            </P>
          </Section>

          <Section n={11} title="Limitation of Liability">
            <CapsBlock>
              TO THE MAXIMUM EXTENT PERMITTED BY EU AND APPLICABLE NATIONAL LAW, INVESTTABLE SHALL NOT BE LIABLE FOR
              ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES ARISING FROM OR RELATED
              TO YOUR USE OF THE PLATFORM, INCLUDING BUT NOT LIMITED TO INVESTMENT LOSSES, FINANCIAL DAMAGES, LOST
              PROFITS, LOSS OF DATA, OR BUSINESS INTERRUPTION — EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
              LOSSES RESULTING FROM THIRD-PARTY SERVICES (INCLUDING BUT NOT LIMITED TO STRIPE, SUPABASE, OR VERCEL)
              ARE EXPRESSLY EXCLUDED FROM OUR LIABILITY.
            </CapsBlock>
            <P>
              Our total aggregate liability for any direct damages shall not exceed the greater of
              <Strong> (a) €100</Strong> or <Strong>(b) the total fees you paid to InvestTable in the twelve (12)
              months immediately preceding the event giving rise to the claim.</Strong>
            </P>
            <P>
              Nothing in these Terms excludes or limits our liability for death, personal injury, or fraud caused by
              our gross negligence or wilful misconduct, as required by EU mandatory consumer protection law.
            </P>
          </Section>

          <Section n={12} title="Governing Law & Dispute Resolution">
            <P>
              These Terms are governed by and construed in accordance with the laws of the European Union and the member
              state in which InvestTable is established, without regard to conflict-of-law provisions.
            </P>
            <P>
              Any dispute, controversy, or claim arising out of or in connection with these Terms shall be subject to
              the exclusive jurisdiction of the competent courts in that member state, unless mandatory applicable law
              provides otherwise.
            </P>
            <P>
              If you are a consumer resident in an EU member state, you retain the right to bring proceedings in the
              courts of your country of residence and to benefit from the mandatory consumer-protection provisions of
              your local law. You may also use the EU Online Dispute Resolution platform at{" "}
              <a href="https://ec.europa.eu/consumers/odr" target="_blank" rel="noopener noreferrer"
                style={{ color: "rgba(59,130,246,0.7)", textDecoration: "none" }}>
                ec.europa.eu/consumers/odr
              </a>.
            </P>
          </Section>

          <Section n={13} title="Modifications to These Terms">
            <P>
              We may update these Terms from time to time to reflect changes in our services, legal requirements, or
              business practices. We will communicate material changes by updating the "Last updated" date above and,
              where reasonable, by sending a notification to registered account holders.
            </P>
            <P>
              Your continued use of the Platform following the publication of revised Terms constitutes acceptance.
              We recommend that you review these Terms periodically. If you do not agree to the updated Terms, you
              must stop using the Platform.
            </P>
          </Section>

          <Section n={14} title="Contact">
            <P>
              Questions, legal notices, or data subject requests may be directed to:
            </P>
            <div style={{
              background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: 14, padding: "16px 20px",
            }}>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.6)", fontWeight: 500, marginBottom: 6 }}>InvestTable</p>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", fontWeight: 300, lineHeight: 1.8 }}>
                General: <a href="mailto:hello@investtable.eu" style={{ color: "rgba(59,130,246,0.7)", textDecoration: "none" }}>hello@investtable.eu</a><br />
                Legal: <a href="mailto:legal@investtable.eu" style={{ color: "rgba(59,130,246,0.7)", textDecoration: "none" }}>legal@investtable.eu</a><br />
                Privacy & GDPR: <a href="mailto:privacy@investtable.eu" style={{ color: "rgba(59,130,246,0.7)", textDecoration: "none" }}>privacy@investtable.eu</a>
              </p>
            </div>
          </Section>

        </div>

        {/* Footer links */}
        <div style={{
          marginTop: 60, paddingTop: 32, borderTop: "1px solid rgba(255,255,255,0.05)",
          display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
        }}>
          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.2)" }}>
            © {new Date().getFullYear()} InvestTable · EU GDPR compliant
          </p>
          <div style={{ display: "flex", gap: 20 }}>
            {[
              { label: "Home",         href: "/" },
              { label: "Cookie Policy", href: "/cookie-policy" },
              { label: "Login",        href: "/login" },
            ].map(({ label, href }) => (
              <Link key={href} href={href} style={{
                fontSize: 12, color: "rgba(255,255,255,0.25)", textDecoration: "none",
                transition: "color 0.15s",
              }}
                onMouseEnter={e => (e.currentTarget.style.color = "rgba(255,255,255,0.55)")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,0.25)")}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {/* NPS survey — embedded at bottom of ToS */}
        <div style={{ marginTop: 48 }}>
          <NPSSurvey variant="inline" />
        </div>

      </main>
    </div>
  );
}
