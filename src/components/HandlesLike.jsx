const handleLike = async (id) => {
  try {
    const response = await fetch(
      `https://happy-thoughts-api-4ful.onrender.com/thoughts/${id}/like`,
      {
        method: "POST",
      }
    );
    if (response.ok) {
      return await response.json();
    } else {
      console.error("Failed to add heart 😞: Response not OK");
      return null;
    }
  } catch (error) {
    console.error("Unable to add heart 😞:", error);
    return null;
  }
};

export default handleLike;
