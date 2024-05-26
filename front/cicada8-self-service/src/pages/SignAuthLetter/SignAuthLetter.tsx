import { useEffect, useState } from "react";
import Block from "../../commons/Block";
import StepBlock from "../../commons/StepBlock";
import AuthLetterPreview from "./AuthLetterPreview";
import getAuthLetter from "../../api/getAuthLetter";
import { UserData } from "../SendMrpPage/FileUploadButton";

type SugnAuthLetterProps = {
  userData: UserData;
  onSuccess: () => void;
}

const SignAuthLetter: React.FC<SugnAuthLetterProps> = ({ userData, onSuccess }) => {
  const [state, setState] = useState<"initial" | "loading" | "error" | "success">("initial");
  const [document, setDocument] = useState<File | null>(null);

  useEffect(() => {
    const fetchAuthLetter = async () => {
      const document = await getAuthLetter(userData, setState);

      setDocument(document ?? null);
    };

    fetchAuthLetter();
  }, [userData]);


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
          <div style={{
            backgroundColor: '#D9D9D9',
            height: "50px",
            width: "240px",
            borderRadius: "10px",
            color: '#232323',
          }}></div>
          <form action="http://localhost:8083/sendAuthMail" method="post" encType="multipart/form-data">
            <input type="email" autoComplete="email" placeholder="Введите свой Email" />
            <input type="submit" className='button' value={"Подписать"} onSubmit={onSuccess} />
          </form>
        </div>
      </Block>
    </div>
  </>
}

export default SignAuthLetter;
