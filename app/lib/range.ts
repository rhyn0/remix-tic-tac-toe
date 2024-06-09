export function range({
    start,
    stop,
    step = 1,
}: { start: number; stop: number; step?: number }): number[] {
    const result = [];
    for (let i = start; i < stop; i += step) {
        result.push(i);
    }
    return result;
}
