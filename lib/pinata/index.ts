export const uploadImageToPinata: (
  imageFile: File | null,
) => Promise<string | undefined> = async (imageFile: File | null) => {
  try {
    if (!imageFile) throw new Error("No image file provided");

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/pinata", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();

    if (data?.hash) {
      return data.hash;
    } else {
      throw new Error("Failed to upload image");
    }
  } catch (error) {
    console.error("Error uploading image:", error);
  }
};

export const getImageFromPinata: (
  ipfsHash: string,
) => Promise<Response> = async (ipfsHash: string) => {
  const response = await fetch(`/api/pinata?hash=${ipfsHash}`, {
    method: "GET",
  });

  if (!response.ok) {
    throw new Error("Failed to get image");
  }

  return response;
};
