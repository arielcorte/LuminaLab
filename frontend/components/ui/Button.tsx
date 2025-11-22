"use client";

import { forwardRef, type ButtonHTMLAttributes, type AnchorHTMLAttributes } from "react";
import Link, { type LinkProps } from "next/link";
import { tv, type VariantProps } from "tailwind-variants";
import { twMerge } from "tailwind-merge";

// ------------
// Tailwind Variants para estilos modernos
// ------------
const buttonStyles = tv({
  base: "inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:opacity-50",
  variants: {
    variant: {
      solid: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-border text-foreground hover:bg-accent",
      ghost: "hover:bg-muted",
    },
    size: {
      sm: "h-8 px-3 text-sm",
      md: "h-10 px-4",
      lg: "h-12 px-6 text-lg",
    },
  },
  defaultVariants: {
    variant: "solid",
    size: "md",
  },
});

type AsButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & { as?: "button" };
type AsAnchorProps = AnchorHTMLAttributes<HTMLAnchorElement> & { as: "a" };
type AsLinkProps = LinkProps & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof LinkProps> & { as: typeof Link };

type ButtonProps = VariantProps<typeof buttonStyles> &
  (AsButtonProps | AsAnchorProps | AsLinkProps) & {
    className?: string;
  };

// ------------
// Componente
// ------------
export const Button = forwardRef<HTMLButtonElement | HTMLAnchorElement, ButtonProps>(
  ({ variant, size, className, as = "button", ...props }, ref) => {
    const classes = twMerge(buttonStyles({ variant, size }), className);

    // Caso 1: Next.js <Link>
    if (as === Link) {
      const { href, ...rest } = props as AsLinkProps;

      if (!href) {
        throw new Error("Button with `as={Link}` requiere prop `href`.");
      }

      return (
        <Link href={href} {...rest} className={classes}>
          {rest.children}
        </Link>
      );
    }

    // Caso 2: <a>
    if (as === "a") {
      return <a ref={ref as any} className={classes} {...(props as AsAnchorProps)} />;
    }

    // Caso 3: <button> (default)
    return <button ref={ref as any} className={classes} {...(props as AsButtonProps)} />;
  }
);

Button.displayName = "Button";
