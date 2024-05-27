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

        console.log(result.letter.content)

        if (result.status === 'success') {
            setState('success');

            const pdfBlob = new Blob([new Uint8Array(Object.values(result.letter.content))], { type: 'application/pdf' });

            console.log(pdfBlob);

            const pdfFile = new File([pdfBlob], 'AuthorizingLetter.pdf', { type: 'application/pdf' });

            return pdfFile;
        } else {
            throw new Error(result.message);
        }
    } catch (error) {
        setState('error');
        console.error(error);
    }
}

export default getAuthLetter;