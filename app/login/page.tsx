import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import signupIllustrator from "@/assets/auth/login-illustrator.svg";
import logo from "@/assets/logos/logo.png";
import LoginForm from "@/features/auth/login-form";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex gradient-bg-subtle">
      <div className="hidden lg:flex lg:w-1/2 relative">
        <div className="mx-auto w-full h-full flex items-center justify-end">
          <Image
            src={signupIllustrator}
            alt="Interview illustration"
            width={1000}
            height={1000}
            className="object-cover w-[80%] h-[80%] animate-fade-in"
            priority
          />
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-8 relative z-20 animate-fade-in">
        <div className="w-full max-w-md space-y-8">
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
                Sign In
              </CardTitle>
              <CardDescription className="text-muted-foreground font-body">
                Enter your credentials to access your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <LoginForm />
              <div className="mt-6 text-center animate-slide-in delay-500">
                <p className="text-sm text-muted-foreground font-body">
                  Don't have an account?{" "}
                  <Link
                    href="/signup"
                    className="text-primary hover:text-primary-light font-medium transition-colors"
                  >
                    Sign up here
                  </Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
