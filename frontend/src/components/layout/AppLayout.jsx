import { Outlet } from 'react-router-dom';
import Header from './Header';
import './AppLayout.css';

export default function AppLayout() {
  return (
    <div className="app-layout">
      <div className="app-content-wrapper">
        <Header />
        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
