import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

function Testimonial() {
  return (
    <section id="testimonials" className="py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-heading font-bold text-foreground mb-4">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground">
            Hear from companies that transformed their hiring with InterviewFlow
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="bg-background border-border/50">
            <CardContent className="pt-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "InterviewFlow has reduced our time-to-hire by 40%. The platform
                is intuitive and the customer support is exceptional."
              </p>
              <div className="font-medium text-foreground">Sarah Johnson</div>
              <div className="text-sm text-muted-foreground">
                HR Director, TechCorp
              </div>
            </CardContent>
          </Card>
          <Card className="bg-background border-border/50">
            <CardContent className="pt-6">
              <div className="flex mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-muted-foreground mb-4">
                "The customizable questions and easy candidate management have
                made our recruitment process so much more efficient."
              </p>
              <div className="font-medium text-foreground">Michael Chen</div>
              <div className="text-sm text-muted-foreground">
                Talent Acquisition, StartupXYZ
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}

export default Testimonial;
