import pdfLogo from "./../../assets/pdfLogo.svg"

type PdfFilePreviewProps = {
    document: File | null;
}

const PdfFilePreview: React.FC<PdfFilePreviewProps> = ({ document }) => {
    const fileUrl = document ? URL.createObjectURL(document) : '';

    return (document !== null ? <>
        <a className={"smallText pdf"} href={fileUrl} download>
            <img src={pdfLogo} alt="PDF Logo" />
            <div>
                <p>{document.name}</p>
                <p>{(document.size / 1024).toFixed(2)} KB</p>
            </div>
        </a>
    </> :
        <div style={{
            backgroundColor: '#D9D9D9',
            height: "50px",
            width: "240px",
            borderRadius: "10px",
            color: '#444444',
        }} />
    );
}

export default PdfFilePreview;