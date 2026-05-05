import Hero from "../components/Hero"

const Home = () => {
    return (
        <div className='bg-[#b6edbc] min-h-screen'>

            <Hero />

            <div className="flex flex-col items-center justify-center gap-4 bg-green-500 w-1/2 mx-auto rounded-2xl pt-10">
                <h1 className="text-3xl font-bold">Why Choose Eco-connect?</h1>
                <div className="flex gap-8  mt-7 px-10 text-justify text-lg pb-10">
                    Eco-connect helps people easily find businesses that care about the environment. It connects users with eco-friendly  companies that follow sustainable practices and supports local communities. Every business on the platform is reviewed and verified, so users can trust the information.  By choosing Eco-connect, people can support responsible businesses and make a positive impact on the environment.
                </div>
            </div>
        </div>
    )
}

export default Home