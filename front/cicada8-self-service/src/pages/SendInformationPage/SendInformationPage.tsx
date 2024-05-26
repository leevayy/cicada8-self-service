import Block from "../../commons/Block";
import StepBlock from "../../commons/StepBlock";

type SendInformationPageProps = {
    onSuccess: () => void;
}

const SendInformationPage: React.FC<SendInformationPageProps> = ({ onSuccess }) => {
    return <>
        <StepBlock>3 шаг: Информация</StepBlock>
        <Block>
            <div className='info'>
                <h1 className="register">Заполните форму ниже</h1>
                <form action="http://localhost:8083/send" method="post" encType="multipart/form-data">
                    <input type="text" placeholder="Введите свое ФИО" />
                    <input type="number" placeholder="Введите свой ИНН" />
                    <input type="number" placeholder="Введите свой СНИЛС" />
                    <input type="submit" className='button' value={"Подписать"} onSubmit={onSuccess} />
                </form>
            </div>
        </Block>
    </>
}

export default SendInformationPage;
