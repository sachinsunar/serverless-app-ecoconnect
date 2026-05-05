import { Link } from "react-router-dom"

const Footer = () => {
    return (
        <div>
            <div className="bg-green-300 flex justify-around px-4 py-5">
                <div className="w-1/3">
                    <h1 className="font-bold text-lg">  Eco connect</h1>
                    <p>It is a digital platform that connects people with eco-friendly businesses in Coventry.</p>
                </div>

                <div>
                    <h1 className="text-lg font-bold">Explore</h1>
                    <Link to={'/listings'}>Businesses</Link>
                    <p>Reviews</p>
                    <p>Sustainable Living</p>
                </div>

                <div>
                    <h1 className="text-lg font-bold">Project Info</h1>
                    <p>Serverless Web Application</p>
                    <p>Coventry EcoConnect</p>
                </div>
            </div>
            <div className='flex items-center justify-center px-4 bg-green-600 py-5 text-white shadow-lg'>
                <p>&copy; {new Date().getFullYear()} Eco Connect All rights reserved. | Design and Developed by Sachin</p>
            </div>
        </div>
    )
}

export default Footer