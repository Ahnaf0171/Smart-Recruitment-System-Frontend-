import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqItems = [
  {
    value: "item-1",
    question: "How does Shohoj Niyog simplify the recruitment process?",
    answer:
      "Shohoj Niyog streamlines hiring by allowing recruiters to create customized video interview sessions, invite candidates via unique links, and review responses at their convenience. Our platform automatically organizes all candidate videos for efficient evaluation and comparison.",
  },
  {
    value: "item-2",
    question: "What types of interviews can I conduct with Shohoj Niyog?",
    answer:
      "Our platform supports various interview formats including one-way video interviews, skill-based assessments, and customizable questionnaire sessions. You can create technical evaluations, behavioral interviews, or role-specific assessments tailored to your hiring needs.",
  },
  {
    value: "item-3",
    question: "How does the candidate evaluation system work?",
    answer:
      "Shohoj Niyog provides structured evaluation tools including rating scales, scorecards, and collaborative feedback systems. Hiring teams can comment, rate responses, and share insights directly on candidate videos, ensuring comprehensive and unbiased assessments.",
  },
  {
    value: "item-4",
    question: "Can I integrate Shohoj Niyog with our existing HR systems?",
    answer:
      "Yes, Shohoj Niyog offers API access and integrations with popular Applicant Tracking Systems (ATS) and HR platforms. This allows seamless data transfer, candidate synchronization, and streamlined workflow management between systems.",
  },
  {
    value: "item-5",
    question:
      "What measures does Shohoj Niyog take to ensure candidate privacy?",
    answer:
      "We prioritize data security with end-to-end encryption, secure cloud storage, and strict access controls. Candidates have rights to their data and can request deletion at any time. We comply with global data protection regulations including GDPR and local data privacy laws.",
  },
  {
    value: "item-6",
    question:
      "How does Shohoj Niyog support remote hiring and distributed teams?",
    answer:
      "Our platform is designed for remote hiring workflows, featuring asynchronous interviews, collaborative evaluation tools, and seamless communication channels. Hiring teams can participate from anywhere, providing feedback and making decisions without geographical constraints.",
  },
];

function FAQ() {
  return (
    <section id="faq" className="py-8 md:py-20 px-4 animate-fade-in">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-6 md:mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-4">
            Frequently Asked Questions
          </h2>
          <p className="md:text-xl text-muted-foreground font-body">
            Everything you need to know about Shohoj Niyog
          </p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {faqItems.map((item, index) => (
            <AccordionItem
              key={item.value}
              value={item.value}
              className="border-sidebar-border rounded-lg overflow-hidden glass-effect shadow-soft animate-slide-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <AccordionTrigger className="px-4 py-3 md:px-6 md:py-4 transition-all duration-300 rounded-t-lg data-[state=open]:rounded-b-none group">
                <span className="font-heading md:text-lg text-foreground text-left flex-1 group-hover:text-primary transition-all cursor-pointer">
                  {item.question}
                </span>
              </AccordionTrigger>
              <AccordionContent className="px-6 pb-4 font-body text-muted-foreground leading-relaxed">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}

export default FAQ;
