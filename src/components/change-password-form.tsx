"use client";

import { useState } from "react";
import { updatePassword } from "firebase/auth";
import { useAuth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ChangePasswordForm = () => {
  const [password, setPassword] = useState("");
  const { auth } = useAuth();

  const handleChangePassword = async () => {
    if (auth && auth.currentUser) {
      try {
        await updatePassword(auth.currentUser, password);
        toast({
          title: "Password updated!",
          description: "Your password has been successfully updated.",
        });
      } catch (error: any) {
        toast({
          title: "Failed to update password.",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-80 mb-4">
      <Input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button onClick={handleChangePassword}>Change Password</Button>
    </div>
  );
};

export default ChangePasswordForm;

