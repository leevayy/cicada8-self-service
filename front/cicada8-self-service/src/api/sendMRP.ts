type UserResponseData = {
    "company": {
        "name": string,
        "address": string,
        "number": string,
        "inn": number,
        "ogrn": number,
        "representative": string,
    }
    "ctime": string
}

export default async function sendMRP(file: File) {
    const formData = new FormData();
      formData.append('document', file);

    try {
        const response = await fetch('http://localhost:8083/api/sendMRP', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          return data as UserResponseData;
        } else {
          console.error('File upload failed:', response.statusText);
        }
    } catch (error) {
        console.error('Error uploading file:', error);
    }
}
