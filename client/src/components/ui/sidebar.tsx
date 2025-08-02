"use client"

import * as React from "react"
import { VariantProps, cva } from "class-variance-authority"
import { PanelLeft } from "lucide-react"

import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"
import { Sheet, SheetContent, SheetOverlay, SheetPortal } from "./sheet"
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip"
import { Button } from "./button"

type SidebarContextProps = {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  openMobile: boolean
  setOpenMobile: React.Dispatch<React.SetStateAction<boolean>>
  isMobile: boolean
  toggleSidebar: () => void
}

const SidebarContext = React.createContext<SidebarContextProps | undefined>(
  undefined
)

function useSidebar() {
  const context = React.useContext(SidebarContext)

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider.")
  }

  return context
}

const SidebarProvider = ({ children }: { children: React.ReactNode }) => {
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(!isMobile)
  const [openMobile, setOpenMobile] = React.useState(false)

  React.useEffect(() => {
    setOpen(!isMobile)
  }, [isMobile])

  const toggleSidebar = React.useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev)
    } else {
      setOpen((prev) => !prev)
    }
  }, [isMobile, setOpen, setOpenMobile])

  return (
    <SidebarContext.Provider
      value={{
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  )
}

const sidebarVariants = cva(
  "flex flex-col h-full transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-background border-r border-border",
      },
      collapsed: {
        true: "w-16",
        false: "w-64",
      },
    },
    defaultVariants: {
      variant: "default",
      collapsed: false,
    },
  }
)

interface SidebarProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sidebarVariants> {
  children: React.ReactNode
}

const Sidebar = React.forwardRef<HTMLDivElement, SidebarProps>(
  ({ className, children, variant, ...props }, ref) => {
    const { open, openMobile, setOpenMobile, isMobile } = useSidebar()

    if (isMobile) {
      return (
        <Sheet open={openMobile} onOpenChange={setOpenMobile} {...props}>
          <SheetContent
            data-sidebar="sidebar"
            data-mobile="true"
            side="left"
            className={cn(
              "inset-y-0 flex h-auto w-64 flex-col p-0",
              className
            )}
          >
            {children}
          </SheetContent>
        </Sheet>
      )
    }

    return (
      <aside
        ref={ref}
        className={cn(sidebarVariants({ variant, collapsed: !open }), className)}
        {...props}
      >
        {children}
      </aside>
    )
  }
)
Sidebar.displayName = "Sidebar"

const SidebarHeader = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()
  return (
    <div
      className={cn(
        "flex items-center p-4",
        open ? "justify-between" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
SidebarHeader.displayName = "SidebarHeader"

const SidebarToggle = ({
  className,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { toggleSidebar, open } = useSidebar()
  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn("h-8 w-8", className)}
      onClick={toggleSidebar}
      {...props}
    >
      <PanelLeft className={cn("h-4 w-4", !open && "-rotate-180")} />
    </Button>
  )
}
SidebarToggle.displayName = "SidebarToggle"

const SidebarNav = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <nav className={cn("flex-1 p-2", className)} {...props}>
      {children}
    </nav>
  )
}
SidebarNav.displayName = "SidebarNav"

const SidebarNavList = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  return (
    <div className={cn("flex flex-col gap-1", className)} {...props}>
      {children}
    </div>
  )
}
SidebarNavList.displayName = "SidebarNavList"

const SidebarNavItem = ({
  className,
  children,
  active,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { active?: boolean }) => {
  const { open } = useSidebar()
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
        active
          ? "bg-accent text-accent-foreground"
          : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
        open ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
SidebarNavItem.displayName = "SidebarNavItem"

const SidebarNavIcon = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()
  return (
    <div
      className={cn(
        "flex items-center justify-center",
        open ? "w-6" : "w-full",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
SidebarNavIcon.displayName = "SidebarNavIcon"

const SidebarNavLink = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { open } = useSidebar()
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full",
        open ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
SidebarNavLink.displayName = "SidebarNavLink"

const SidebarNavLabel = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()
  if (!open) return null
  return (
    <div className={cn("flex-1", className)} {...props}>
      {children}
    </div>
  )
}
SidebarNavLabel.displayName = "SidebarNavLabel"

const SidebarFooter = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()
  return (
    <div
      className={cn(
        "flex items-center p-4",
        open ? "justify-between" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
SidebarFooter.displayName = "SidebarFooter"

const SidebarFooterItem = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
        open ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
SidebarFooterItem.displayName = "SidebarFooterItem"

const SidebarFooterLink = ({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Button>) => {
  const { open } = useSidebar()
  return (
    <Button
      variant="ghost"
      className={cn(
        "w-full",
        open ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      {children}
    </Button>
  )
}
SidebarFooterLink.displayName = "SidebarFooterLink"

const SidebarFooterLabel = ({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()
  if (!open) return null
  return (
    <div className={cn("flex-1", className)} {...props}>
      {children}
    </div>
  )
}
SidebarFooterLabel.displayName = "SidebarFooterLabel"

const SidebarOverlay = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { openMobile, setOpenMobile } = useSidebar()
  return (
    <SheetOverlay
      className={cn(
        "fixed inset-0 z-40 bg-black/50 transition-opacity duration-300",
        openMobile ? "opacity-100" : "opacity-0 pointer-events-none",
        className
      )}
      onClick={() => setOpenMobile(false)}
      {...props}
    />
  )
}
SidebarOverlay.displayName = "SidebarOverlay"

const SidebarSkeleton = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => {
  const { open } = useSidebar()
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`
  }, [])
  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium",
        open ? "justify-start" : "justify-center",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "h-6 w-6 shrink-0 rounded-full bg-muted",
          open ? "mr-2" : "mr-0"
        )}
      />
      {open && <div className="h-4 rounded-md bg-muted" style={{ width }} />}
    </div>
  )
}
SidebarSkeleton.displayName = "SidebarSkeleton"

export {
  Sidebar,
  SidebarProvider,
  useSidebar,
  SidebarHeader,
  SidebarToggle,
  SidebarNav,
  SidebarNavList,
  SidebarNavItem,
  SidebarNavIcon,
  SidebarNavLink,
  SidebarNavLabel,
  SidebarFooter,
  SidebarFooterItem,
  SidebarFooterLink,
  SidebarFooterLabel,
  SidebarOverlay,
  SidebarSkeleton,
}