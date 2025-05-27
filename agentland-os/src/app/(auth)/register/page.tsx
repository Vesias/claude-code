import { RegisterForm } from "@/components/auth/register-form"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Registrieren | AgentLand OS",
  description: "Erstellen Sie ein neues AgentLand OS Konto",
}

export default function RegisterPage() {
  return (
    <div className="container flex h-screen w-screen flex-col items-center justify-center">
      <RegisterForm />
    </div>
  )
}