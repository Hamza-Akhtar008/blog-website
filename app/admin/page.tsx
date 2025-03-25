"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminfetch } from "@/services/api";

export default function TriggerPage() {
  const router = useRouter();

  useEffect(() => {
    const callApiAndRedirect = async () => {
      try {
        // Call the API route
        await adminfetch();
      } catch (error) {
        console.error("Error triggering function:", error);
      }

      // Redirect back to "/"
      router.push("/");
    };

    callApiAndRedirect();
  }, [router]);

  return <p>Redirecting...</p>; // Temporary message
}
