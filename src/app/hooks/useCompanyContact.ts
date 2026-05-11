import { useEffect, useState } from "react";
import {
  fetchCompanyContact,
  getCachedCompanyContact,
  subscribeCompanyContact,
  type CompanyContact,
} from "../api/companyContact";

/**
 * Reads the singleton company-contact record. Fetches on first mount,
 * shares one in-flight request across all consumers, and re-renders
 * whenever the record is updated via `updateCompanyContact()`.
 */
export function useCompanyContact(): CompanyContact | null {
  const [data, setData] = useState<CompanyContact | null>(
    getCachedCompanyContact(),
  );

  useEffect(() => {
    let mounted = true;
    fetchCompanyContact()
      .then((c) => {
        if (mounted) setData(c);
      })
      .catch(() => {
        /* network failure — Footer / Contact fall back to placeholders */
      });
    const unsub = subscribeCompanyContact((c) => {
      if (mounted) setData(c);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return data;
}
