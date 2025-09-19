import { useEffect } from "react";

export default function DisableScrollRestoration() {
    useEffect(() => {
        const h = window.history as History & { scrollRestoration?: string };
        if ("scrollRestoration" in h) {
            const prev = h.scrollRestoration!;
            h.scrollRestoration = "manual";
            return () => { h.scrollRestoration = prev; };
        }
    }, []);
    return null;
}