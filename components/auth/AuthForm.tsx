"use client";

import { useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Mail, Lock, User, Building2, TrendingUp, ArrowRight, Check, Shield, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

type AuthMode = "login" | "signup" | "forgot";
type UserRole = "investor" | "startup";

const inputCls = "w-full px-4 py-3 text-sm rounded-2xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder:text-gray-300";

function PasswordInput({ value, onChange, placeholder = "Password" }: {
  value: string; onChange: (v: string) => void; placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="relative">
      <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={cn(inputCls, "pl-11 pr-11")}
      />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 hover:text-gray-500">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function RoleSelector({ role, onChange }: { role: UserRole; onChange: (r: UserRole) => void }) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {([
        { id: "investor" as UserRole, label: "Investor",  icon: Building2,  desc: "Scout startups"  },
        { id: "startup"  as UserRole, label: "Startup",   icon: TrendingUp, desc: "Get discovered"  },
      ]).map((opt) => {
        const Icon = opt.icon;
        const sel = role === opt.id;
        return (
          <button key={opt.id} type="button" onClick={() => onChange(opt.id)}
            className={cn(
              "flex flex-col items-center gap-1.5 p-4 rounded-2xl border-2 transition-all",
              sel ? "border-blue-500 bg-blue-50" : "border-gray-200 bg-white hover:border-gray-300"
            )}>
            <Icon className={cn("w-5 h-5", sel ? "text-blue-600" : "text-gray-400")} />
            <span className={cn("text-xs font-semibold", sel ? "text-blue-700" : "text-gray-700")}>{opt.label}</span>
            <span className="text-[10px] text-gray-400">{opt.desc}</span>
          </button>
        );
      })}
    </div>
  );
}

function MFAStep({ onVerify }: { onVerify: () => void }) {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (code.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setLoading(true);
    const supabase = createClient();
    const { error } = await supabase.auth.mfa.challengeAndVerify({
      factorId: "", // Will be set from session in production
      code,
    });
    setLoading(false);
    if (error) { toast.error("Invalid code — try again"); setCode(""); return; }
    toast.success("Verified!");
    onVerify();
  }

  return (
    <div className="space-y-5 text-center">
      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
        <Shield className="w-7 h-7 text-blue-600" />
      </div>
      <div>
        <h3 className="font-bold text-gray-900 text-lg">Two-factor verification</h3>
        <p className="text-sm text-gray-500 mt-1">Enter the 6-digit code from your authenticator app</p>
      </div>
      <input
        type="text" inputMode="numeric" maxLength={6}
        value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        placeholder="000000"
        className="w-full text-center text-2xl font-mono tracking-widest px-4 py-3 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button onClick={handleVerify} disabled={loading || code.length !== 6}
        className="w-full bg-blue-600 text-white font-semibold py-3 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50">
        {loading ? "Verifying…" : "Verify"}
      </button>
      <p className="text-xs text-gray-400">
        Lost access?{" "}
        <a href="mailto:support@investtable.eu" className="text-blue-600 hover:underline">Contact support</a>
      </p>
    </div>
  );
}

export function AuthForm({ initialMode = "login" }: { initialMode?: AuthMode }) {
  const [mode, setMode]           = useState<AuthMode>(initialMode);
  const [role, setRole]           = useState<UserRole>("investor");
  const [email, setEmail]         = useState("");
  const [password, setPassword]   = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [name, setName]           = useState("");
  const [loading, setLoading]     = useState(false);
  const [mfaStep, setMfaStep]     = useState(false);
  const [done, setDone]           = useState(false);

  const supabase = createClient();

  async function handleLogin() {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { toast.error(error.message); return false; }

    // Check if MFA is required
    if (data.session?.user?.factors?.length) {
      setMfaStep(true);
      return false;
    }
    return true;
  }

  async function handleSignup() {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name, role },
        emailRedirectTo: `${window.location.origin}/login`,
      },
    });
    if (error) { toast.error(error.message); return false; }
    return true;
  }

  async function handleForgot() {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) { toast.error(error.message); return false; }
    return true;
  }

  async function handleMagicLink() {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: `${window.location.origin}/dashboard` },
    });
    if (error) { toast.error(error.message); return; }
    toast.success("Magic link sent! Check your inbox.");
    setDone(true);
  }

  async function handleSubmit() {
    if (!email.includes("@")) { toast.error("Enter a valid email"); return; }
    if (mode !== "forgot" && password.length < 8) { toast.error("Password must be at least 8 characters"); return; }
    if (mode === "signup" && password !== confirmPw) { toast.error("Passwords don't match"); return; }

    setLoading(true);
    let success = false;

    try {
      if (mode === "login")        success = await handleLogin();
      else if (mode === "signup")  success = await handleSignup();
      else                         success = await handleForgot();
    } catch (e: any) {
      toast.error(e.message ?? "Something went wrong");
    }

    setLoading(false);

    if (success) {
      if (mode === "login") {
        window.location.href = role === "investor" ? "/dashboard" : "/onboarding";
      } else {
        toast.success(mode === "signup"
          ? "Account created! Check your email to confirm."
          : "Reset link sent!");
        setDone(true);
      }
    }
  }

  if (mfaStep) return <MFAStep onVerify={() => { window.location.href = "/dashboard"; }} />;

  if (done) return (
    <div className="text-center space-y-4">
      <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
        <Check className="w-7 h-7 text-emerald-600" />
      </div>
      <h3 className="font-bold text-gray-900 text-lg">
        {mode === "signup" ? "Check your inbox!" : "Reset email sent!"}
      </h3>
      <p className="text-sm text-gray-500">
        {mode === "signup"
          ? `We sent a confirmation link to ${email}. Click it to activate your account.`
          : `We sent a password reset link to ${email}.`}
      </p>
      <button onClick={() => { setMode("login"); setDone(false); }}
        className="text-sm text-blue-600 hover:underline font-medium">
        Back to login →
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {mode !== "forgot" && <RoleSelector role={role} onChange={setRole} />}

      {mode === "signup" && (
        <div className="relative">
          <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            placeholder={role === "investor" ? "Full name / Organization" : "Company name"}
            className={cn(inputCls, "pl-11")} />
        </div>
      )}

      <div className="relative">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          placeholder="you@company.com" className={cn(inputCls, "pl-11")} />
      </div>

      {mode !== "forgot" && <PasswordInput value={password} onChange={setPassword} />}
      {mode === "signup" && (
        <PasswordInput value={confirmPw} onChange={setConfirmPw} placeholder="Confirm password" />
      )}

      {mode === "login" && (
        <div className="text-right -mt-1">
          <button onClick={() => setMode("forgot")} className="text-xs text-blue-600 hover:underline">
            Forgot password?
          </button>
        </div>
      )}

      {mode === "login" && role === "investor" && (
        <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-2xl border border-blue-100">
          <Shield className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
          <p className="text-[11px] text-blue-700">Investor accounts use 2-factor authentication.</p>
        </div>
      )}

      <button onClick={handleSubmit} disabled={loading}
        className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 rounded-2xl hover:bg-blue-700 transition-colors disabled:opacity-50">
        {loading ? "Please wait…" :
         mode === "login" ? "Sign in" :
         mode === "signup" ? "Create account" : "Send reset link"}
        {!loading && <ArrowRight className="w-4 h-4" />}
      </button>

      {/* Magic link option for startups */}
      {mode === "login" && role === "startup" && (
        <>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-100" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-100" />
          </div>
          <button onClick={handleMagicLink} disabled={loading || !email.includes("@")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-40">
            <Sparkles className="w-4 h-4 text-purple-400" />
            Send magic link instead
          </button>
        </>
      )}

      <p className="text-center text-sm text-gray-500">
        {mode === "login" ? (
          <>No account?{" "}
            <button onClick={() => setMode("signup")} className="text-blue-600 font-medium hover:underline">Sign up free</button>
          </>
        ) : mode === "signup" ? (
          <>Already registered?{" "}
            <button onClick={() => setMode("login")} className="text-blue-600 font-medium hover:underline">Sign in</button>
          </>
        ) : (
          <button onClick={() => setMode("login")} className="text-blue-600 font-medium hover:underline">← Back to login</button>
        )}
      </p>

      {mode === "signup" && (
        <p className="text-center text-[11px] text-gray-400 leading-relaxed">
          By signing up you agree to our{" "}
          <Link href="/cookie-policy" className="text-blue-500 hover:underline">Cookie Policy</Link>
          {" "}and Privacy Policy.
        </p>
      )}
    </div>
  );
}
