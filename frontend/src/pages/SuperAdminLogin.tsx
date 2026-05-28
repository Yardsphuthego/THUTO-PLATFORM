import { AdminLoginPanel } from '../components/AuthPanels';

export default function SuperAdminLogin(): JSX.Element {
  return (
    <div className="auth-modal__page">
      <AdminLoginPanel />
    </div>
  );
}
