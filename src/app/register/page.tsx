;"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/firebase";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const { auth } = useAuth();
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
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
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, { displayName: displayName });
        toast({
          title: "Registration successful!",
          description: "Redirecting to the game...",
        });
        router.push("/snake");
      }
    } catch (error: any) {
      toast({
        title: "Registration failed.",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 w-80">
      <form onSubmit={handleRegister} className="flex flex-col gap-2">
        <Input
          type="text"
          placeholder="Display Name"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
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
        <Button type="submit">Register</Button>
      </form>
    </div>
  );
};

export default function Register() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-3xl font-bold mb-6">Register</h1>
      <RegisterForm />
    </div>
  );
}
