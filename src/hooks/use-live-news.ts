import { useQuery } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { getLiveNews } from "@/lib/news.functions";

export function useLiveNews() {
  const fetchLive = useServerFn(getLiveNews);
  return useQuery({
    queryKey: ["live-news"],
    queryFn: () => fetchLive(),
    refetchInterval: 2 * 60_000,
    refetchOnWindowFocus: true,
    staleTime: 60_000,
  });
}
