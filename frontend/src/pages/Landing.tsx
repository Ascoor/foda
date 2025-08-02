import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6">
        <h1 className="text-4xl font-bold mb-4">FODA System</h1>
        <p className="text-xl text-muted-foreground">Organize your campaigns effectively.</p>
        <Link
          to="/login"
          className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:opacity-90"
        >
          Login
        </Link>
      </div>
    </div>
  );
};

export default Landing;
