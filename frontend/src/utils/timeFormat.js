// =====================================================================
// RELATIVE TIME FORMATTING
//
// Turns a timestamp (e.g. the device's lastUpdated field) into a
// human-friendly "time ago" string such as "Updated 134 days ago".
// Used by the shared top device-header card so it reads the same way
// on every nav tab (Home / Power / Fault).
// =====================================================================

/**
 * @param {string|number|Date} timestamp
 * @returns {string} e.g. "just now", "5 minutes ago", "3 hours ago",
 *                        "134 days ago", "2 years ago", or "--" if unknown
 */
export function formatUpdatedAgo(timestamp) {

    if (!timestamp) {
        return "--";
    }

    const updatedTime = new Date(timestamp).getTime();

    if (!Number.isFinite(updatedTime)) {
        return "--";
    }

    const diffMs = Date.now() - updatedTime;

    if (diffMs < 0) {
        return "just now";
    }

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffMonths = Math.floor(diffDays / 30);
    const diffYears = Math.floor(diffDays / 365);

    if (diffSeconds < 60) {
        return "just now";
    }

    if (diffMinutes < 60) {
        return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;
    }

    if (diffHours < 24) {
        return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;
    }

    if (diffDays < 30) {
        return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;
    }

    if (diffDays < 365) {
        return `${diffMonths} month${diffMonths === 1 ? "" : "s"} ago`;
    }

    return `${diffYears} year${diffYears === 1 ? "" : "s"} ago`;
}
