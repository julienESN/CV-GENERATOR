import Header from '../components/Header';

const DashboardPage = () => {
  return (
    <div>
      <Header />
      <div className="p-6">
        <h1 className="text-2xl font-bold">Welcome to your Dashboard!</h1>
        <p>This page is protected. You are logged in.</p>
      </div>
    </div>
  );
};

export default DashboardPage;
