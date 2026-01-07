/**
 * Utility to get the base path for assets in production (GitHub Pages)
 * In development, returns empty string
 * In production, returns /OverlayStudio
 */
export function getBasePath(): string {
    // Check if we're in production and need the base path
    if (typeof window !== 'undefined') {
        // In browser, check if we're on GitHub Pages
        const isGitHubPages = window.location.hostname.includes('github.io');
        return isGitHubPages ? '/OverlayStudio' : '';
    }

    // Server-side or build time
    return process.env.NODE_ENV === 'production' ? '/OverlayStudio' : '';
}

/**
 * Prepends the base path to an asset URL
 * @param path - The asset path (e.g., "/assets/background/seattle.jpg")
 * @returns The full path with base path prepended
 */
export function withBasePath(path: string): string {
    const basePath = getBasePath();

    // If path already includes the base path, don't add it again
    if (basePath && path.startsWith(basePath)) {
        return path;
    }

    // Ensure path starts with /
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${basePath}${normalizedPath}`;
}
