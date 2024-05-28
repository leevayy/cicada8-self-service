import React, { useEffect, useRef, useState } from "react";
import Block from "../../commons/Block";
import StepBlock from "../../commons/StepBlock";
import AuthLetterPreview from "./AuthLetterPreview";
import getAuthLetter from "../../api/getAuthLetter";
import { UserData } from "../SendMrpPage/FileUploadButton";
import PdfFilePreview from "./PdfFilePreview";
import Modal from "./Modal"; // Import the modal component

type SignAuthLetterProps = {
  userData: UserData;
  onSuccess: () => void;
};

const SignAuthLetter: React.FC<SignAuthLetterProps> = ({ userData, onSuccess }) => {
  const [state, setState] = useState<"initial" | "loading" | "error" | "success">("initial");
  const [document, setDocument] = useState<File | null>(null);
  const [id, setId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const emailInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAuthLetter = async () => {
      const document = await getAuthLetter(userData, setState);
      setDocument(document ?? null);
    };

    fetchAuthLetter();
  }, [userData]);

  const isDisabled = document === null || emailInput.current === null;

  const handleFormSubmit = async (e: React.FormEvent<HTMLInputElement>) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('document', document!, 'AuthLetter.pdf');
    formData.append('email', emailInput.current!.value);
    formData.append('name', userData.representative);

    const response = await fetch("http://localhost:8083/api/sendAuthMail", {
      method: "post",
      body: formData,
    });

    const responseJson = await response.json();

    setId(responseJson.signature_request_id);

    setIsModalOpen(true);

    let pollingInProgressTimeMs = 0;

    const POLLING_TIMEOUT = 5000;

    const MAX_POLLING_TIME = 15 * 60 * 1000;

    const longPoll = async (status: boolean) => {
      if (status) {
        onSuccess();
        return setIsModalOpen(false);
      }

      if (pollingInProgressTimeMs > MAX_POLLING_TIME) {
        alert("Timeout");
        return;
      }

      const responseStatus = await fetch("http://localhost:8083/api/getSignatureStatus/" + id, {});
  
      const responseStatusJson = await responseStatus.json();

      if (!responseStatus.ok) {
        alert("Fetching error");
        return;
      }

      setTimeout(() => {
        pollingInProgressTimeMs += POLLING_TIMEOUT;
        longPoll(responseStatusJson.status);
      }, POLLING_TIMEOUT);
    }

    await longPoll(false);
  };

  return (
    <>
      <StepBlock>2 шаг: Подпись</StepBlock>
      <div className="register">
        <Block>
          <div className="info">
            <h1>Подпись МЧД</h1>
            {state === 'error' ? "Error while loading a PDF" : <AuthLetterPreview document={document} isLoading={state === "loading"} />}
            <PdfFilePreview document={document} />
            <form>
              <input type="email" autoComplete="email" placeholder="Введите свой Email" ref={emailInput} />
              <input disabled={isDisabled} type="submit" className="button" value="Подписать" onClick={handleFormSubmit} />
            </form>
          </div>
        </Block>
      </div>
      {isModalOpen && (
        <Modal message="Сертификат отправлен! Проверьте свою почту, указанную ранее, вам должен был прийти сертификат на подпись."/>
      )}
    </>
  );
};

export default SignAuthLetter;
