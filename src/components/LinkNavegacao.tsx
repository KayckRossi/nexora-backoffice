import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface LinkNavegacaoProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  classeAtiva?: string;
  classePendente?: string;
}

const LinkNavegacao = forwardRef<HTMLAnchorElement, LinkNavegacaoProps>(
  ({ className, classeAtiva, classePendente, to, ...props }, ref) => {
    return (
      <RouterNavLink
        ref={ref}
        to={to}
        className={({ isActive, isPending }) =>
          cn(className, isActive && classeAtiva, isPending && classePendente)
        }
        {...props}
      />
    );
  },
);

LinkNavegacao.displayName = "LinkNavegacao";

export { LinkNavegacao };
