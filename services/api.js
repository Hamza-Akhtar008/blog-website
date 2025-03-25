const API_URL = process.env.NEXT_PUBLIC_API_URL;
export const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_URL}/categories/all-categories`);
      if (!response.ok) throw new Error("Failed to fetch categories");
  
      const data = await response.json();
      return data; // Returns { success: true, data: [...] }
    } catch (error) {
      console.error("❌ Error fetching categories:", error);
      return null; // Handle failure
    }
  };

  export const fetchTrendingTopics = async () => {
    try {
      const response = await fetch(`${API_URL}/trending/alltrend`);
      if (!response.ok) throw new Error("Failed to fetch trending topics");
  
      const data = await response.json();
      return data; // Expected format: { success: true, data: [...] }
    } catch (error) {
      console.error("❌ Error fetching trending topics:", error);
      return null; // Handle failure gracefully
    }
  };

  export const fetchArticles = async () => {
    try {
      const response = await fetch(`${API_URL}/articles`);
      if (!response.ok) throw new Error("Failed to fetch trending topics");
  
      const data = await response.json();
      return data; // Expected format: { success: true, data: [...] }
    } catch (error) {
      console.error("❌ Error fetching trending topics:", error);
      return null; // Handle failure gracefully
    }
  };
 

  

  export const adminfetch = async () => {
    try {
      const response = await fetch(`${API_URL}/admin-fetch`);
      if (!response.ok) throw new Error("Failed to fetch trending topics");
  
      const data = await response.json();
      return data; // Expected format: { success: true, data: [...] }
    } catch (error) {
      console.error("❌ Error fetching trending topics:", error);
      return null; // Handle failure gracefully
    }
  };