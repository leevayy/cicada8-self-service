import { useEffect, useRef, useState } from "react";
import Block from "../../commons/Block";
import StepBlock from "../../commons/StepBlock";
import AuthLetterPreview from "./AuthLetterPreview";
import getAuthLetter from "../../api/getAuthLetter";
import { UserData } from "../SendMrpPage/FileUploadButton";
import PdfFilePreview from "./PdfFilePreview";

type SugnAuthLetterProps = {
  userData: UserData;
  onSuccess: () => void;
}

const SignAuthLetter: React.FC<SugnAuthLetterProps> = ({ userData, onSuccess }) => {
  const [state, setState] = useState<"initial" | "loading" | "error" | "success">("initial");
  const [document, setDocument] = useState<File | null>(null);
  
  const emailInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const fetchAuthLetter = async () => {
      const document = await getAuthLetter(userData, setState);

      setDocument(document ?? null);
    };

    fetchAuthLetter();
  }, [userData]);

  const isDisabled = document===null || emailInput.current === null;

  return <>
    <StepBlock>2 шаг: Подпись</StepBlock>
    <div className=".register">
      <Block>
        <div className="info">
          <h1>Подпись МЧД</h1>
          {
            state === 'error' ?
              "Error while loading a PDF" :
              <AuthLetterPreview
                document={document}
                isLoading={state === "loading"}
              ></AuthLetterPreview>
          }
          <PdfFilePreview document={document}/>
          <form>
            <input type="email" autoComplete="email" placeholder="Введите свой Email" ref={emailInput} />
            <input disabled={isDisabled} type="submit" className={`button`} value={"Подписать"} onClick={(e: React.FormEvent<HTMLInputElement>) => {
              e.preventDefault();

              const formData = new FormData();
              formData.append('document', document!.slice(0, 1), 'AuthLetter.pdf');
              formData.append('email', emailInput.current!.value);
              formData.append('name', userData.representative);

              fetch("http://localhost:8083/api/sendAuthMail", {
                method: "post",
                body: formData
              });

              onSuccess();
            }} />
          </form>
        </div>
      </Block>
    </div>
  </>
}

export default SignAuthLetter;
