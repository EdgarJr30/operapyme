import * as React from "react";

import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { PanelLeft } from "lucide-react";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { TooltipProvider } from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const SIDEBAR_KEYBOARD_SHORTCUT = "b";
const SIDEBAR_WIDTH = "17rem";
const SIDEBAR_WIDTH_ICON = "5.5rem";
const SIDEBAR_WIDTH_MOBILE = "17.5rem";

type SidebarContextValue = {
  state: "expanded" | "collapsed";
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContextValue | null>(null);

function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");
    const handleChange = (event: MediaQueryListEvent | MediaQueryList) => {
      setIsMobile(event.matches);
    };

    handleChange(mediaQuery);

    if (typeof mediaQuery.addEventListener === "function") {
      mediaQuery.addEventListener("change", handleChange);

      return () => {
        mediaQuery.removeEventListener("change", handleChange);
      };
    }

    mediaQuery.addListener(handleChange);

    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return isMobile;
}

export function useSidebar() {
  const context = React.useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.");
  }

  return context;
}

export const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      style,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);
    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;

    const setOpen = React.useCallback(
      (value: boolean) => {
        if (setOpenProp) {
          setOpenProp(value);
          return;
        }

        _setOpen(value);
      },
      [setOpenProp]
    );

    const toggleSidebar = React.useCallback(() => {
      if (isMobile) {
        setOpenMobile((currentValue) => !currentValue);
        return;
      }

      setOpen(!open);
    }, [isMobile, open, setOpen]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key.toLowerCase() !== SIDEBAR_KEYBOARD_SHORTCUT ||
          (!event.metaKey && !event.ctrlKey)
        ) {
          return;
        }

        event.preventDefault();
        toggleSidebar();
      };

      window.addEventListener("keydown", handleKeyDown);

      return () => {
        window.removeEventListener("keydown", handleKeyDown);
      };
    }, [toggleSidebar]);

    const contextValue = React.useMemo<SidebarContextValue>(
      () => ({
        state: open ? "expanded" : "collapsed",
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar
      }),
      [isMobile, open, openMobile, setOpen, toggleSidebar]
    );

    return (
      <TooltipProvider delayDuration={0}>
        <SidebarContext.Provider value={contextValue}>
          <div
            ref={ref}
            style={
              {
                "--sidebar-width": SIDEBAR_WIDTH,
                "--sidebar-width-icon": SIDEBAR_WIDTH_ICON,
                "--sidebar-width-mobile": SIDEBAR_WIDTH_MOBILE,
                ...style
              } as React.CSSProperties
            }
            className={cn(
              "group/sidebar-wrapper flex min-h-screen w-full bg-paper",
              className
            )}
            {...props}
          >
            {children}
          </div>
        </SidebarContext.Provider>
      </TooltipProvider>
    );
  }
);

SidebarProvider.displayName = "SidebarProvider";

export const Sidebar = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div"> & {
    side?: "left" | "right";
    variant?: "sidebar" | "floating" | "inset";
    collapsible?: "offcanvas" | "icon" | "none";
  }
>(
  (
    {
      side = "left",
      variant = "sidebar",
      collapsible = "offcanvas",
      className,
      children,
      ...props
    },
    ref
  ) => {
    const { isMobile, openMobile, setOpenMobile, state } = useSidebar();

    if (collapsible === "none") {
      return (
        <div
          ref={ref}
          data-slot="sidebar"
          className={cn(
            "hidden h-svh w-(--sidebar-width) lg:flex lg:flex-col",
            className
          )}
          {...props}
        >
          {children}
        </div>
      );
    }

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile}>
          <SheetContent
            side={side}
            className="w-(--sidebar-width-mobile) border-sidebar-border bg-sidebar-surface p-0 text-sidebar-text shadow-soft [&>button]:hidden"
          >
            <div
              data-slot="sidebar"
              data-mobile="true"
              className="flex h-full min-h-0 flex-col"
            >
              {children}
            </div>
          </SheetContent>
        </Sheet>
      );
    }

    return (
      <div
        data-slot="sidebar-wrapper"
        data-state={state}
        data-collapsible={state === "collapsed" ? collapsible : ""}
        data-variant={variant}
        data-side={side}
        className="group peer hidden text-sidebar-text lg:block"
      >
        <div
          className={cn(
            "relative h-svh w-(--sidebar-width) bg-transparent transition-[width] duration-200 ease-linear",
            collapsible === "icon" &&
              "group-data-[collapsible=icon]:w-(--sidebar-width-icon)"
          )}
        />
        <div
          ref={ref}
          data-slot="sidebar-container"
          className={cn(
            "fixed inset-y-0 z-40 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear lg:flex",
            side === "left"
              ? "left-0 group-data-[collapsible=offcanvas]:left-[calc(var(--sidebar-width)*-1)]"
              : "right-0 group-data-[collapsible=offcanvas]:right-[calc(var(--sidebar-width)*-1)]",
            collapsible === "icon" &&
              "group-data-[collapsible=icon]:w-(--sidebar-width-icon)",
            variant === "floating" || variant === "inset" ? "p-2" : "",
            className
          )}
          {...props}
        >
          <div
            data-sidebar="sidebar"
            className={cn(
              "flex h-full min-h-0 w-full flex-col overflow-hidden bg-sidebar-surface text-sidebar-text",
              variant === "floating" || variant === "inset"
                ? "rounded-3xl border border-sidebar-border shadow-soft"
                : "border-r border-sidebar-border"
            )}
          >
            {children}
          </div>
        </div>
      </div>
    );
  }
);

Sidebar.displayName = "Sidebar";

export const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"main">
>(({ className, ...props }, ref) => (
  <main
    ref={ref}
    data-slot="sidebar-inset"
    className={cn(
      "relative flex min-h-screen min-w-0 flex-1 flex-col bg-paper",
      className
    )}
    {...props}
  />
));

SidebarInset.displayName = "SidebarInset";

export const SidebarTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, children, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      data-sidebar="trigger"
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-xl border border-line/70 bg-paper text-ink shadow-panel transition hover:bg-sand/70",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      {...props}
    >
      {children ?? (
        <>
          <PanelLeft className="size-5 rtl:rotate-180" aria-hidden="true" />
          <span className="sr-only">Toggle Sidebar</span>
        </>
      )}
    </button>
  );
});

SidebarTrigger.displayName = "SidebarTrigger";

export const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Toggle Sidebar"
      className={cn(
        "absolute inset-y-0 -right-4 z-20 hidden w-4 transition hover:after:bg-sidebar-border group-data-[side=right]:-left-4 lg:flex",
        "after:absolute after:inset-y-0 after:left-1/2 after:w-px after:-translate-x-1/2 after:bg-transparent",
        className
      )}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          toggleSidebar();
        }
      }}
      {...props}
    />
  );
});

SidebarRail.displayName = "SidebarRail";

export const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-header"
    className={cn("flex flex-col gap-3", className)}
    {...props}
  />
));

SidebarHeader.displayName = "SidebarHeader";

export const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-footer"
    className={cn("mt-auto flex flex-col gap-3", className)}
    {...props}
  />
));

SidebarFooter.displayName = "SidebarFooter";

export const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-content"
    className={cn("min-h-0 flex-1 overflow-auto", className)}
    {...props}
  />
));

SidebarContent.displayName = "SidebarContent";

export const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"section">
>(({ className, ...props }, ref) => (
  <section
    ref={ref}
    data-slot="sidebar-group"
    className={cn("space-y-2", className)}
    {...props}
  />
));

SidebarGroup.displayName = "SidebarGroup";

export const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-group-label"
    className={cn(
      "px-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-sidebar-muted transition group-data-[collapsible=icon]:opacity-0",
      className
    )}
    {...props}
  />
));

SidebarGroupLabel.displayName = "SidebarGroupLabel";

export const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<"div">
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-slot="sidebar-group-content"
    className={cn("space-y-1", className)}
    {...props}
  />
));

SidebarGroupContent.displayName = "SidebarGroupContent";

export const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="sidebar-group-action"
    className={cn(
      "inline-flex size-8 items-center justify-center rounded-lg text-sidebar-muted transition hover:bg-sidebar-elevated hover:text-sidebar-text",
      className
    )}
    {...props}
  />
));

SidebarGroupAction.displayName = "SidebarGroupAction";

export const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="sidebar-menu"
    className={cn("space-y-1", className)}
    {...props}
  />
));

SidebarMenu.displayName = "SidebarMenu";

export const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="sidebar-menu-item"
    className={cn("relative", className)}
    {...props}
  />
));

SidebarMenuItem.displayName = "SidebarMenuItem";

const sidebarMenuButtonVariants = cva(
  "peer/menu-button flex w-full items-center overflow-hidden rounded-xl text-left text-sm font-medium outline-none transition disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      size: {
        default: "min-h-11 gap-3 px-3",
        sm: "min-h-9 gap-2.5 px-3 text-[13px]"
      }
    },
    defaultVariants: {
      size: "default"
    }
  }
);

export const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button"> & {
    asChild?: boolean;
    isActive?: boolean;
    size?: "default" | "sm";
  }
>(
  (
    { asChild = false, isActive = false, size = "default", className, ...props },
    ref
  ) => {
    const Component = asChild ? Slot : "button";

    return (
      <Component
        ref={ref}
        data-slot="sidebar-menu-button"
        data-active={isActive}
        className={cn(
          sidebarMenuButtonVariants({ size }),
          "text-sidebar-text hover:bg-sidebar-elevated hover:text-sidebar-text",
          "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-contrast data-[active=true]:shadow-soft",
          className
        )}
        {...props}
      />
    );
  }
);

SidebarMenuButton.displayName = "SidebarMenuButton";

export const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<"button">
>(({ className, ...props }, ref) => (
  <button
    ref={ref}
    type="button"
    data-slot="sidebar-menu-action"
    className={cn(
      "absolute right-2 top-1/2 inline-flex size-7 -translate-y-1/2 items-center justify-center rounded-lg text-sidebar-muted transition hover:bg-sidebar-elevated hover:text-sidebar-text",
      className
    )}
    {...props}
  />
));

SidebarMenuAction.displayName = "SidebarMenuAction";

export const SidebarMenuBadge = React.forwardRef<
  HTMLSpanElement,
  React.ComponentProps<"span">
>(({ className, ...props }, ref) => (
  <span
    ref={ref}
    data-slot="sidebar-menu-badge"
    className={cn(
      "absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-sidebar-elevated px-1.5 py-0.5 text-[10px] font-semibold text-sidebar-muted",
      className
    )}
    {...props}
  />
));

SidebarMenuBadge.displayName = "SidebarMenuBadge";

export const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<"ul">
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-slot="sidebar-menu-sub"
    className={cn("relative ml-4 space-y-1 pl-3.5", className)}
    {...props}
  />
));

SidebarMenuSub.displayName = "SidebarMenuSub";

export const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<"li">
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-slot="sidebar-menu-sub-item"
    className={cn("relative", className)}
    {...props}
  />
));

SidebarMenuSubItem.displayName = "SidebarMenuSubItem";

export const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<"a"> & {
    asChild?: boolean;
    isActive?: boolean;
  }
>(({ asChild = false, isActive = false, className, ...props }, ref) => {
  const Component = asChild ? Slot : "a";

  return (
    <Component
      ref={ref}
      data-slot="sidebar-menu-sub-button"
      data-active={isActive}
      className={cn(
        "flex min-h-9 items-center rounded-xl px-3 text-[13px] font-medium text-sidebar-muted transition hover:bg-sidebar-elevated hover:text-sidebar-text",
        "data-[active=true]:bg-sidebar-elevated data-[active=true]:text-sidebar-text data-[active=true]:shadow-panel",
        className
      )}
      {...props}
    />
  );
});

SidebarMenuSubButton.displayName = "SidebarMenuSubButton";

export function SidebarMenuSkeleton({
  className,
  showIcon = false
}: React.ComponentProps<"div"> & { showIcon?: boolean }) {
  return (
    <div
      data-slot="sidebar-menu-skeleton"
      className={cn(
        "flex min-h-11 items-center gap-3 rounded-xl px-3",
        className
      )}
    >
      {showIcon ? (
        <span className="size-9 rounded-lg bg-sidebar-elevated/80" />
      ) : null}
      <span className="h-4 flex-1 rounded-full bg-sidebar-elevated/80" />
    </div>
  );
}
