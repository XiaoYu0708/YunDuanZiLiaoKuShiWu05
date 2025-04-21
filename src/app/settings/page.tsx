;"use client";

import ChangeDisplayNameForm from "@/components/change-display-name-form";
import ChangePasswordForm from "@/components/change-password-form";
import DeleteAccount from "@/components/delete-account";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/firebase";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SettingsPage = () => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth?.currentUser) {
      router.push("/");
    }
  }, [auth, router]);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold mb-4">Account Settings</h1>

      <ChangeDisplayNameForm />
      <ChangePasswordForm />
      <DeleteAccount />

      <Button onClick={() => router.push("/snake")}>
        Back to Game
      </Button>
    </div>
  );
};

export default SettingsPage;
