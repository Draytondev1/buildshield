import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-beige flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Welcome Back</h1>
          <p className="text-gray-warm">Sign in to access your assessments</p>
        </div>
        <SignIn 
          appearance={{
            elements: {
              formButtonPrimary: "bg-orange hover:bg-orange-hover",
              footerActionLink: "text-orange hover:text-orange-hover",
            },
          }}
        />
      </div>
    </div>
  );
}
