import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Header() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    // Function to handle logout
    const handleLogout = () => {
        setIsLoading(true); // Set loading state to true

        // Simulate a delay to show the loading state
        setTimeout(() => {
            localStorage.removeItem("userToken"); // Remove stored token
            navigate("/"); // Navigate to login page
            setIsLoading(false); // Set loading state to false after navigation
        }, 2000); // 2-second delay for demonstration purposes
    };

    return (
        <header className="app-header sticky bg-white text-black shadow-lg">
            <div className="main-header-container container-fluid flex justify-between items-center px-4 py-2">
                <div className="header-content-left flex items-center gap-4">
                    <button
                        aria-label="Hide Sidebar"
                        className="sidemenu-toggle header-link flex items-center gap-2 text-black"
                        onClick={() => console.log("Toggle Sidebar")} // Replace with actual sidebar toggle logic
                    >
                        {/* Sidebar Toggle Icon */}
                    </button>

                    {/* Search Bar with Icon Outside */}
                    <div className="header-element hidden md:flex items-center gap-2 border rounded-lg px-3 py-2">
                        <button className="text-black">
                            <i className="ri-search-line"></i> {/* Search Icon */}
                        </button>
                        <input
                            type="text"
                            className="header-search-bar text-black px-3 py-1 outline-none w-64 md:w-96 lg:w-[400px]"
                            id="header-search"
                            placeholder="Search anything here..."
                        />
                    </div>
                </div>

                {/* Logout Button */}
                <div className="header-content-right">
                    <button
                        className="flex items-center gap-2 text-red-600 px-4 py-2 rounded-lg border border-red-600 hover:bg-red-100 transition"
                        onClick={handleLogout}
                        disabled={isLoading} // Disable the button while loading
                    >
                        {isLoading ? (
                            <span className="font-medium">Logging out...</span>
                        ) : (
                            <span className="font-medium">Log out</span>
                        )}
                    </button>
                </div>
            </div>
            {isLoading && (
                <div className="loading-message">
                    <p>Logging out...</p>
                </div>
            )}
        </header>
    );
}

export default Header;
