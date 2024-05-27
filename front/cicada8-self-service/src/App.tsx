import { useState } from 'react';
import './App.css';
import SendMrpPage from './pages/SendMrpPage/SendMrpPage';
import SignAuthLetter from './pages/SignAuthLetter/SignAuthLetter';
import { UserData } from './pages/SendMrpPage/FileUploadButton';
import SendInformationPage from './pages/SendInformationPage/SendInformationPage';

function App() {
  const [currentStep, setCurrentStep] = useState(1);

  const [userData, setUserData] = useState<UserData| null>(null); 

  return (<div className='container'>
    {currentStep === 1 && <SendMrpPage onSuccess={(userData) => {
      setUserData(userData);
      setCurrentStep((cs) => cs + 1);
    }}/>}
    {currentStep === 2 && userData && <SignAuthLetter userData={userData} onSuccess={() => {
      setCurrentStep((cs) => cs + 1);
    }}/>}
    {currentStep === 2 && !userData && "Error no UserData was fetched"}
    {currentStep === 3 && <SendInformationPage onSuccess={() => alert('congratulations')}/>}
  </div>);
}

export default App
