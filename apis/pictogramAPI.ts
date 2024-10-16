export const fetchPictograms = async () => {
    const res = await fetch(`https://api.arasaac.org/v1/pictograms/27575?color=true&download=false`);

    if (!res.ok) throw new Error(`Failed to fetch pictograms, status code: ${res.status}`);

    const contentType = res.headers.get('Content-Type');
    if (contentType?.includes('image/png') || contentType?.includes('image/jpeg')) {
        const imageBlob = await res.blob();
        return URL.createObjectURL(imageBlob);
    } else {
        throw new Error('Response is not an image');
    }
};