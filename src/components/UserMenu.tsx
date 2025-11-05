import { useState } from "react";
import { LogOutIcon, UserIcon } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner";

interface UserMenuProps {
  userEmail: string;
}

export function UserMenu({ userEmail }: UserMenuProps) {
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    try {
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      
      // Redirect to home page
      window.location.href = "/";
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout", {
        description: "Please try again",
      });
      setIsLoggingOut(false);
    }
  };

  // Get first letter of email for avatar
  const initial = userEmail.charAt(0).toUpperCase();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full h-9 w-9"
          aria-label="User menu"
        >
          <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-semibold text-primary">{initial}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Account</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userEmail}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem 
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="cursor-pointer"
        >
          <LogOutIcon className="mr-2 h-4 w-4" />
          <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

