
"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useAuth } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { auth } = useAuth();
  const router = useRouter();

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
      toast({
        title: "Authentication not initialized.",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast({
        title: "Login successful!",
        description: "Redirecting to the game...",
      });
      router.push("/snake");
    } catch (error: any) {
      toast({
        title: "Login failed.",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const handleGoogleSignIn = async () => {
    if (!auth) {
      toast({
        title: "Authentication not initialized.",
        description: "Please try again later.",
        variant: "destructive",
      });
      return;
    }
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      toast({
        title: "Login successful!",
        description: "Redirecting to the game...",
      });
      router.push("/snake");
    } catch (error: any) {
      toast({
        title: "Login failed.",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-80">
      <form onSubmit={handleEmailSignIn} className="flex flex-col gap-2">
        <Input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit">Sign in with Email</Button>
      </form>
      <Button onClick={handleGoogleSignIn} variant="secondary">
        Sign in with Google
      </Button>
    </div>
  );
};

export default LoginForm;
