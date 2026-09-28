import { CheckCircle, Star } from "lucide-react";
// import Link from "next/link";
// import { Badge } from "../../components/ui/badge";
// import { Button } from "../../components/ui/button";

function Hero() {
  return (
    <section className="py-20 px-4 min-h-[calc(100vh-72px)] flex justify-center items-center">
      <div className="container mx-auto text-center max-w-4xl animate-fade-in">
        {/* <Badge
          variant="secondary"
          className="mb-6 bg-primary/10 text-primary border-primary/20 font-medium"
        >
          <Star className="w-3 h-3 mr-1 fill-primary" />
          Trusted by 500+ Companies
        </Badge> */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Streamline Your{" "}
          <span className="text-primary leading-tight block">Video Interviews</span>
        </h1>
        <p className="md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
          Transform your hiring process with our comprehensive video interview
          platform. Create sessions, evaluate candidates, and make informed
          decisions—all in one place.
        </p>
        {/* <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/interviewer/dashboard">
              <Flame />
              Start Free Trial
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/candidate/dashboard">
              Watch Demo <TvMinimalPlay />
            </Link>
          </Button>
        </div> */}
        <div className="mt-2 md:mt-12 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-8 text-sm text-muted-foreground">
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-green-500" />
            <span>Setup in 5 minutes</span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
