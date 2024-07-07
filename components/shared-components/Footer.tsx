import React from "react";
import { Origami } from "lucide-react";
import {
  IconBrandGithub,
  IconBrandLinkedin,
  IconBrandX,
} from "@tabler/icons-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const icons: { title: string; href: string; icon: React.ReactNode }[] = [
    {
      title: "LinkedIn",
      href: "https://www.linkedin.com/in/roopsagar-k-168b55217/",
      icon: <IconBrandLinkedin height="30" width="30" />,
    },
    {
      title: "GitHub",
      href: "https://github.com/roopsagar-k",
      icon: <IconBrandGithub height="30" width="30" />,
    },
    {
      title: "X",
      href: "https://x.com/RoopsagarU?t=mOukaVWB3fDTLZe3hIO7Fg&s=08",
      icon: <IconBrandX height="30" width="30" />,
    },
  ];
  return (
    <div className="absolute bottom-4 left-0 right-0 px-8 flex flex-col-reverse justify-center gap-4 md:flex-row md:justify-between">
      <div>
        <div className="flex flex-col gap-2 items-center justify-center text-center md:text-left">
          <div className="flex w-full h-full  gap-2 items-center justify-center md:justify-start">
            <Origami className="text-primary" size={32} />
            <p className="font font-bold text-primary text-xl">
              Questionpaper Hub
            </p>
          </div>
          <h3 className="font font-semibold w-full text-lg">
            Code · Showcase · Impress
          </h3>
          <div className="text-md w-full">
            &copy; {currentYear} Made with 🤯 by{" "}
            <Link
              href="https://github.com/roopsagar-k"
              target="_blank"
              className="font font-medium hover:text-primary transition hover:underline"
            >
              Roopsagar K
            </Link>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-2 items-center justify-center">
        <p className="text-primary text-xl font-bold">Important Links</p>
        <div className="flex flex-row space-x-4">
          {icons.map(({ title, href, icon }) => (
            <a
              key={title}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-primary dark:text-white dark:hover:text-primary"
            >
              {icon}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Footer;
