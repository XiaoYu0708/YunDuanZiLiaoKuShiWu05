;"use client";

import { useState } from "react";
import { updateProfile } from "firebase/auth";
import { useAuth } from "@/lib/firebase";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const ChangeDisplayNameForm = () => {
  const [displayName, setDisplayName] = useState("");
  const { auth } = useAuth();

  const handleChangeDisplayName = async () => {
    if (auth && auth.currentUser) {
      try {
        await updateProfile(auth.currentUser, { displayName: displayName });
        toast({
          title: "Display name updated!",
          description: "Your display name has been successfully updated.",
        });
      } catch (error: any) {
        toast({
          title: "Failed to update display name.",
          description: error.message,
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="flex flex-col gap-2 w-80 mb-4">
      <Input
        type="text"
        placeholder="New Display Name"
        value={displayName}
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <Button onClick={handleChangeDisplayName}>Change Display Name</Button>
    </div>
  );
};

export default ChangeDisplayNameForm;
