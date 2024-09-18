export function log(...message: any[]): void {
    const date = new Date().toISOString();
    console.log(`[${date}] -`, ...message);
}

export function error(...message: any[]): void {
    const date = new Date().toISOString();
    console.error(`[${date}] -`, ...message);
}