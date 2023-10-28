import { useState } from 'react';
import SignUp from './SignUp';
import SignIn from './SignIn';

export default function Auth() {
  const [screen, setScreen] = useState('sign_up');

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="min-w-[280px]">
        {screen === 'sign_up' ? <SignUp /> : <SignIn />}
        <div className="w-full flex justify-center pt-2">
          or{' '}
          <span
            className="pl-2 underline cursor-pointer"
            onClick={() => {
              if (screen === 'sign_up') return setScreen('sign_in');
              return setScreen('sign_up');
            }}
          >
            {screen === 'sign_up' ? 'Sign In' : 'Sign Up'}
          </span>
        </div>
      </div>
    </div>
  );
}
