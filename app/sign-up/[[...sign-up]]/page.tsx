import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-beige flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-navy mb-2">Get Started</h1>
          <p className="text-gray-warm">Create your account and get 3 free assessment credits</p>
        </div>
        <SignUp 
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
