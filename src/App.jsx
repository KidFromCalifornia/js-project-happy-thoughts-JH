import { useState, useEffect, Suspense, lazy } from "react";
import MessageList from "./components/MessageList";
import MessageForm from "./components/MessageForm";
import handleLike from "./components/HandlesLike";
import { Footer } from "./styles/Footer";
import NavBar from "./components/NavBar";

const LoadingSpinner = lazy(() => import("./components/LoadingSpinner"));

export const App = () => {
  const [thoughts, setThoughts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state for fetching thoughts
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    localStorage.removeItem("userToken");
    setIsLoggedIn(false);
    setCurrentUser(null);
  }, []);

  // Remove a thought after delete
  const handleDeleteThought = (id) => {
    setThoughts((prev) => prev.filter((thought) => thought._id !== id));
  };

  // Update a thought after edit
  const handleEditThought = (updatedThought) => {
    setThoughts((prev) =>
      prev.map((thought) =>
        thought._id === updatedThought._id ? updatedThought : thought
      )
    );
  };

  // Fetch thoughts when the app loads
  useEffect(() => {
    fetch("https://js-project-api-k17p.onrender.com/thoughts")
      .then((res) => res.json())
      .then((data) => {
        setThoughts(data);
        setLoading(false); // Stop loading after data is fetched
      })
      .catch((error) => {
        console.error(
          "Oh no! Previous thoughts are unavailable currently:",
          error
        );
        setLoading(false); // Stop loading even if there's an error
      });
  }, []);

  const onLike = (id) => {
    handleLike(id).then(() => {
      setThoughts((prevThoughts) =>
        prevThoughts.map((thought) =>
          thought._id === id
            ? { ...thought, hearts: thought.hearts + 1 }
            : thought
        )
      );
    });
  };

  const [searchResults, setSearchResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); // Track the current search query

  return (
    <>
      <header>
        <NavBar
          searchResults={searchResults}
          setSearchResults={setSearchResults}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showLogin={showLogin}
          setShowLogin={setShowLogin}
          isLoggedIn={isLoggedIn}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentUser={setCurrentUser}
        />
      </header>
      <main>
        {loading ? (
          <Suspense fallback={<div>Loading spinner...</div>}>
            <LoadingSpinner />
          </Suspense>
        ) : (
          <>
            <MessageForm
              onSubmit={(newThought) => setThoughts([newThought, ...thoughts])}
            />
            <MessageList
              aria-live="polite"
              thoughts={searchResults.length > 0 ? searchResults : thoughts}
              onLike={onLike}
              onDelete={handleDeleteThought}
              onEdit={handleEditThought}
              isLoggedIn={isLoggedIn}
              currentUser={currentUser}
            />
          </>
        )}
      </main>
      <Footer>
        <div>
          Made with ❤️ by{" "}
          <a
            href="https://github.com/KidFromCalifornia/js-project-happy-thoughts-JH"
            target="_blank"
            rel="noopener noreferrer"
          >
            Jonny Hicks
          </a>
        </div>
      </Footer>
    </>
  );
};
