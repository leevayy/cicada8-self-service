import React, { useRef } from 'react';
import sendMRP from '../../api/sendMRP';

export type UserData = {
  "organizationName": string,
  "address": string,
  "phone": string,
  "inn": number,
  "ogrn": number,
  "representative": string,
} 

type FileUploadButtonProps = {
  onSuccess: (userData: UserData) => void;
}

const FileUploadButton: React.FC<FileUploadButtonProps> = ({onSuccess}) => {
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }
    const response = await sendMRP(file);

    if (!response) {
      console.error('Empty response with code 200!');
      return;
    }

    onSuccess({
      "organizationName": response.company.name,
      "address": response.company.address,
      "phone": response.company.number,
      "inn": response.company.inn,
      "ogrn": response.company.ogrn,
      "representative": response.company.representative,
    });
  };

  return (
    <div>
      <button onClick={handleButtonClick} className="button">Загрузите файл</button>
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
    </div>
  );
};

export default FileUploadButton;
