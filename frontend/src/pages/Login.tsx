import { StudentLoginPanel } from '../components/AuthPanels';

export const Login = (): JSX.Element => {
  return (
    <div className="auth-modal__page">
      <StudentLoginPanel />
    </div>
  );
};
