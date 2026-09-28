// import { Button } from "@/components/ui/button";
// import { Flame, UserRoundPlus } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { User2Icon } from "lucide-react";

function CTA() {
  return (
    <section className="py-8 md:py-20 px-4 animate-fade-in mb-2">
      <div className="container mx-auto max-w-3xl text-center rounded-lg">
        <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
          Ready to Get Started?
        </h2>
        <p className="md:text-xl text-muted-foreground font-body mb-4 md:mb-6">
          Join hundreds of companies already using InterviewFlow to streamline
          their hiring process.
        </p>
        <Link href="/login">
          <Button>
            <User2Icon /> <span>Get Started</span>
          </Button>
        </Link>
      </div>
    </section>
  );
}

export default CTA;
