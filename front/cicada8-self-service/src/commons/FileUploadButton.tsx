import React, { useRef } from 'react';
import sendMRP from '../../api/sendMRP.ts';

export type UserData = {
  "organizationName": string,
  "address": string,
  "phone": string,
  "inn": number,
  "ogrn": number,
  "currentDate": string,
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
    // const response = await sendMRP(file);
    const response =  {
      "company": {
        "name": "ООО Информационные технологии",
        "address": "Улица Пушкина, дом Колотушкина",
        "number": "89811400226",
        "inn": 9204329502,
        "ogrn": 1230932804,
        "representative": "Иванов Иван Иванович",
      }, 
      "ctime": "2024-05-2615:25:13.653097849+03:00"
    }

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
      "currentDate": "2024-05-26",
      "representative": "Алексеев Алексей Алексеевич"
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
