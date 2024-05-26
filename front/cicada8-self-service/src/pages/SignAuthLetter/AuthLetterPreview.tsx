type AuthLetterPreviewProps = {
  document: File | null;
  isLoading: boolean;
}

const AuthLetterPreview: React.FC<AuthLetterPreviewProps> = ({ document, isLoading }) => {
  return (
    (!document || isLoading) ?
      <div style={{
        backgroundColor: '#D9D9D9',
        height: "500px",
        width: "400px",
        borderRadius: "10px",
      }} /> :
      <div style={{
        backgroundColor: '#D9D9D9',
        height: "500px",
        width: "400px",
        borderRadius: "10px",
        color: '#232323',
      }}>
        Assume this is loaded pdf, {document.name}
      </div>
  );
}

export default AuthLetterPreview;