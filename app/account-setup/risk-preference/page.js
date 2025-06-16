"use client"

import { useAccountSetup } from "../context/AccountSetupContext";
import { useRouter } from "next/navigation";

function page() {
    const { formData, setFormData } = useAccountSetup();
    const router = useRouter();

    const handleNext = () => {
        router.push("/account-setup/background");
    }
  return (
    <div className="w-full m-4">
        <div className="w-full text-white mt-16">
            hello - testing valid Tailwind class
        </div>
    </div>
  )
}

export default page