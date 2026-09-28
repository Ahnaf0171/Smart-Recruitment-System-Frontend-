import { Button } from "../ui/button";
import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/logos/logo.png";

const productItems = [
  { label: "Features", href: "#features", id: 1 },
  { label: "Pricing", href: "#pricing", id: 2 },
  { label: "Security", href: "#security", id: 3 },
];

const companyItems = [
  { label: "About", href: "#about", id: 1 },
  { label: "Careers", href: "#careers", id: 2 },
  { label: "Contact", href: "#contact", id: 3 },
];

const supportItems = [
  { label: "FAQ", href: "#faq", id: 1 },
  { label: "Help Center", href: "#help-center", id: 2 },
  { label: "Documentation", href: "#documentation", id: 3 },
];

function Footer() {
  return (
    <footer className="bg-card py-12 px-4 border-t border-sidebar-border animate-fade-in pb-6">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
          <div className="animate-slide-in col-span-2 md:col-span-1 mb-3 mr-8">
            <Link href="/" className="inline-flex items-center">
              <Image
                src={logo}
                alt="logo"
                width={1000}
                height={1000}
                className="object-cover w-auto m-auto h-9 md:h-12 animate-fade-in"
                priority
              />
            </Link>
            <p className="text-base text-muted-foreground font-body">
              Streamline your hiring process with professional video interviews.
            </p>
          </div>
          <div className="animate-slide-in">
            <h3 className="font-heading font-semibold mb-2 md:mb-3 text-foreground">
              Product
            </h3>
            <div className="flex flex-col">
              {productItems.map((item) => (
                <Button
                  asChild
                  className="p-0 h-7 justify-start"
                  variant="link"
                  key={item.id}
                >
                  <Link href={item.href}>{item.label}</Link>
                </Button>
              ))}
            </div>
          </div>
          <div className="animate-slide-in">
            <h3 className="font-heading font-semibold mb-2 md:mb-3 text-foreground">
              Company
            </h3>
            <div className="flex flex-col">
              {companyItems.map((item) => (
                <Button
                  asChild
                  className="p-0 justify-start h-7"
                  variant="link"
                  key={item.id}
                >
                  <a href={item.href}>{item.label}</a>
                </Button>
              ))}
            </div>
          </div>
          <div className="animate-slide-in">
            <h3 className="font-heading font-semibold mb-2 md:mb-3 text-foreground">
              Support
            </h3>
            <div className="flex flex-col">
              {supportItems.map((item) => (
                <Button
                  asChild
                  className="p-0 justify-start h-7"
                  variant="link"
                  key={item.id}
                >
                  <a href={item.href}>{item.label}</a>
                </Button>
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-sidebar-border mt-8 pt-6 text-center text-muted-foreground font-body animate-fade-in">
          <p>&copy;2025 Shohoj Niyog. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
