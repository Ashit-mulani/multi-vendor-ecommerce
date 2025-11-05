import { useEffect } from "react";

const domains = [
  process.env.NEXT_PUBLIC_VENDOR_URL,
  process.env.NEXT_PUBLIC_ADMIN_URL,
];

export function getRedirectUrl() {
  const params = new URLSearchParams(window.location.search);
  let redirect = params.get("redirect");

  if (!redirect) {
    redirect = localStorage.getItem("_redirect");
  }

  if (redirect) {
    try {
      const url = new URL(redirect, window.location.origin);
      const isAllowed = domains.some((domain) => {
        if (!domain) return false;
        try {
          const allowed = new URL(domain);
          return url.origin === allowed.origin;
        } catch {
          return false;
        }
      });
      if (isAllowed) {
        localStorage.setItem("_redirect", redirect);
        return redirect;
      }
    } catch {
      clearRedirectUrl();
      return false;
    }
  }

  return null;
}

export function clearRedirectUrl() {
  localStorage.removeItem("_redirect");
}

export function useStoreRedirect() {
  useEffect(() => {
    if (!localStorage.getItem("_redirect")) {
      const params = new URLSearchParams(window.location.search);
      const redirectUrl = params.get("redirect");
      if (redirectUrl && redirectUrl?.startsWith("http")) {
        localStorage.setItem("_redirect", redirectUrl);
      }
    }
  }, []);
}
