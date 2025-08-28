import './Dashboard.css'
import MovieList from '../MovieList/MovieList';
import MessageBoard from '../MessageBoard/MessageBoard';
import { Link } from 'react-router';


const Dashboard = () => {
    return (


        
        <div className="main-dash-container d-flex flex-column justify-content-between">
            
            <nav className="dashboard-nav p-2 d-flex flex-row justify-content-between align-items-center">

                <h2>LuluFlix</h2>

                <Link to='/'>Logout</Link>

            </nav>

          

            <div className="h-100 w-100 d-flex flex-column justify-content-center align-items-center p-4">

                <div className="row h-100 w-100 gap-2">

                    <div className="container col-8 border-shadow dashboard-containers">

                        <MovieList/>

                    </div>

                    <div className="col container border-shadow dashboard-containers">

                        <MessageBoard/>

                    </div>

                </div>

            </div>

        

        </div>
    )
}

export default Dashboard;
//0.375rem