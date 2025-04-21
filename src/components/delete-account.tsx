"use client";

import { deleteUser } from "firebase/auth";
import { useAuth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { doc, getFirestore, deleteDoc } from "firebase/firestore";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

const DeleteAccount = () => {
  const { auth } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);


  const handleDeleteAccount = async () => {
    if (auth && auth.currentUser) {
      try {
        // Delete user data from Firestore
        const db = getFirestore();
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        await deleteDoc(userDocRef);

        // Delete the user account
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Delete Account</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your account
            and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDeleteAccount}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteAccount;
