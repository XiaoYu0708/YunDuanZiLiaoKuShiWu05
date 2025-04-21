;"use client";

import { deleteUser, reauthenticateWithCredential, EmailAuthProvider } from "firebase/auth";
import { useAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

const DeleteAccount = () => {
  const { auth } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
    const router = useRouter();


  const handleDeleteAccount = async () => {
    if (auth && auth.currentUser) {
      try {
        const credential = EmailAuthProvider.credential(email, password);
        await reauthenticateWithCredential(auth.currentUser, credential);
        await deleteUser(auth.currentUser);
          router.push("/");
        toast({
          title: "Account deleted!",
          description: "Your account has been successfully deleted.",
        });
      } catch (error: any) {
        toast({
          title: "Failed to delete account.",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-80 mb-4">
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
      <Button onClick={handleDeleteAccount} variant="destructive">
        Delete Account
      </Button>
    </div>
  );
};

export default DeleteAccount;
