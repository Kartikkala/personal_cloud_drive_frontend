export function shortenFilename(filename: string | null | undefined, startChars: number = 10, endChars: number = 10,): string 
{
    if (!filename) {
        return ""; // Return empty if no filename provided
    }

    // Calculate the minimum length where shortening makes sense (start + end + '...')
    const minLengthThreshold = startChars + endChars + 3;

    if (filename.length <= minLengthThreshold) {
        return filename; // No need to shorten if it's already short
    }

    // Get the first few characters
    const startPart = filename.substring(0, startChars);

    // Get the last few characters (ensuring endChars doesn't exceed remaining length)
    const endPart = filename.substring(filename.length - endChars);

    // Combine the parts
    return `${startPart}...${endPart}`;
}

export function formatBytes(bytes: number, decimals = 2) {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
  }