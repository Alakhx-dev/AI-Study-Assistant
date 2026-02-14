import { useAuth } from "@/hooks/useAuth";
import { SettingsDropdown } from "@/components/SettingsDropdown";
import { ProfileDropdown } from "@/components/ProfileDropdown";
import { cn } from "@/lib/utils";

interface GlobalHeaderProps {
    authenticated?: boolean;
    className?: string;
}

export const GlobalHeader = ({ authenticated = false, className }: GlobalHeaderProps) => {
    const { user } = useAuth();

    // Only show profile if user is logged in
    const showProfile = authenticated || !!user;

    return (
        <div className={cn("flex items-center gap-2", className)}>
            <SettingsDropdown />
            {showProfile && <ProfileDropdown />}
        </div>
    );
};
