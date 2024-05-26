import { UserData } from "../pages/SendMrpPage/FileUploadButton";

const getAuthLetter = async (data: UserData, setState: React.Dispatch<React.SetStateAction<"initial" | "loading" | "error" | "success">>) => {
    try {
        setState('loading');

        const response = await fetch('http://localhost:3000/api/getAuthMail', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });

        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }

        const result = await response.json();
        if (result.status === 'success') {
            setState('success');
            const pdfBlob = new Blob([new Uint8Array(result.letter.content)], { type: 'application/pdf' });

            const pdfFile = new File([pdfBlob], 'AuthorizingLetter.pdf', { type: 'application/pdf' });
            // const pdfUrl = URL.createObjectURL(pdfBlob);

            return pdfFile;

            // // Create a link element to download the PDF
            // const link = document.createElement('a');
            // link.href = pdfUrl;
            // link.download = 'AuthorizingLetter.pdf';
            // document.body.appendChild(link);
            // link.click();

            // Clean up
            // document.body.removeChild(link);
            // URL.revokeObjectURL(pdfUrl);
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        setState('error');
        console.error(error);
    }
}

export default getAuthLetter;