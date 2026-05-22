import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { Heart, Bookmark } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { toggleLike, toggleSave, getMyEngagement, getPropertyEngagement } from "@/lib/social.functions";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export function PropertyActions({ propertyId }: { propertyId: string }) {
  const { user, loading: authLoading } = useAuth();
  const qc = useQueryClient();
  const fetchEngagement = useServerFn(getPropertyEngagement);
  const fetchMine = useServerFn(getMyEngagement);
  const likeFn = useServerFn(toggleLike);
  const saveFn = useServerFn(toggleSave);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup");

  const { data: counts } = useQuery({
    queryKey: ["engagement", propertyId],
    queryFn: () => fetchEngagement({ data: { propertyId } }),
  });

  const { data: mine } = useQuery({
    queryKey: ["my-engagement", propertyId, user?.id],
    queryFn: () => fetchMine({ data: { propertyId } }),
    enabled: !!user,
  });

  const likeMut = useMutation({
    mutationFn: () => likeFn({ data: { propertyId } }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["engagement", propertyId] });
      qc.invalidateQueries({ queryKey: ["my-engagement", propertyId] });
      toast.success(r.liked ? "Added to likes" : "Removed from likes");
    },
    onError: (e) => toast.error(e.message),
  });

  const saveMut = useMutation({
    mutationFn: () => saveFn({ data: { propertyId } }),
    onSuccess: (r) => {
      qc.invalidateQueries({ queryKey: ["engagement", propertyId] });
      qc.invalidateQueries({ queryKey: ["my-engagement", propertyId] });
      qc.invalidateQueries({ queryKey: ["saved-properties"] });
      toast.success(r.saved ? "Saved to your list" : "Removed from saved");
    },
    onError: (e) => toast.error(e.message),
  });

  function requireAuth(action: () => void) {
    if (!user) {
      setAuthMode("signup");
      setAuthOpen(true);
      return;
    }
    action();
  }

  return (
    <>
      <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-3">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-11 w-full gap-2 rounded-full border-white/15 text-white hover:bg-white/10 sm:h-9 sm:w-auto",
            mine?.liked && "border-red-400/50 bg-red-500/10 text-red-400",
          )}
          disabled={authLoading || likeMut.isPending}
          onClick={() => requireAuth(() => likeMut.mutate())}
        >
          <Heart className={cn("h-4 w-4", mine?.liked && "fill-current")} />
          Like {counts?.likeCount != null && counts.likeCount > 0 ? `(${counts.likeCount})` : ""}
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className={cn(
            "h-11 w-full gap-2 rounded-full border-white/15 text-white hover:bg-white/10 sm:h-9 sm:w-auto",
            mine?.saved && "border-[#c6f135] bg-[#c6f135]/15 text-[#c6f135]",
          )}
          disabled={authLoading || saveMut.isPending}
          onClick={() => requireAuth(() => saveMut.mutate())}
        >
          <Bookmark className={cn("h-4 w-4", mine?.saved && "fill-current")} />
          Save
        </Button>
        {!user && (
          <span className="text-xs text-white/45">Sign up free to like & save</span>
        )}
      </div>
      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} mode={authMode} onModeChange={setAuthMode} />
    </>
  );
}
