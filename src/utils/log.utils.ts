export function log(...message: string[]): void {
    const date = new Date().toISOString();
    console.log(`[${date}] -`, ...message);
}

export function error(...message: string[]): void {
    const date = new Date().toISOString();
    console.error(`[${date}] -`, ...message);
}