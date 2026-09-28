import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import loginIllustrator from "@/assets/auth/login-illustrator.svg";
import logo from "@/assets/logos/logo.png";
import SignupForm from "@/features/auth/signup-form";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex gradient-bg-subtle-reverse">
      <div className="w-full lg:w-1/2 flex items-center p-4 sm:p-8 relative z-20 overflow-y-auto animate-fade-in">
        <div className="w-full max-w-md space-y-8 mx-auto">
          <Card className="border-sidebar-border shadow-soft glass-effect overflow-hidden">
            <div className="text-center">
              <Link href="/" className="inline-flex items-center">
                <Image
                  src={logo}
                  alt="logo"
                  width={1000}
                  height={1000}
                  className="object-cover w-auto m-auto h-14 animate-fade-in"
                  priority
                />
              </Link>
              <div className="h-1 bg-primary w-full"></div>
            </div>
            <CardHeader className="text-center space-y-2">
              <CardTitle className="text-2xl font-heading text-foreground">
                Sign Up
              </CardTitle>
              <CardDescription className="text-muted-foreground font-body">
                Choose your role and create your account
              </CardDescription>
            </CardHeader>
            <CardContent className="max-h-[50vh] overflow-y-auto">
              <SignupForm />
              <div className="mt-6 text-center animate-slide-in delay-900">
                <p className="text-sm text-muted-foreground font-body">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary hover:text-primary-light font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="mx-auto w-full h-full flex items-center justify-start">
          <Image
            src={loginIllustrator}
            alt="Interview illustration"
            width={1000}
            height={1000}
            className="object-cover w-[80%] h-[80%] scale-x-[-1] animate-fade-in"
            priority
          />
        </div>
      </div>
    </div>
  );
}
