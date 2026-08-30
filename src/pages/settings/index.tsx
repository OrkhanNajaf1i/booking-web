import { UpdateBusinessForm } from "@/features/onboarding/update-business/ui/UpdateBusinessForm";


export default function Settings() {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-lg w-full p-8">          
            <UpdateBusinessForm />
          </div>
        </div>
      );
}