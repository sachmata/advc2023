export default function zip(...arrays) {
    return Array.from(
        {
            length: Math.min(...arrays.map(a => a.length)),
        },
        (_, i) => arrays.map(a => a[i])
    );
}
