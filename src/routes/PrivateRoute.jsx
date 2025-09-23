import { Navigate } from 'react-router-dom';
import { routes } from './routes';



const isAuthenticated = true;  

const PrivateRoute = ({ element }) => {
  return isAuthenticated ? element : <Navigate to={routes.PUBLIC.LOGIN} />;
};

export default PrivateRoute;
