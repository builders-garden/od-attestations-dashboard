const isCIDValid: (cid: string) => boolean = (cid: string) => {
  return (
    (cid.startsWith("Qm") && cid.length === 46) ||
    (cid.startsWith("baf") && cid.length === 59)
  );
};

/**
 * Upload image to IPFS
 * @param imageFile Image file to upload, must be a File object (e.g. from an input element)
 * @returns IPFS hash of the uploaded image
 */
export const uploadImageToIpfs: (
  imageFile: File | null,
) => Promise<string | undefined> = async (imageFile: File | null) => {
  try {
    if (!imageFile) throw new Error("No image file provided");

    const formData = new FormData();
    formData.append("file", imageFile);

    const response = await fetch("/api/ipfs", {
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

/**
 * Get image from IPFS as a URL
 * @param ipfsHash IPFS hash of the image
 * @returns URL of the image, insert this URL into the src attribute of an img tag to display the image
 */
export const getImageFromIpfs: (ipfsHash: string) => Promise<string> = async (
  ipfsHash: string,
) => {
  if (!isCIDValid(ipfsHash)) {
    console.error("Invalid IPFS hash");
    return "";
  }
  try {
    const response = await fetch(`/api/ipfs?hash=${ipfsHash}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Failed to get image");
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);

    return url;
  } catch (error) {
    console.error("Error getting image:", error);
    return "";
  }
};
