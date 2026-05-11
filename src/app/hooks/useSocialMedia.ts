import { useEffect, useState } from "react";
import {
  fetchSocialMedia,
  getCachedSocialMedia,
  subscribeSocialMedia,
  type SocialMedia,
} from "../api/socialMedia";

export function useSocialMedia(): SocialMedia | null {
  const [data, setData] = useState<SocialMedia | null>(getCachedSocialMedia());
  useEffect(() => {
    let mounted = true;
    fetchSocialMedia()
      .then((s) => {
        if (mounted) setData(s);
      })
      .catch(() => {
        /* network failure — Footer falls back to nothing */
      });
    const unsub = subscribeSocialMedia((s) => {
      if (mounted) setData(s);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);
  return data;
}
