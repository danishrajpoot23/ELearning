export const sendContact = async (data) => {
  try {
    const res = await fetch("http://localhost:5000/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Agar server ne kuch bhi return nahi kiya
    if (!res.ok) {
      throw new Error(`Server error: ${res.status}`);
    }

    const json = await res.json();  // ✅ ye tabhi chalega jab backend JSON bheje
    return json;
  } catch (err) {
    console.error("Error submitting form:", err);
    throw err;
  }
};

