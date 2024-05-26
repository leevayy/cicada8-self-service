import { useState } from 'react';
import './App.css'
import StepBlock from './commons/StepBlock';
import Block from './commons/Block';
import FileUploadButton, { UserData } from './commons/FileUploadButton';

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const [userData, setUserData] = useState<UserData | null>(null); 

  // 3 шаг: Информация

  return (<div className='container'>
    {currentStep === 1 && (<>
      <StepBlock>1 шаг: Регистрация</StepBlock>
        <Block>
          <div className='info'>
            <h1>Регистрация</h1>
            <div className="text smallText">
              <p>Для начала регистрации получите машиночитаемую доверенность. По ссылке вы можете найти статью, способную помочь вам:</p>
              <a href='https://partners.gosuslugi.ru/catalog/attorney' target='_blank'>https://partners.gosuslugi.ru/catalog/attorney</a>
            </div>
          </div>
          <FileUploadButton onSuccess={(userData) => {
            setUserData(userData);
            setCurrentStep((cs) => cs + 1);
          }}></FileUploadButton>
      </Block>
    </>
    )}
    {currentStep === 2 && (<>
      <StepBlock>2 шаг: Подпись</StepBlock>
        <Block>
          <div className='info'>
            <h1>Регистрация</h1>
            <div style={{
              backgroundColor: '#f5f5f5',
              height: "500px",
              width: "400px",
            }} />
          </div>
          <form action="localhost:8083/sendAuthMail" ></form>
          <button className='button'>Подписать</button>
      </Block>
    </>
    )}

  </div>);
}

export default App
