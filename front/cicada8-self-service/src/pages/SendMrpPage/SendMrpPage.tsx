import Block from "../../commons/Block";
import StepBlock from "../../commons/StepBlock";
import FileUploadButton, { UserData } from "./FileUploadButton";

type SendMrpPageProps = {
  onSuccess: (userData: UserData) => void;
}

const SendMrpPage: React.FC<SendMrpPageProps> = ({onSuccess}) => {
  return <>
        <StepBlock>1 шаг: Регистрация</StepBlock>
        <Block>
          <div className='info'>
            <h1 className="register">Регистрация</h1>
            <div className="text smallText">
              <p>Для начала регистрации получите машиночитаемую доверенность. По ссылке вы можете найти статью, способную помочь вам:</p>
              <a href='https://partners.gosuslugi.ru/catalog/attorney' target='_blank'>https://partners.gosuslugi.ru/catalog/attorney</a>
            </div>
          </div>
          <FileUploadButton onSuccess={onSuccess}></FileUploadButton>
      </Block>
    </>
}

export default SendMrpPage;
