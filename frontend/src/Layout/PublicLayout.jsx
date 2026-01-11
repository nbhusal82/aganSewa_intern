import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">,,,,,,,,,,,,,,,,,,</header>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default PublicLayout;
