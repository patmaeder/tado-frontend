export default (file: Blob): Promise<String> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            resolve(reader.result as String);
        };

        reader.readAsDataURL(file);
    })
}