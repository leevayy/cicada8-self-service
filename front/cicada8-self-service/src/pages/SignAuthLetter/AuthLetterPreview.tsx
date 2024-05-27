import mockAuthLetter from "./../../assets/authLetterMock.png";

type AuthLetterPreviewProps = {
  document: File | null;
  isLoading: boolean;
}

const AuthLetterPreview: React.FC<AuthLetterPreviewProps> = ({ document, isLoading }) => {
  return (
    (!document || isLoading) ?
      <div style={{
        backgroundColor: '#d9d9d9',
        height: "300px",
        width: "500px",
        borderRadius: "10px",
      }} /> :
      <div style={{
        backgroundColor: '#D9D9D9',
        height: "300px",
        width: "500px",
        borderRadius: "10px",
        color: '#d9d9d9',
        overflowY: 'scroll',
        overflowX: 'hidden',
      }}>
        <img src={mockAuthLetter} alt="AuthLetter" style={{width: '100%'}}/>
      </div>
  );
}

export default AuthLetterPreview;