import { createClient } from "@/lib/supabase/client";

export function subscribeToLoadStatus(loadId: string, callback: (status: string) => void) {
  const supabase = createClient();
  const channel = supabase
    .channel(`load-status-${loadId}`)
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "load_submissions",
        filter: `id=eq.${loadId}`,
      },
      (payload) => {
        const status = (payload.new as { status?: string }).status;
        if (status) callback(status);
      },
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}
